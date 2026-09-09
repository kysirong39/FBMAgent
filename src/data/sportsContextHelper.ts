import { SportCategory } from '../types';

export const SPORT_CTA_PRESETS: Record<SportCategory, string[]> = {
  'Bơi lội': [
    'Nhắn tin ngay để chọn mẫu kính bơi vừa vặn chống nước & nhận quà tặng độc quyền!',
    'Bấm nhắn tin để nhận tư vấn độ cận & hộp đựng kính chống nước cao cấp!',
    'Đặt mua ngay hôm nay để nhận combo kính + mũ bơi silicone chính hãng!',
    'Nhắn tin để giữ ưu đãi giảm giá mùa hè & miễn phí vận chuyển!',
  ],
  'Pickleball': [
    'Nhắn tin ngay để test vợt miễn phí tại sân & nhận ưu đãi quà tặng!',
    'Bấm "Gửi tin nhắn" để chọn độ dày 13mm/16mm & nhận combo 3 bóng USAPA!',
    'Đặt mua hôm nay để nhận túi đựng vợt chống sốc và quấn cán cao cấp!',
    'Nhắn tin ngay để nhận tư vấn chọn mặt vợt trợ lực hay kiểm soát xoáy!',
  ],
  'Cầu lông': [
    'Bấm "Gửi tin nhắn" để chọn số kg căng dây theo lực tay & nhận quà tặng!',
    'Nhắn tin ngay để được chuyên gia tư vấn dòng vợt trợ lực/công thủ toàn diện!',
    'Đặt mua hôm nay để được miễn phí căng cước BG65 Ti & tặng quấn cán!',
    'Nhắn tin để giữ ưu đãi vợt cầu lông chính hãng tặng bao nhung cao cấp!',
  ],
  'Bóng đá': [
    'Nhắn tin ngay để chọn chuẩn size chân và nhận quà tặng túi đựng giày 2 ngăn!',
    'Bấm gửi tin nhắn để kiểm tra size sân cỏ nhân tạo & nhận tất dệt chống trơn!',
    'Đặt mua hôm nay để nhận ưu đãi xả kho giày đá bóng chính hãng!',
    'Nhắn tin để được tư vấn form chân bè và hỗ trợ đổi size miễn phí!',
  ],
  'Máy tập gym & Cardio': [
    'Để lại số điện thoại hoặc nhắn tin để nhận lịch hẹn giao & lắp đặt miễn phí tận nhà!',
    'Nhắn tin ngay để nhận tư vấn máy tập phù hợp diện tích gia đình & ưu đãi quà tặng!',
    'Đặt mua hôm nay để nhận voucher giảm 3.000.000đ & máy massage cầm tay!',
    'Đăng ký trải nghiệm máy chạy bộ trực tiếp tại nhà hoàn toàn miễn phí!',
  ],
  'Bóng rổ': [
    'Nhấp đặt ngay hôm nay để mang bóng ra sân cùng đồng đội & nhận quà tặng kim bơm!',
    'Nhắn tin ngay để chọn size bóng số 6/số 7 chuẩn thi đấu FIBA!',
    'Đặt bóng hôm nay để nhận ưu đãi túi lưới và freeship toàn quốc!',
    'Nhắn tin để nhận tư vấn chọn bóng sân trong nhà hay sân ngoài trời!',
  ],
  'Bóng bàn': [
    'Nhắn tin ngay để được tư vấn cốt vợt, mặt mút & nhận bao vợt chuyên dụng!',
    'Bấm gửi tin nhắn để chọn combo vợt dán sẵn chuẩn thi đấu ITTF!',
    'Đặt mua ngay để nhận hộp 6 quả bóng bàn thi đấu 3 sao cao cấp!',
    'Nhắn tin để được chuyên gia tư vấn vợt theo lối đánh công thủ!',
  ],
  'Yoga & Thể hình': [
    'Nhắn tin ngay để nhận tư vấn dụng cụ tập & thực đơn hướng dẫn tại nhà!',
    'Bấm nhắn tin để chọn độ dày thảm tập & nhận túi đựng thảm thời trang!',
    'Đặt mua combo yoga hôm nay để nhận ưu đãi giảm giá và quà tặng dây kháng lực!',
    'Nhắn tin để giữ ưu đãi trọn bộ dụng cụ tập gym tại nhà!',
  ],
  'Dụng cụ thể thao khác': [
    'Nhắn tin ngay để nhận tư vấn chi tiết & ưu đãi độc quyền hôm nay!',
    'Bấm "Gửi tin nhắn" để kiểm tra số lượng và nhận ưu đãi quà tặng!',
    'Đặt mua ngay hôm nay để nhận ưu đãi giao hàng toàn quốc!',
    'Để lại tin nhắn để chuyên viên thể thao hỗ trợ tư vấn trong 5 phút!',
  ],
};

