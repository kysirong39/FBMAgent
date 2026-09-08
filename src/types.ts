export type CopywritingFormula = 'AIDA' | 'PAS' | 'Storytelling' | 'FOMO' | 'FAB';

export type SportCategory =
  | 'Pickleball'
  | 'Cầu lông'
  | 'Bóng đá'
  | 'Máy tập gym & Cardio'
  | 'Bóng rổ'
  | 'Bóng bàn'
  | 'Bơi lội'
  | 'Yoga & Thể hình'
  | 'Dụng cụ thể thao khác';

export type MarketingAngle =
  | 'Tăng hiệu suất & Nâng trình thi đấu'
  | 'Đốt mỡ giảm cân & Lột xác vóc dáng'
  | 'Bảo vệ cơ khớp & Chống chấn thương'
  | 'Đam mê & Giao lưu phong trào CLB'
  | 'Ưu đãi số lượng lớn & Xả kho quà tặng';

export interface CampaignInput {
  productUrl: string;
  productName: string;
  sportCategory: SportCategory;
  marketingAngle: MarketingAngle;
  productDescription: string;
  targetAudience: string;
  offerDetails: string;
  copywritingFormula: CopywritingFormula;
  toneOfVoice: string;
  scheduledPublishTime: string;
  callToAction: string;
  additionalNotes: string;
}

export interface FacebookJsonPayload {
  platform: 'facebook';
  post_type: string;
  message: string;
  scheduled_publish_time: string | null;
  media_generation_prompt: string;
  product_url?: string | null;
}

export interface CampaignResult {
  id: string;
  timestamp: string;
  rawText: string;
  facebookPost: string;
  imagePrompt: string;
  videoScript: string;
  jsonData: FacebookJsonPayload;
  input: Partial<CampaignInput>;
  metadata?: {
    productName?: string;
    productUrl?: string | null;
    copywritingFormula?: string;
    toneOfVoice?: string;
    generatedAt?: string;
  };
}

export interface DispatchStatus {
  success: boolean;
  message: string;
  postId?: string;
  pageId?: string;
  scheduledTime?: string;
  timestamp?: string;
}
