import { CampaignInput, FacebookJsonPayload } from '../types';
import {
  detectSportFromText,
  sanitizeCtaForSport,
  sanitizeNotesForSport,
} from './sportsContextHelper';

export interface GeneratedCampaignData {
  rawText: string;
  facebookPost: string;
  imagePrompt: string;
  videoScript: string;
  jsonData: FacebookJsonPayload;
  metadata?: {
    productName: string;
    productUrl?: string | null;
    copywritingFormula: string;
    toneOfVoice: string;
    generatedAt: string;
    mode: 'server' | 'client_fallback';
  };
}

/**
 * Intelligent Client-Side Campaign Generator
 * Used when running as a static site (e.g., GitHub Pages) where the Node.js Express backend is not running.
 */
export function generateClientSideCampaign(input: CampaignInput): GeneratedCampaignData {
  const {
    productName,
    productDescription,
    sportCategory = 'Dụng cụ thể thao',
    marketingAngle = 'Tăng hiệu suất thi đấu',
    targetAudience = 'Người đam mê thể thao phong trào',
    offerDetails = 'Ưu đãi có hạn, tặng phụ kiện chính hãng',
    copywritingFormula = 'AIDA',
    toneOfVoice = 'Sôi động, nhiệt huyết & chuyên nghiệp',
    callToAction = 'Nhắn tin ngay để nhận tư vấn & ưu đãi',
    productUrl,
  } = input;

  const effectiveCategory =
    detectSportFromText(productName + ' ' + (sportCategory || '')) || sportCategory || 'Dụng cụ thể thao khác';
  const effectiveCta = sanitizeCtaForSport(effectiveCategory, productName, callToAction);

  const titleEmoji =
    effectiveCategory === 'Bơi lội'
      ? '🏊‍♂️'
      : effectiveCategory === 'Cầu lông'
      ? '🏸'
      : effectiveCategory === 'Pickleball'
      ? '🏓'
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

  const cleanCategoryTag = effectiveCategory.replace(/[\s&/]+/g, '');
  const cleanProductTag = productName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '').slice(0, 15);

  const isSwimming = effectiveCategory === 'Bơi lội' || productName.toLowerCase().includes('kính bơi') || productName.toLowerCase().includes('bơi');

  // 1. Generate tailored Facebook Post based on formula
  let facebookPost = '';

  if (copywritingFormula === 'PAS') {
    const painHook = isSwimming
      ? `${titleEmoji} BẠN ĐANG MỆT MỎI VÌ KÍNH BƠI HẤP HƠI MỜ MỊT, NƯỚC TRÀN CAY XÈ MẮT KHI ĐANG BƠI?`
      : `${titleEmoji} BẠN ĐANG GẶP KHÓ KHĂN KHI LUÔN HỤT HƠI & THIẾU KIỂM SOÁT PHONG ĐỘ VẬN ĐỘNG?`;

    const painDesc = isSwimming
      ? 'Vừa bơi được vài sải kính đã mờ đặc, phải dừng lại tháo kính liên tục làm đứt quãng buổi tập? Vành kính thô cứng siết chặt đau hốc mắt, nước clo cay xè tràn vào làm mất hết cảm giác hứng khởi?'
      : 'Bạn muốn bứt phá phong độ nhưng cảm giác trang thiết bị nặng nề, thiếu chuẩn xác, dễ gây chấn thương và nhanh xuống sức? Càng tập càng nản vì chưa chọn đúng dụng cụ đồng hành?';

    const solDesc = isSwimming
      ? `- **Công nghệ Anti-Fog Nano:** Tầm nhìn dưới nước trong vắt 180 độ, tự tin sải từng đường bơi hoàn hảo.\n- **Vành đệm Silicon y tế siêu mềm:** Ôm khít công thái học chống tràn nước 100%, bảo vệ mắt tuyệt đối không để lại vết hằn hốc mắt.\n- **Mắt kính tráng gương chống tia UV:** Thỏa sức bơi lội từ hồ trong nhà đến biển ngoài trời rực nắng.`
      : `- **Công nghệ tối tân:** ${productDescription || 'Chế tác chuẩn xác, vật liệu cao cấp tối ưu hiệu năng thể thao.'}\n- **Độ nhạy & trợ lực đỉnh cao:** Mở rộng vùng kiểm soát, triệt tiêu rung chấn bảo vệ cơ khớp.\n- **Thiết kế công thái học:** Thoáng khí, ôm sát, bền bỉ cho mọi bài tập và pha bứt tốc quyết định.`;

    facebookPost = `${painHook}

${painDesc}

Đừng để những bất tiện đó kìm hãm đam mê của bạn! Siêu phẩm **${productName}** chính là giải pháp nâng cấp toàn diện:
${solDesc}

🎁 **COMBO ƯU ĐÃI ĐẶC QUYỀN HÔM NAY:**
- ${offerDetails}
- Miễn phí vận chuyển toàn quốc + Kiểm tra hàng trực tiếp trước khi nhận!

${productUrl ? `👉 Xem thông tin chi tiết & đặt hàng tại: ${productUrl}\n` : ''}👇 ${effectiveCta}!

#${cleanCategoryTag} #${cleanProductTag} #TheThaoChinhHang #NangTamPhongDo`;
  } else if (copywritingFormula === 'FAB') {
    facebookPost = `${titleEmoji} KHÁM PHÁ BÍ QUYẾT BỨT PHÁ PHONG ĐỘ CÙNG ${productName.toUpperCase()}!

Bạn đang tìm kiếm trang thiết bị thể thao đỉnh cao để làm chủ mọi bài tập và trận đấu? Đây chính là câu trả lời dành riêng cho bạn!

⚡ **TÍNH NĂNG & LỢI ÍCH VƯỢT TRỘI:**
- **Tính năng (Feature):** ${productDescription || 'Thiết kế khí động học kết hợp vật liệu cao cấp chuẩn thể thao chuyên nghiệp.'}
- **Ưu thế (Advantage):** Độ bền vượt trội, an toàn cơ khớp và cảm giác vận động chân thật.
- **Lợi ích (Benefit):** Tăng 30% hiệu suất tập luyện, tạo sự tự tin tối đa và giúp bạn duy trì thói quen rèn luyện mỗi ngày.

🎯 **Dành riêng cho:** ${targetAudience}
🔥 **Định hướng:** ${marketingAngle}

🎁 **CHƯƠNG TRÌNH KHUYẾN MÃI ĐỘC QUYỀN:**
- ${offerDetails}
- Cam kết 100% hàng chính hãng, bảo hành 1 đổi 1 nếu lỗi nhà sản xuất!

${productUrl ? `👉 Link xem chi tiết sản phẩm: ${productUrl}\n` : ''}👇 ${effectiveCta}!

#${cleanCategoryTag} #${cleanProductTag} #TheThaoDinhCao #VuotTroi`;
  } else {
    // Default AIDA
    const aidaSub = isSwimming
      ? 'Bạn có muốn tận hưởng cảm giác rẽ nước mượt mà, tầm nhìn trong vắt không một giọt nước tràn vào mắt? Hãy trải nghiệm siêu phẩm được các tín đồ bơi lội săn đón nhất mùa hè năm nay!'
      : 'Bạn có muốn cảm nhận từng nhịp vận động mạnh mẽ và chuẩn xác hơn bao giờ hết? Hãy trải nghiệm siêu phẩm được cộng đồng thể thao săn đón nhất mùa giải năm nay!';

    facebookPost = `${titleEmoji} BỨT PHÁ GIỚI HẠN - LÀM CHỦ MỌI CHUYỂN ĐỘNG CÙNG ${productName.toUpperCase()}!

${aidaSub}

⚡ **ĐIỂM NHẤN CÔNG NGHỆ KHÔNG THỂ BỎ QUA:**
- **Đặc tính kỹ thuật:** ${productDescription || 'Vật liệu cao cấp, trọng lượng lý tưởng, gia công tỉ mỉ từng chi tiết chuẩn thể thao.'}
- **Hiệu năng thực chiến:** Tối ưu hóa chuyển động, bảo vệ an toàn tối đa cho người tập luyện.
- **Phong cách thể thao hiện đại:** Gam màu năng động, tôn vinh cá tính thể thao đầy cảm hứng.

🎁 **QUÀ TẶNG KÈM COMBO ƯU ĐÃI:**
- ${offerDetails}
- Giao hàng hỏa tốc toàn quốc + Hỗ trợ đổi trả trong 7 ngày nếu không vừa vặn!

${productUrl ? `👉 Đặt mua trực tiếp tại link: ${productUrl}\n` : ''}👇 ${effectiveCta}!

#${cleanCategoryTag} #${cleanProductTag} #TheThaoChuyenNghiep #TheThaoPhongTrao`;
  }

  // 2. Generate Image Prompt
  const settingDesc = isSwimming
    ? 'an Olympic luxury indoor swimming pool with clear turquoise water and cinematic underwater light rays'
    : 'a modern premium sports arena with dramatic cinematic lighting and dynamic action atmosphere';

  const imagePrompt = `A dynamic commercial sports photography shot of ${productName} (${effectiveCategory}), prominently featured in ${settingDesc}. Dynamic action lighting, subtle motion blur, crisp water droplets and vibrant colors, octane render 8k, hyper-realistic depth of field, premium commercial athletic equipment advertisement aesthetic --ar 1:1`;

  // 3. Generate Video Script
  const videoHook = isSwimming
    ? 'Visual: Cận cảnh vận động viên đeo kính bơi lao mình xuống làn nước trong xanh rẽ sóng mượt mà, âm thanh làn nước rẽ sóng sảng khoái. Lời bình: "Bạn đã sẵn sàng tận hưởng tầm nhìn trong vắt dưới nước mà không lo đọng sương hay tràn nước?"'
    : `Visual: Cận cảnh pha bứt tốc mạnh mẽ với ${productName}, âm thanh chuyển động dứt khoát sống động. Lời bình: "Bạn đã sẵn sàng nâng tầm phong độ thể thao lên một đẳng cấp mới?"`;

  const videoScript = `- Giây 0-3 (Hook mở đầu): ${videoHook}
- Giây 3-10 (Trải nghiệm thực tế): Visual: Góc quay 360 độ siêu nét zoom vào chi tiết cấu tạo: ${productDescription || 'chất liệu cao cấp, ôm sát công thái học, bảo vệ tối đa'}. Lời bình: "Thiết kế chuẩn thể thao chuyên nghiệp, tối ưu hóa từng chuyển động và mang lại cảm giác làm chủ hoàn hảo."
- Giây 10-15 (Kêu gọi hành động): Visual: Vận động viên tươi cười rạng rỡ, màn hình hiện pop-up ưu đãi "${offerDetails}". Lời bình: "${effectiveCta} ngay hôm nay để không bỏ lỡ phần quà hấp dẫn!"`;

  // 4. Generate JSON Payload
  const jsonData: FacebookJsonPayload = {
    platform: 'facebook',
    post_type: 'text_with_media',
    message: facebookPost,
    scheduled_publish_time: null,
    media_generation_prompt: imagePrompt,
    product_url: productUrl || undefined,
  };

  // 5. Generate formatted raw text
  const rawText = `### 📝 BÀI VIẾT FACEBOOK
${facebookPost}

### 🎨 GỢI Ý HÌNH ẢNH / VIDEO
**Câu lệnh tạo ảnh (Bằng tiếng Anh):**
${imagePrompt}

**Kịch bản Video ngắn (Tùy chọn nếu cần thiết):**
${videoScript}

### ⚙️ CẤU TRÚC JSON (DỮ LIỆU API)
\`\`\`json
${JSON.stringify(jsonData, null, 2)}
\`\`\``;

  return {
    rawText,
    facebookPost,
    imagePrompt,
    videoScript,
    jsonData,
    metadata: {
      productName,
      productUrl: productUrl || null,
      copywritingFormula,
      toneOfVoice,
      generatedAt: new Date().toISOString(),
      mode: 'client_fallback',
    },
  };
}

