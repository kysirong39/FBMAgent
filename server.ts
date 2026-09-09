import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  detectSportFromText,
  sanitizeCtaForSport,
  sanitizeNotesForSport,
  SPORT_CTA_PRESETS,
} from './src/data/sportsContextHelper';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client with lazy init
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables.');
    }
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Helper to fetch and clean web page content
async function fetchWebPageContent(targetUrl: string): Promise<{ title: string; metaDesc: string; textSnippet: string; rawSnippet: string }> {
  let normalizedUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const resp = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`HTTP status ${resp.status}`);
    }

    const html = await resp.text();

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

    const metaDescMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';

    // Strip script, style, svg, noscript, html tags
    const textSnippet = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3500);

    const rawSnippet = [
      title || ogTitle ? `Tiêu đề: ${ogTitle || title}` : '',
      metaDesc ? `Mô tả: ${metaDesc}` : '',
      textSnippet ? `Nội dung: ${textSnippet.slice(0, 2000)}` : '',
    ].filter(Boolean).join('\n');

    return {
      title: ogTitle || title,
      metaDesc,
      textSnippet,
      rawSnippet,
    };
  } catch (err: any) {
    console.warn(`Could not fetch URL "${normalizedUrl}":`, err?.message || err);
    try {
      const parsed = new URL(normalizedUrl);
      const slug = parsed.pathname.replace(/[_\-/]+/g, ' ').trim();
      return {
        title: slug || parsed.hostname,
        metaDesc: '',
        textSnippet: `Nguồn: ${parsed.hostname} - ${slug}`,
        rawSnippet: `Nguồn: ${parsed.hostname} - ${slug}`,
      };
    } catch {
      return {
        title: '',
        metaDesc: '',
        textSnippet: '',
        rawSnippet: '',
      };
    }
  }
}

