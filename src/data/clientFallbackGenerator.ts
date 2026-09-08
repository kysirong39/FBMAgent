import { CampaignInput, FacebookJsonPayload } from '../types';

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
    sportCategory = 'Thể thao tổng hợp',
    marketingAngle = 'Tăng hiệu suất thi đấu',
    targetAudience = 'Người đam mê thể thao phong trào',
    offerDetails = 'Ưu đãi có hạn, tặng phụ kiện chính hãng',
    copywritingFormula = 'AIDA',
    toneOfVoice = 'Sôi động, nhiệt huyết & chuyên nghiệp',
    callToAction = 'Nhắn tin ngay để nhận tư vấn & ưu đãi',
    productUrl,
  } = input;

  const titleEmoji = sportCategory.toLowerCase().includes('pickleball')
    ? '🎾'
    : sportCategory.toLowerCase().includes('cầu lông')
    ? '🏸'
    : sportCategory.toLowerCase().includes('bóng đá')
    ? '⚽'
    : sportCategory.toLowerCase().includes('chạy bộ')
    ? '🏃‍♂️'
    : sportCategory.toLowerCase().includes('gym')
    ? '🏋️‍♂️'
    : '🔥';

  // 1. Generate tailored Facebook Post based on formula
  let facebookPost = '';

  if (copywritingFormula === 'PAS') {
    facebookPost = `${titleEmoji} BẠN ĐANG GẶP KHÓ KHĂN KHI LUÔN HỤT HƠI & THIẾU KIỂM SOÁT TRÊN SÂN ĐẤU?

Đối thủ di chuyển linh hoạt, dứt điểm hiểm hóc trong khi bạn nhanh xuống sức, động tác thiếu chuẩn xác và cảm giác thiết bị không theo ý muốn? Càng chơi càng ức chế vì không bứt phá được giới hạn bản thân?

Đừng để những rào cản đó kìm hãm đam mê của bạn! Siêu phẩm **${productName}** chính là giải pháp nâng cấp toàn diện:
- **Công nghệ tối tân:** ${productDescription || 'Chế tác chuẩn xác, vật liệu cao cấp tối ưu hiệu năng thể thao.'}
- **Độ nhạy & trợ lực đỉnh cao:** Mở rộng vùng kiểm soát, triệt tiêu rung chấn bảo vệ cơ khớp.
- **Thiết kế công thái học:** Thoáng khí, ôm sát, đầm tay cho mọi cú bứt tốc và pha bóng quyết định.

🎁 **COMBO ƯU ĐÃI ĐẶC QUYỀN HÔM NAY:**
- ${offerDetails}
- Miễn phí vận chuyển toàn quốc + Kiểm tra hàng trực tiếp trước khi nhận!

${productUrl ? `👉 Xem thông tin chi tiết & đặt hàng tại: ${productUrl}\n` : ''}👇 ${callToAction}!

#${sportCategory.replace(/\s+/g, '')} #${productName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '')} #TheThaoChinhHang #DungCuTheThao #NangTamPhongDo`;
  } else if (copywritingFormula === 'FAB') {
    facebookPost = `${titleEmoji} KHÁM PHÁ BÍ QUYẾT BỨT PHÁ PHONG ĐỘ CÙNG ${productName.toUpperCase()}!

Bạn đang tìm kiếm trang thiết bị thể thao đỉnh cao để làm chủ mọi trận đấu? Đây chính là câu trả lời dành riêng cho bạn!

⚡ **TÍNH NĂNG & LỢI ÍCH VƯỢT TRỘI:**
- **Tính năng (Feature):** ${productDescription || 'Thiết kế khí động học kết hợp vật liệu cao cấp chuẩn thi đấu.'}
- **Ưu thế (Advantage):** Độ bền vượt trội, kiểm soát chính xác từng quỹ đạo chuyển động.
- **Lợi ích (Benefit):** Tăng 30% hiệu suất vận động, giảm thiểu áp lực cơ xương khớp, giúp bạn tự tin chơi hết mình suốt trận đấu.

🎯 **Dành riêng cho:** ${targetAudience}
🔥 **Định hướng:** ${marketingAngle}

🎁 **CHƯƠNG TRÌNH KHUYẾN MÃI ĐỘC QUYỀN:**
- ${offerDetails}
- Cam kết 100% hàng chính hãng, bảo hành 1 đổi 1 lỗi nhà sản xuất!

${productUrl ? `👉 Link xem chi tiết sản phẩm: ${productUrl}\n` : ''}👇 ${callToAction}!

#${sportCategory.replace(/\s+/g, '')} #${productName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '')} #TheThaoDinhCao #VuotTroi`;
  } else {
    // Default AIDA
    facebookPost = `${titleEmoji} BỨT PHÁ GIỚI HẠN - LÀM CHỦ MỌI TRẬN ĐẤU CÙNG ${productName.toUpperCase()}!

Bạn có muốn cảm nhận từng pha bóng, từng bước chạy mạnh mẽ và chuẩn xác hơn bao giờ hết? Hãy trải nghiệm siêu phẩm được săn đón nhất mùa giải năm nay!

⚡ **ĐIỂM NHẤN CÔNG NGHỆ KHÔNG THỂ BỎ QUA:**
- **Đặc tính kỹ thuật:** ${productDescription || 'Vật liệu cao cấp, trọng lượng lý tưởng, gia công tỉ mỉ từng chi tiết.'}
- **Hiệu năng thực chiến:** Hỗ trợ phát lực tối đa, mang lại cảm giác bóng cực đầm và chắc chắn.
- **Phong cách thể thao hiện đại:** Gam màu năng động, tôn vinh cá tính người chơi trên sân.

🎁 **QUÀ TẶNG KÈM COMBO ƯU ĐÃI:**
- ${offerDetails}
- Giao hàng hỏa tốc + Hỗ trợ đổi trả miễn phí trong 7 ngày nếu không ưng ý!

${productUrl ? `👉 Đặt mua trực tiếp tại link: ${productUrl}\n` : ''}👇 Bấm nhắn tin ngay: ${callToAction}!

#${sportCategory.replace(/\s+/g, '')} #${productName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '')} #TheThaoChuyenNghiep #PickleballVN #TheThaoPhongTrao`;
  }

  // 2. Generate Image Prompt
  const imagePrompt = `A dynamic commercial sports photography shot of ${productName}, prominently featured in a modern outdoor sports court stadium setting during sunset golden hour. Dynamic action lighting, subtle motion blur, crisp sweat droplets on athlete gear, octane render 8k, hyper-realistic depth of field, vibrant colors, premium commercial athletic gear advertisement aesthetic --ar 1:1`;

  // 3. Generate Video Script
  const videoScript = `- Giây 0-3 (Hook mở đầu): Visual: Cận cảnh pha hành động tốc độ cao với ${productName}, âm thanh chuyển động dứt khoát. Lời bình: "Bạn đã sẵn sàng nâng tầm phong độ thi đấu lên một đẳng cấp mới?"
- Giây 3-10 (Trải nghiệm thực chiến): Visual: Góc quay 360 độ siêu nét zoom vào chi tiết cấu tạo: ${productDescription || 'chất liệu cao cấp, đầm tay, hỗ trợ trợ lực'}. Lời bình: "Thiết kế chuẩn thi đấu, tối ưu hóa từng cú bứt tốc và cảm giác kiểm soát hoàn hảo."
- Giây 10-15 (Kêu gọi hành động): Visual: Vận động viên tươi cười giơ ngón tay like, màn hình hiện pop-up ưu đãi "${offerDetails}". Lời bình: "${callToAction} ngay hôm nay để không bỏ lỡ phần quà hấp dẫn!"`;

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
    
    // Convert slug to human readable words (e.g. 'vot-pickleball-carbon-t700' -> 'Vot Pickleball Carbon T700')
    const decodedSlug = decodeURIComponent(lastSegment)
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim();

    const titleCase = decodedSlug
      ? decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)
      : `Sản phẩm ${hostname}`;

    // Guess sport category
    let sport = 'Thể thao phong trào';
    const lower = (url + ' ' + decodedSlug).toLowerCase();
    if (lower.includes('pickleball')) sport = 'Pickleball';
    else if (lower.includes('badminton') || lower.includes('cau-long') || lower.includes('cầu lông')) sport = 'Cầu lông';
    else if (lower.includes('football') || lower.includes('bong-da') || lower.includes('bóng đá')) sport = 'Bóng đá';
    else if (lower.includes('running') || lower.includes('chay-bo') || lower.includes('marathon')) sport = 'Chạy bộ / Điền kinh';
    else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('the-hinh')) sport = 'Gym & Fitness';
    else if (lower.includes('tennis') || lower.includes('quan-vot')) sport = 'Quần vợt (Tennis)';

    return {
      productName: titleCase,
      sportCategory: sport,
      productDescription: `Sản phẩm thể thao cao cấp từ ${hostname}, chuẩn thi đấu, vật liệu bền bỉ tối ưu hóa hiệu suất vận động.`,
      offerDetails: 'Ưu đãi độc quyền cho đơn hàng trực tuyến + Bảo hành chính hãng',
    };
  } catch {
    return {
      productName: 'Dụng Cụ Thể Thao Cao Cấp',
      sportCategory: 'Thể thao phong trào',
      productDescription: 'Thiết bị thể thao chính hãng, tối ưu hiệu suất và độ bền vượt trội.',
      offerDetails: 'Miễn phí giao hàng toàn quốc + Quà tặng kèm theo',
    };
  }
}