export const SPORT_NOTES_PRESETS: Record<SportCategory, string> = {
  'Bơi lội':
    'Nhấn mạnh trải nghiệm bơi lội trong vắt, công nghệ chống đọng sương nano, không cay mắt và vành silicon êm ái chống tràn nước.',
  'Pickleball':
    'Nhấn mạnh cảm giác dink bóng êm tay, cú smash đầy uy lực, bề mặt carbon Toray tạo xoáy và chuẩn thi đấu USAPA.',
  'Cầu lông':
    'Nhấn mạnh đũa vợt mỏng trợ lực thoát cầu, smash uy lực cắm sân và độ bền cước chịu lực cao.',
  'Bóng đá':
    'Nhấn mạnh form ôm chân bè cho người Việt, đinh TF bám sân cỏ nhân tạo chống trơn trượt và lót đệm giảm chấn gót chân.',
  'Máy tập gym & Cardio':
    'Nhấn mạnh hệ thống đệm khí giảm chấn bảo vệ khớp gối, động cơ êm ái khi tập tại nhà và chế độ gấp gọn thông minh.',
  'Bóng rổ':
    'Nhấn mạnh độ bám tay vân nhám sâu khi nhồi bóng, ruột Butyl giữ hơi bền bỉ và độ nảy chuẩn thi đấu FIBA.',
  'Bóng bàn':
    'Nhấn mạnh độ xoáy giật bóng của mặt mút, độ nảy đàn hồi chuẩn ITTF và cảm giác kiểm soát bàn bóng linh hoạt.',
  'Yoga & Thể hình':
    'Nhấn mạnh chất liệu TPE an toàn chống trơn trượt, độ đàn hồi bảo vệ khớp xương và thiết kế tiện lợi mang đi.',
  'Dụng cụ thể thao khác':
    'Nhấn mạnh độ bền bỉ, tính năng công thái học bảo vệ người chơi và dịch vụ bảo hành chính hãng.',
};

/**
 * Detect sport category from text (title, slug, content or product name)
 */
export function detectSportFromText(text: string): SportCategory {
  if (!text) return 'Dụng cụ thể thao khác';
  const lower = text.toLowerCase();

  if (
    lower.includes('bơi') ||
    lower.includes('kinh boi') ||
    lower.includes('kính bơi') ||
    lower.includes('mu boi') ||
    lower.includes('mũ bơi') ||
    lower.includes('swim') ||
    lower.includes('goggle') ||
    lower.includes('aquatics') ||
    lower.includes('phao bơi') ||
    lower.includes('chân vịt')
  ) {
    return 'Bơi lội';
  }

  if (lower.includes('pickleball') || lower.includes('dink') || lower.includes('usapa')) {
    return 'Pickleball';
  }

  if (
    lower.includes('cầu lông') ||
    lower.includes('cau long') ||
    lower.includes('badminton') ||
    lower.includes('yonex') ||
    lower.includes('victor') ||
    lower.includes('lining') ||
    lower.includes('căng cước') ||
    lower.includes('vợt cầu lông')
  ) {
    return 'Cầu lông';
  }

  if (
    lower.includes('bóng đá') ||
    lower.includes('bong da') ||
    lower.includes('giày đá bóng') ||
    lower.includes('giay da banh') ||
    lower.includes('football') ||
    lower.includes('soccer') ||
    lower.includes('đinh tf') ||
    lower.includes('sân cỏ nhân tạo')
  ) {
    return 'Bóng đá';
  }

  if (
    lower.includes('chạy bộ') ||
    lower.includes('chay bo') ||
    lower.includes('máy tập') ||
    lower.includes('may tap') ||
    lower.includes('máy chạy bộ') ||
    lower.includes('may chay bo') ||
    lower.includes('treadmill') ||
    lower.includes('tập gym') ||
    lower.includes('tap gym') ||
    lower.includes('cardio') ||
    lower.includes('giàn tạ') ||
    lower.includes('xe đạp tập')
  ) {
    return 'Máy tập gym & Cardio';
  }

  if (
    lower.includes('bóng rổ') ||
    lower.includes('bong ro') ||
    lower.includes('basketball') ||
    lower.includes('fiba') ||
    lower.includes('ném rổ')
  ) {
    return 'Bóng rổ';
  }

  if (
    lower.includes('bóng bàn') ||
    lower.includes('bong ban') ||
    lower.includes('table tennis') ||
    lower.includes('ping pong') ||
    lower.includes('ittf')
  ) {
    return 'Bóng bàn';
  }

  if (
    lower.includes('yoga') ||
    lower.includes('pilates') ||
    lower.includes('thảm tập') ||
    lower.includes('tham tap') ||
    lower.includes('kháng lực')
  ) {
    return 'Yoga & Thể hình';
  }

  return 'Dụng cụ thể thao khác';
}