/**
 * Intelligent Client-Side URL parser
 * Used when running on static hosting like GitHub Pages without backend /api/extract-url
 */
export function extractUrlClientSide(url: string): {
  productName: string;
  sportCategory: string;
  productDescription: string;
  offerDetails: string;
  callToAction: string;
  additionalNotes: string;
} {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const urlObj = new URL(cleanUrl);
    const pathname = urlObj.pathname;
    const hostname = urlObj.hostname;

    // Get last meaningful segment of path
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';

    // Convert slug to human readable words (e.g. 'kinh-boi-chong-nuoc-speedo' -> 'Kinh Boi Chong Nuoc Speedo')
    const decodedSlug = decodeURIComponent(lastSegment)
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim();

    const titleCase = decodedSlug
      ? decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)
      : `Sản phẩm ${hostname}`;

    // Detect sport category
    const sport = detectSportFromText(cleanUrl + ' ' + decodedSlug);
    const cta = sanitizeCtaForSport(sport, titleCase, '');
    const notes = sanitizeNotesForSport(sport, titleCase, '');

    const defaultDesc =
      sport === 'Bơi lội'
        ? `Kính bơi và phụ kiện bơi lội cao cấp từ ${hostname}, tráng gương chống tia UV, công nghệ nano anti-fog chống đọng sương và đệm silicon y tế êm hốc mắt chống tràn nước 100%.`
        : `Sản phẩm thể thao cao cấp từ ${hostname}, chuẩn thi đấu, vật liệu bền bỉ tối ưu hóa hiệu suất vận động.`;

    return {
      productName: titleCase,
      sportCategory: sport,
      productDescription: defaultDesc,
      offerDetails: 'Ưu đãi độc quyền cho đơn hàng trực tuyến + Quà tặng chính hãng',
      callToAction: cta,
      additionalNotes: notes,
    };
  } catch {
    return {
      productName: 'Dụng Cụ Thể Thao Cao Cấp',
      sportCategory: 'Dụng cụ thể thao khác',
      productDescription: 'Thiết bị thể thao chính hãng, tối ưu hiệu suất và độ bền vượt trội.',
      offerDetails: 'Miễn phí giao hàng toàn quốc + Quà tặng kèm theo',
      callToAction: 'Nhắn tin ngay để nhận tư vấn chi tiết & ưu đãi độc quyền hôm nay!',
      additionalNotes: 'Nhấn mạnh độ bền bỉ, tính năng công thái học và dịch vụ bảo hành chính hãng.',
    };
  }
}