// Endpoint to extract product information from URL
app.post('/api/extract-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Vui lòng cung cấp link URL bài viết hoặc sản phẩm hợp lệ.' });
  }

  try {
    const pageData = await fetchWebPageContent(url.trim());
    if (!pageData.rawSnippet && !pageData.title) {
      return res.status(400).json({
        error: 'Không thể truy cập hoặc đọc dữ liệu từ đường link này. Vui lòng kiểm tra lại URL hoặc nhập thông tin thủ công.',
      });
    }

    const ai = getGenAI();
    const extractPrompt = `Bạn là trợ lý AI chuyên gia phân tích và bóc tách dữ liệu sản phẩm / bài viết thể thao từ website (thương mại điện tử, landing page, bài báo review hoặc hãng thể thao).
Dưới đây là nội dung trích xuất từ trang web:
- URL: ${url.trim()}
- Tiêu đề web: ${pageData.title}
- Mô tả meta: ${pageData.metaDesc}
- Nội dung văn bản: ${pageData.textSnippet.slice(0, 2500)}

Hãy phân tích kỹ và trích xuất thành định dạng JSON với các thông số sau:
{
  "productName": "Tên đầy đủ của sản phẩm/dụng cụ hoặc bài viết",
  "sportCategory": "Chọn 1 môn phù hợp nhất: Pickleball, Cầu lông, Bóng đá, Máy tập gym & Cardio, Bóng rổ, Bóng bàn, Bơi lội, Yoga & Thể hình, hoặc Dụng cụ thể thao khác",
  "productDescription": "Tóm tắt từ 3-5 tính năng kỹ thuật, công nghệ trợ lực, chất liệu cao cấp (VD: carbon, đệm khí silicon, nano chống đọng sương,...), độ giảm chấn hoặc lợi ích thể thao vượt trội",
  "targetAudience": "Đối tượng người chơi hoặc khách hàng mục tiêu phù hợp nhất",
  "offerDetails": "Giá bán, chương trình giảm giá, quà tặng đi kèm (nếu phát hiện trong bài)",
  "marketingAngle": "Gợi ý 1 trong: Tăng hiệu suất & Nâng trình thi đấu, Đốt mỡ giảm cân & Lột xác vóc dáng, Bảo vệ cơ khớp & Chống chấn thương, Đam mê & Giao lưu phong trào CLB, Ưu đãi số lượng lớn & Xả kho quà tặng",
  "callToAction": "Lời kêu gọi hành động (CTA) THỰC SỰ PHÙ HỢP 100% VỚI SẢN PHẨM VÀ BỘ MÔN (Ví dụ: nếu là Kính bơi/Đồ bơi: 'Nhắn tin ngay để chọn mẫu kính bơi vừa vặn chống nước & nhận quà tặng!', nếu là Giày: 'Nhắn tin ngay để chọn chuẩn size chân & nhận quà tặng!', nếu là Máy chạy bộ: 'Để lại số điện thoại để nhận lịch hẹn giao và lắp đặt miễn phí tại nhà!'. TUYỆT ĐỐI KHÔNG dùng từ ngữ môn khác như 'test vợt', 'căng cước')",
  "additionalNotes": "Gợi ý điểm nhấn trải nghiệm riêng biệt cho sản phẩm này"
}

Chỉ xuất duy nhất khối mã JSON hợp lệ nằm trong \`\`\`json ... \`\`\`.`;

    let extractedJson: any = null;
    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: extractPrompt,
        config: {
          temperature: 0.2,
        },
      });
      const text = resp.text || '';
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        extractedJson = JSON.parse(match[1].trim());
      }
    } catch (aiErr) {
      console.warn('AI extraction fallback:', aiErr);
    }

    if (!extractedJson) {
      const textToAnalyze = pageData.title + ' ' + pageData.metaDesc + ' ' + pageData.textSnippet;
      const detectedCategory = detectSportFromText(textToAnalyze);

      extractedJson = {
        productName: pageData.title || 'Sản phẩm thể thao chính hãng',
        sportCategory: detectedCategory,
        productDescription: pageData.metaDesc || pageData.textSnippet.slice(0, 300) || 'Dụng cụ thể thao cao cấp nâng cao hiệu suất tập luyện và thi đấu.',
        targetAudience: 'Người chơi thể thao và tập luyện thể hình',
        offerDetails: 'Ưu đãi quà tặng và giao hàng toàn quốc',
        marketingAngle: 'Tăng hiệu suất & Nâng trình thi đấu',
      };
    }

    // Ensure category, callToAction and additionalNotes are strictly coherent
    const finalCategory = detectSportFromText(
      (extractedJson.productName || '') + ' ' + (extractedJson.sportCategory || '') + ' ' + (pageData.title || '')
    ) || extractedJson.sportCategory || 'Dụng cụ thể thao khác';

    extractedJson.sportCategory = finalCategory;
    extractedJson.callToAction = sanitizeCtaForSport(
      finalCategory,
      extractedJson.productName || '',
      extractedJson.callToAction || ''
    );
    extractedJson.additionalNotes = sanitizeNotesForSport(
      finalCategory,
      extractedJson.productName || '',
      extractedJson.additionalNotes || ''
    );

    return res.json({
      success: true,
      data: {
        ...extractedJson,
        productUrl: url.trim(),
      },
    });
  } catch (error: any) {
    console.error('Error extracting from URL:', error);
    return res.status(500).json({
      error: error?.message || 'Có lỗi xảy ra khi quét dữ liệu từ đường dẫn.',
    });
  }
});