/**
 * Check if the Call-To-Action does not match the product or sport
 */
export function isCtaMismatched(sport: SportCategory | string, productName: string, cta: string): boolean {
  if (!cta) return true;
  const lowerCta = cta.toLowerCase();
  const lowerProd = (productName + ' ' + sport).toLowerCase();

  const isRacketSport =
    sport === 'Pickleball' ||
    sport === 'Cầu lông' ||
    sport === 'Bóng bàn' ||
    lowerProd.includes('vợt') ||
    lowerProd.includes('pickleball') ||
    lowerProd.includes('cầu lông') ||
    lowerProd.includes('tennis');

  // If CTA mentions rackets / tests on court / racket stringing, but the product is NOT a racket sport
  const hasRacketKeywords =
    lowerCta.includes('test vợt') ||
    lowerCta.includes('thử vợt') ||
    lowerCta.includes('căng cước') ||
    lowerCta.includes('căng dây') ||
    lowerCta.includes('bao vợt') ||
    lowerCta.includes('cán vợt');

  if (hasRacketKeywords && !isRacketSport) {
    return true;
  }

  // If sport is Swimming, but CTA talks about court/shoes/installation/rackets
  if (sport === 'Bơi lội' || lowerProd.includes('kính bơi') || lowerProd.includes('bơi')) {
    if (
      lowerCta.includes('vợt') ||
      lowerCta.includes('sân') ||
      lowerCta.includes('size giày') ||
      lowerCta.includes('lắp đặt') ||
      lowerCta.includes('đá bóng')
    ) {
      return true;
    }
  }

  // If sport is Treadmill/Gym, but CTA talks about court test/racket/swimming
  if (sport === 'Máy tập gym & Cardio' || lowerProd.includes('máy chạy')) {
    if (lowerCta.includes('vợt') || lowerCta.includes('tại sân') || lowerCta.includes('kính bơi')) {
      return true;
    }
  }

  // If sport is Football, but CTA talks about racket test/swimming/installation
  if (sport === 'Bóng đá' || lowerProd.includes('bóng đá')) {
    if (lowerCta.includes('vợt') || lowerCta.includes('kính bơi') || lowerCta.includes('lắp đặt')) {
      return true;
    }
  }

  return false;
}

/**
 * Check if the Additional Notes do not match the product or sport
 */
export function isNotesMismatched(sport: SportCategory | string, productName: string, notes: string): boolean {
  if (!notes) return false;
  const lowerNotes = notes.toLowerCase();
  const lowerProd = (productName + ' ' + sport).toLowerCase();

  const isRacketSport =
    sport === 'Pickleball' ||
    sport === 'Cầu lông' ||
    lowerProd.includes('pickleball') ||
    lowerProd.includes('cầu lông');

  const hasPickleballSpecifics =
    lowerNotes.includes('dink bóng') ||
    lowerNotes.includes('cú smash') ||
    lowerNotes.includes('mặt vợt carbon') ||
    lowerNotes.includes('t700');

  if (hasPickleballSpecifics && !isRacketSport) {
    return true;
  }

  return false;
}

/**
 * Get safe and relevant CTA for a given sport & product
 */
export function sanitizeCtaForSport(
  sport: SportCategory | string,
  productName: string,
  currentCta: string
): string {
  const cat = (sport as SportCategory) in SPORT_CTA_PRESETS ? (sport as SportCategory) : 'Dụng cụ thể thao khác';
  if (!currentCta || isCtaMismatched(sport, productName, currentCta)) {
    return SPORT_CTA_PRESETS[cat][0];
  }
  return currentCta.trim();
}

/**
 * Get safe and relevant notes for a given sport & product
 */
export function sanitizeNotesForSport(
  sport: SportCategory | string,
  productName: string,
  currentNotes: string
): string {
  const cat = (sport as SportCategory) in SPORT_NOTES_PRESETS ? (sport as SportCategory) : 'Dụng cụ thể thao khác';
  if (!currentNotes || isNotesMismatched(sport, productName, currentNotes)) {
    return SPORT_NOTES_PRESETS[cat];
  }
  return currentNotes.trim();
}