// Campaign generation endpoint
app.post('/api/generate-campaign', async (req: Request, res: Response) => {
  try {
    const {
      productUrl = '',
      productName,
      sportCategory = 'Dụng cụ thể thao',
      marketingAngle = 'Tăng hiệu suất & Nâng trình thi đấu',
      productDescription,
      targetAudience,
      offerDetails,
      copywritingFormula = 'AIDA',
      toneOfVoice = 'Sôi động, nhiệt huyết & chuyên nghiệp',
      scheduledPublishTime = null,
      callToAction = 'Nhắn tin ngay để nhận tư vấn & ưu đãi thể thao',
      additionalNotes = '',
    } = req.body;

    if (!productName || !productDescription) {
      return res.status(400).json({
        error: 'Vui lòng cung cấp Tên sản phẩm/dụng cụ và Mô tả chi tiết.',
      });
    }

    // Context integrity: auto-detect and sanitize category, CTA and notes
    const effectiveCategory =
      detectSportFromText(productName + ' ' + (sportCategory || '')) || sportCategory || 'Dụng cụ thể thao khác';
    const effectiveCta = sanitizeCtaForSport(effectiveCategory, productName, callToAction);
    const effectiveNotes = sanitizeNotesForSport(effectiveCategory, productName, additionalNotes);

    const ai = getGenAI();

    const systemPrompt = `Bạn là một Giám đốc Sáng tạo và Chuyên gia Marketing Facebook hàng đầu chuyên biệt trong lĩnh vực THỂ DỤC THỂ THAO, MÁY TẬP & DỤNG CỤ THỂ THAO (Pickleball, Cầu lông, Bóng đá, Máy tập Gym/Cardio, Bóng rổ, Bóng bàn, Bơi lội, Yoga & Fitness).
Nhiệm vụ của bạn là tiếp nhận thông tin về dụng cụ, máy tập hoặc sản phẩm thể thao từ người dùng, sau đó tạo ra nội dung marketing thể thao đỉnh cao, giàu năng lượng, kích thích đam mê vận động, kịch bản video ngắn cuốn hút và câu lệnh tạo ảnh thể thao siêu thực, xuất dữ liệu chuẩn để tự động đăng lên Facebook.

# NGUYÊN TẮC BẢO TOÀN NGỮ CẢNH (CONTEXT INTEGRITY - TUYỆT ĐỐI KHÔNG LỆCH MÔN):
- BẠN BẮT BUỘC PHẢI ĐỐI CHIẾU SẢN PHẨM & BỘ MÔN VỚI MỌI TỪ NGỮ TRONG BÀI VIẾT, LỜI KÊU GỌI HÀNH ĐỘNG (CTA), HÌNH ẢNH VÀ KỊCH BẢN VIDEO.
- NẾU SẢN PHẨM LÀ BƠI LỘI (kính bơi, mũ bơi, phao, đồ bơi,...):
  + Bài viết phải tập trung vào cảm giác sảng khoái dưới nước, chống đọng sương (anti-fog), vành đệm silicon êm ái chống rò rỉ nước, bảo vệ mắt khỏi clo/nước muối, tầm nhìn trong vắt 180 độ.
  + Lời kêu gọi hành động (CTA) PHẢI là tư vấn chọn kính bơi/độ cận/chọn mẫu & nhận quà tặng bơi lội.
  + TUYỆT ĐỐI NGHIÊM CẤM chứa bất kỳ từ ngữ nào liên quan đến: 'vợt', 'test vợt', 'sân đấu', 'mặt sân', 'cú smash', 'dink bóng', 'căng cước', 'đá bóng'.
- NẾU SẢN PHẨM LÀ BÓNG ĐÁ / GIÀY ĐÁ BÓNG:
  + Tập trung vào form chân bè, đinh TF bám sân cỏ nhân tạo, tiếp bóng dính chân, giảm chấn gót. CTA chọn size giày/thử giày. TUYỆT ĐỐI KHÔNG dùng 'vợt' hay 'bơi lội'.
- NẾU SẢN PHẨM LÀ MÁY TẬP GYM / CHẠY BỘ:
  + Tập trung vào đốt mỡ tại nhà, giảm chấn khớp gối, động cơ êm, gấp gọn. CTA trải nghiệm/lắp đặt tại nhà. TUYỆT ĐỐI KHÔNG dùng 'vợt' hay 'kính bơi'.
- CHỈ KHI SẢN PHẨM LÀ VỢT (Pickleball, Cầu lông, Tennis, Bóng bàn): mới được dùng 'test vợt', 'căng cước', 'dink bóng', 'smash'.

# AM HIỂU CHUYÊN SÂU NGÀNH THỂ THAO & DỤNG CỤ:
- Nắm vững các tiêu chuẩn kỹ thuật của dụng cụ thể thao:
  + Pickleball: sợi Carbon Toray T700, bề mặt nhám spin tạo xoáy, lõi tổ ong Polypropylene polymer giảm chấn 16mm/13mm, dink bóng, drive, reset bóng, smash, chuẩn USAPA.
  + Cầu lông: trọng lượng 3U/4U/5U trợ lực, điểm cân bằng đầu vợt nặng (Head-heavy công) hoặc cân bằng (công thủ toàn diện), độ dẻo đũa vợt, sức căng cước 28-30 LBS, smash cắm sân, phông cầu, phản tạt.
  + Máy tập gym & cardio: động cơ mã lực HP êm ái, hệ thống đệm khí giảm chấn bảo vệ khớp gối và cột sống, độ dốc tự động đốt mỡ, khung thép hộp chịu lực, màn hình theo dõi nhịp tim/calo, gấp gọn tại nhà.
  + Bóng đá: da Microfiber mềm ôm chân bè, đinh TF sân cỏ nhân tạo chống trượt, đệm giảm chấn gót chân bảo vệ cổ chân, cảm giác bóng thật, sút bóng mu bàn chân uy lực.
  + Bóng rổ: da PU vân nhám sâu bám tay, ruột Butyl giữ hơi, độ nảy chuẩn FIBA, chống mài mòn sân bê tông outdoor.
  + Bơi lội: tráng gương chống tia UV ngoài trời, nano anti-fog chống hấp hơi đọng sương, góc nhìn rộng 180 độ, vành silicon y tế êm hốc mắt, chống tràn nước tuyệt đối.
  + Bóng bàn: cốt carbon 5+2, mút tacky xoáy giật bóng, độ nảy đàn hồi chuẩn ITTF.

# NHIỆM VỤ CỐT LÕI:
1. TẠO BÀI ĐĂNG FACEBOOK (VĂN BẢN):
- Viết nội dung giật tít đánh trúng đam mê, nỗi đau tập luyện hoặc mong muốn nâng trình ngay từ 3 dòng đầu tiên (Scroll-stopping hook).
- Áp dụng chuẩn xác công thức: ${copywritingFormula} (AIDA, PAS, Storytelling, FOMO, hoặc FAB).
- Góc tiếp cận (Marketing Angle): ${marketingAngle}.
- Văn phong/Tone: ${toneOfVoice}.
- Có Lời kêu gọi hành động (CTA) dứt khoát: ${effectiveCta}.
- Chèn Emoji thể thao năng động phù hợp đúng bộ môn tinh tế, chuyên nghiệp.
- Cung cấp 3-5 thẻ Hashtag thịnh hành đúng theo bộ môn và tên sản phẩm.
- QUY TẮC ĐỊNH DẠNG MARKDOWN TINH GỌN (CHỐNG RÁC DẤU HOA THỊ *):
  + Sử dụng định dạng in đậm Markdown (**từ khóa**) có chọn lọc cho tiêu đề chính và các thông số cốt lõi quan trọng nhất.
  + TUYỆT ĐỐI KHÔNG bọc dấu hoa thị (*) hoặc (**) vào từng từ đơn lẻ, từng câu vụn vặt làm văn bản bị rối mắt hoặc chi chít dấu *.
  + Dùng dấu gạch ngang đầu dòng (- ) kèm khoảng trắng cho các gạch đầu dòng tính năng, không dùng dấu hoa thị đơn (*) rời rạc.
  + Ngắt đoạn thông thoáng (mỗi ý cách nhau 1 dòng trống) để bài viết dễ đọc trên cả máy tính lẫn điện thoại di động.

2. TẠO CÂU LỆNH HÌNH ẢNH / KỊCH BẢN VIDEO THỂ THAO:
- Hình ảnh: 1 câu lệnh (prompt) chi tiết bằng tiếng Anh (cho Midjourney v6, DALL-E 3) chụp ảnh thể thao thương mại hoặc khoảnh khắc thi đấu/tập luyện đỉnh cao của sản phẩm ${productName} (${effectiveCategory}). Yêu cầu: bối cảnh đúng bộ môn (hồ bơi trong xanh, sân đấu hiện đại hoặc phòng gym cao cấp), ánh sáng rực rỡ cinematic rim lighting, hiệu ứng chuyển động dynamic action shot, chi tiết sắc nét 8k octane render, commercial sports product photography --ar 1:1.
- Video ngắn (15-30 giây): Kịch bản Reels/TikTok thể thao bùng nổ năng lượng gồm 3 mốc thời gian:
  + Giây 0-3: Visual hành động tốc độ cao phù hợp bộ môn ${effectiveCategory}; Audio: âm thanh thể thao sống động (tiếng nước rẽ sóng, tiếng đập bóng, tiếng bước chạy dứt khoát) + nhịp tim dồn dập.
  + Giây 3-10: Cận cảnh công nghệ sản phẩm ${productName} hỗ trợ bứt phá phong độ; Audio: nhạc nền workout thể thao sôi động bốc lửa.
  + Giây 10-15: Kêu gọi hành động giữ ưu đãi/combo thể thao độc quyền: ${effectiveCta}; Audio: âm thanh chốt hạ dứt khoát.

3. ĐÓNG GÓI DỮ LIỆU ĐỂ TỰ ĐỘNG HÓA (ĐỊNH DẠNG JSON):
- Cung cấp một đoạn mã JSON chuẩn xác, hợp lệ, chứa nội dung bài viết và prompt ảnh để các hệ thống tự động hóa (Facebook Graph API, Webhook, n8n, Make) có thể gọi API trực tiếp.

# ĐỊNH DẠNG ĐẦU RA BẮT BUỘC:
Bạn PHẢI phản hồi chính xác tuyệt đối theo cấu trúc sau (giữ nguyên các tiêu đề cấp 3):

### 📝 BÀI VIẾT FACEBOOK
[Nội dung bài viết thể thao đầy đủ của bạn ở đây. Ngắt dòng chuẩn cho Facebook, chèn Emoji hợp lý]
[Lời kêu gọi hành động: ${effectiveCta}]
[3-5 Hashtag]

### 🎨 GỢI Ý HÌNH ẢNH / VIDEO
**Câu lệnh tạo ảnh (Bằng tiếng Anh):**
[Chèn câu lệnh chi tiết bằng tiếng Anh, ví dụ: "A dynamic commercial sports product shot of..."]

**Kịch bản Video ngắn (Tùy chọn nếu cần thiết):**
- Giây 0-3: [Visual & Audio mô tả hook mở đầu thể thao]
- Giây 3-10: [Visual & Audio mô tả công nghệ dụng cụ và bứt phá thể lực]
- Giây 10-15: [Visual & Audio mô tả ưu đãi combo quà tặng và CTA chốt]

### ⚙️ CẤU TRÚC JSON (DỮ LIỆU API)
\`\`\`json
{
  "platform": "facebook",
  "post_type": "text_with_media",
  "message": "[Chèn nguyên văn nội dung Bài viết Facebook ở trên vào đây, sử dụng \\n để ngắt dòng]",
  "scheduled_publish_time": ${scheduledPublishTime ? `"${scheduledPublishTime}"` : 'null'},
  "media_generation_prompt": "[Chèn nguyên văn câu lệnh tạo ảnh bằng tiếng Anh vào đây]"
}
\`\`\``;

    const userPrompt = `Hãy tạo chiến dịch Facebook Marketing hoàn chỉnh cho dụng cụ / sản phẩm thể thao sau:
${productUrl ? `- Link web / URL sản phẩm hoặc bài viết: ${productUrl}` : ''}
- Tên sản phẩm/dụng cụ: ${productName}
- Bộ môn / Phân loại: ${effectiveCategory}
- Góc tiếp cận (Angle): ${marketingAngle}
- Mô tả chi tiết & tính năng kỹ thuật vượt trội: ${productDescription}
- Đối tượng khách hàng / Người chơi: ${targetAudience || 'Người đam mê thể thao và tập luyện'}
- Chương trình khuyến mãi / Quà tặng độc quyền: ${offerDetails || 'Không có ưu đãi đặc biệt'}
- Công thức viết quảng cáo: ${copywritingFormula}
- Giọng điệu (Tone): ${toneOfVoice}
- Lời kêu gọi hành động (CTA): ${effectiveCta}
- Thời gian lên lịch đăng bài dự kiến: ${scheduledPublishTime || 'null'}
${effectiveNotes ? `- Ghi chú chiến dịch: ${effectiveNotes}` : ''}

Hãy thực hiện đầy đủ 3 phần theo ĐỊNH DẠNG ĐẦU RA BẮT BUỘC.`;

    let rawText = '';
    // gemini-3.8-flash is preferred for text generation; gemini-3.1-flash-lite is the immediate high-availability failover during 503 demand spikes
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    const timeoutPromise = (ms: number) =>
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Call timed out after ${ms}ms`)), ms)
      );

    for (const modelName of candidateModels) {
      try {
        const response: any = await Promise.race([
          ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.75,
            },
          }),
          timeoutPromise(25000),
        ]);
        if (response?.text) {
          rawText = response.text;
          break;
        }
      } catch (genError: any) {
        console.warn(`Attempt with ${modelName} failed, trying next candidate:`, genError?.message || genError);
      }
    }

    // Fallback template if all upstream calls were temporarily unavailable
    if (!rawText) {
      const sportHashtag = effectiveCategory.replace(/[\s&/]+/g, '');
      const prodHashtag = productName.replace(/[\s&/]+/g, '').slice(0, 15);
      const hashtags = `#${sportHashtag} #TheThaoChinhHang #${prodHashtag} #TheThaoVietNam`;

      const titleEmoji =
        effectiveCategory === 'Bơi lội'
          ? '🏊‍♂️'
          : effectiveCategory === 'Cầu lông'
          ? '🏸'
          : effectiveCategory === 'Bóng đá'
          ? '⚽'
          : effectiveCategory === 'Máy tập gym & Cardio'
          ? '🏃‍♂️'
          : effectiveCategory === 'Bóng rổ'
          ? '🏀'
          : effectiveCategory === 'Bóng bàn'
          ? '🏓'
          : effectiveCategory === 'Yoga & Thể hình'
          ? '🧘‍♀️'
          : '🔥';

      const fallbackPost = `${titleEmoji} BỨT PHÁ GIỚI HẠN - LÀM CHỦ PHONG ĐỘ VỚI ${productName.toUpperCase()}!
Bạn đã sẵn sàng nâng cấp trải nghiệm vận động và tận hưởng cảm giác thăng hoa cùng siêu phẩm ${effectiveCategory.toLowerCase()} chính hãng thế hệ mới?
Đừng để trang thiết bị kém chất lượng cản bước niềm đam mê thể thao của bạn!

⚡ ĐIỂM NỔI BẬT TẠO NÊN SỰ KHÁC BIỆT:
- ${productDescription}
- Tối ưu hiệu năng, bảo vệ sức khỏe và cơ khớp tối đa cho người tập.
- Thiết kế thể thao công thái học, hỗ trợ đắc lực cho ${targetAudience || 'mọi người chơi và vận động viên phong trào'}.

🎁 COMBO ƯU ĐÃI ĐẶC QUYỀN TUẦN NÀY:
${offerDetails ? `- ${offerDetails}` : '- Tặng kèm phụ kiện thể thao chính hãng + Miễn phí vận chuyển toàn quốc!'}
- Cam kết chính hãng 100%, bảo hành 1 đổi 1 nếu phát sinh lỗi kỹ thuật.

👇 ${effectiveCta}!
${hashtags}`;

      const fallbackPrompt = `A dynamic commercial sports photography shot of ${productName} (${effectiveCategory}), captured in a modern high-end athletic setting with cinematic rim lighting, crisp spotlights, energetic action motion blur, ultra-sharp detail, photorealistic 8k octane render, commercial athletic gear product photography --ar 1:1`;

      const videoAction =
        effectiveCategory === 'Bơi lội'
          ? 'Visual: Vận động viên bơi lội rẽ sóng nước trong xanh cực êm, góc quay dưới nước trong vắt 180 độ không hấp hơi. Audio: Tiếng nước rẽ sóng sảng khoái.'
          : effectiveCategory === 'Máy tập gym & Cardio'
          ? 'Visual: Bước chạy bứt tốc mạnh mẽ trên máy tập, cơ đùi săn chắc đổ mồ hôi. Audio: Tiếng động cơ êm ái cùng nhịp tim dồn dập.'
          : 'Visual: Khoảnh khắc bứt tốc hoặc xử lý chuẩn xác đầy nhiệt huyết trên sân. Audio: Âm thanh thể thao đanh thép sống động.';

      const fallbackVideo = `- Giây 0-3: ${videoAction} Lời bình: "Bạn đã bao giờ cảm thấy thiếu đi 1 người bạn đồng hành để bứt phá giới hạn?"
- Giây 3-10: Visual: Cận cảnh ${productName} với góc quay xoay 360 độ khoe chất liệu cao cấp và công nghệ tối ưu. Audio: Nhạc workout thể thao bùng nổ năng lượng. Lời bình: "Trải nghiệm cảm giác làm chủ hoàn hảo cùng siêu phẩm ${effectiveCategory} thế hệ mới!"
- Giây 10-15: Visual: Vận động viên tràn đầy năng lượng và khung hình hiển thị combo quà tặng độc quyền. Audio: Âm thanh chốt hạ dứt khoát. Lời bình: "${effectiveCta} ngay hôm nay để không bỏ lỡ phần quà hấp dẫn!"`;

      rawText = `### 📝 BÀI VIẾT FACEBOOK
${fallbackPost}

### 🎨 GỢI Ý HÌNH ẢNH / VIDEO
**Câu lệnh tạo ảnh (Bằng tiếng Anh):**
${fallbackPrompt}

**Kịch bản Video ngắn (Tùy chọn nếu cần thiết):**
${fallbackVideo}

### ⚙️ CẤU TRÚC JSON (DỮ LIỆU API)
\`\`\`json
{
  "platform": "facebook",
  "post_type": "text_with_media",
  "message": ${JSON.stringify(fallbackPost)},
  "scheduled_publish_time": ${scheduledPublishTime ? JSON.stringify(scheduledPublishTime) : 'null'},
  "media_generation_prompt": ${JSON.stringify(fallbackPrompt)}
}
\`\`\``;
    }

    // Parse sections from rawText
    let facebookPost = '';
    let imagePrompt = '';
    let videoScript = '';
    let parsedJson: any = null;

    // 1. Extract Facebook post
    const postMatch = rawText.match(/###\s*📝\s*BÀI VIẾT FACEBOOK\s*([\s\S]*?)(?=###\s*🎨\s*GỢI Ý HÌNH ẢNH \/ VIDEO|$)/i);
    if (postMatch) {
      facebookPost = postMatch[1].trim();
    }

    // 2. Extract Image prompt & video script
    const mediaMatch = rawText.match(/###\s*🎨\s*GỢI Ý HÌNH ẢNH \/ VIDEO\s*([\s\S]*?)(?=###\s*⚙️\s*CẤU TRÚC JSON|$)/i);
    if (mediaMatch) {
      const mediaSection = mediaMatch[1];
      const imgPromptMatch = mediaSection.match(/\*\*Câu lệnh tạo ảnh \(Bằng tiếng Anh\):\*\*\s*([\s\S]*?)(?=\*\*Kịch bản Video ngắn|$)/i);
      if (imgPromptMatch) {
        imagePrompt = imgPromptMatch[1].trim();
      }

      const vidMatch = mediaSection.match(/\*\*Kịch bản Video ngắn[\s\S]*?:\*\*\s*([\s\S]*?)$/i);
      if (vidMatch) {
        videoScript = vidMatch[1].trim();
      } else {
        // fallback to search lines
        const vidLines = mediaSection.split('\n').filter(line => line.includes('Giây'));
        if (vidLines.length > 0) {
          videoScript = vidLines.join('\n');
        }
      }
    }

    // Context sanity check: if the product is NOT a racket sport, strip any accidental racket phrases
    const isRacketSport =
      effectiveCategory === 'Pickleball' ||
      effectiveCategory === 'Cầu lông' ||
      effectiveCategory === 'Bóng bàn' ||
      productName.toLowerCase().includes('vợt');

    if (!isRacketSport) {
      const racketRegex = /test vợt miễn phí tại sân & nhận ưu đãi quà tặng!?|test vợt miễn phí tại sân|test vợt/gi;
      if (racketRegex.test(facebookPost)) {
        facebookPost = facebookPost.replace(racketRegex, effectiveCta);
      }
      if (racketRegex.test(videoScript)) {
        videoScript = videoScript.replace(racketRegex, effectiveCta);
      }
    }

    // 3. Extract JSON
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        parsedJson = JSON.parse(jsonMatch[1].trim());
      } catch (e) {
        console.warn('Failed to parse model JSON string directly:', e);
      }
    }

    if (!parsedJson) {
      parsedJson = {
        platform: 'facebook',
        post_type: 'text_with_media',
        message: facebookPost || rawText,
        scheduled_publish_time: scheduledPublishTime || null,
        media_generation_prompt: imagePrompt || '',
        product_url: productUrl || null,
      };
    } else {
      if (productUrl && !parsedJson.product_url) {
        parsedJson.product_url = productUrl;
      }
      // If message in JSON has outdated racket CTA on non-racket product
      if (!isRacketSport && parsedJson.message) {
        const racketRegex = /test vợt miễn phí tại sân & nhận ưu đãi quà tặng!?|test vợt miễn phí tại sân|test vợt/gi;
        if (racketRegex.test(parsedJson.message)) {
          parsedJson.message = parsedJson.message.replace(racketRegex, effectiveCta);
        }
      }
    }

    return res.json({
      success: true,
      rawText,
      facebookPost,
      imagePrompt,
      videoScript,
      jsonData: parsedJson,
      metadata: {
        productName,
        productUrl: productUrl || null,
        copywritingFormula,
        toneOfVoice,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating campaign:', error);
    return res.status(500).json({
      error: error?.message || 'Đã xảy ra lỗi khi tạo nội dung marketing.',
    });
  }
});

// Mock / Webhook dispatch simulation endpoint
app.post('/api/dispatch-facebook-post', (req: Request, res: Response) => {
  const { postData, targetPageId = 'PAGE_1092837465' } = req.body;
  if (!postData) {
    return res.status(400).json({ error: 'Thiếu dữ liệu bài đăng.' });
  }

  // Simulate API response
  const postId = `fb_post_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  res.json({
    status: 'success',
    message: 'Bài viết đã được chuyển thành công tới hệ thống tự động hóa Facebook!',
    post_id: postId,
    page_id: targetPageId,
    scheduled_time: postData.scheduled_publish_time || 'Đăng ngay lập tức (Immediate)',
    delivery_status: 'QUEUED_FOR_PUBLICATION',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
