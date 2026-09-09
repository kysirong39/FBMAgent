import { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Calendar, Tag, Target, MessageSquare, Layers, Dumbbell, Compass, Globe, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { CampaignInput, CopywritingFormula, SportCategory, MarketingAngle } from '../types';
import { SAMPLE_CAMPAIGNS } from '../data/samples';
import { extractUrlClientSide } from '../data/clientFallbackGenerator';
import {
  sanitizeCtaForSport,
  sanitizeNotesForSport,
  SPORT_CTA_PRESETS,
  SPORT_NOTES_PRESETS,
} from '../data/sportsContextHelper';

interface CampaignFormProps {
  formData: CampaignInput;
  setFormData: (data: CampaignInput | ((prev: CampaignInput) => CampaignInput)) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SPORT_CATEGORIES: { label: SportCategory; icon: string }[] = [
  { label: 'Pickleball', icon: '🎾' },
  { label: 'Cầu lông', icon: '🏸' },
  { label: 'Bóng đá', icon: '⚽' },
  { label: 'Máy tập gym & Cardio', icon: '🏃' },
  { label: 'Bóng rổ', icon: '🏀' },
  { label: 'Bóng bàn', icon: '🏓' },
  { label: 'Bơi lội', icon: '🏊' },
  { label: 'Yoga & Thể hình', icon: '🧘' },
  { label: 'Dụng cụ thể thao khác', icon: '🥊' },
];

const MARKETING_ANGLES: MarketingAngle[] = [
  'Tăng hiệu suất & Nâng trình thi đấu',
  'Đốt mỡ giảm cân & Lột xác vóc dáng',
  'Bảo vệ cơ khớp & Chống chấn thương',
  'Đam mê & Giao lưu phong trào CLB',
  'Ưu đãi số lượng lớn & Xả kho quà tặng',
];

const FORMULA_DESCRIPTIONS: Record<CopywritingFormula, string> = {
  AIDA: 'Attention (Gây chú ý) -> Interest (Tạo hứng thú) -> Desire (Khao khát) -> Action (Hành động)',
  PAS: 'Problem (Nỗi đau thể lực/dụng cụ) -> Agitate (Đào sâu chấn thương/mất điểm) -> Solution (Dụng cụ đột phá)',
  Storytelling: 'Kể chuyện hành trình vượt khó, giảm cân hoặc cú lội ngược dòng thăng hoa trên sân đấu',
  FOMO: 'Tạo độ khẩn cấp: Combo xả kho vợt/máy tập giới hạn số lượng, giá độc quyền tuần này',
  FAB: 'Features (Vật liệu Carbon/Động cơ) -> Advantages (Trợ lực/Giảm chấn) -> Benefits (Cú smash uy lực/An toàn khớp gối)',
};

const TONE_OPTIONS = [
  'Sôi động, nhiệt huyết & bứt phá',
  'Máu lửa, đậm chất thể thao phong trào',
  'Chuyên nghiệp, phân tích kỹ thuật đẳng cấp',
  'Truyền cảm hứng, vượt qua giới hạn bản thân',
  'Thân thiện gắn kết anh em đồng đội',
  'Hài hước, dí dỏm sân cỏ & bắt trend thể thao',
];

export default function CampaignForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: CampaignFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMessage, setExtractMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSelectSample = (sample: (typeof SAMPLE_CAMPAIGNS)[0]) => {
    setFormData(sample.data);
    setExtractMessage(null);
  };

  const handleInputChange = (field: keyof CampaignInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExtractFromUrl = async () => {
    if (!formData.productUrl || !formData.productUrl.trim()) {
      setExtractMessage({
        type: 'error',
        text: 'Vui lòng dán link web bài viết hoặc sản phẩm trước khi quét.',
      });
      return;
    }

    setIsExtracting(true);
    setExtractMessage(null);

    try {
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.productUrl.trim() }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const extracted = json.data;
          setFormData((prev) => {
            const nextCategory = extracted.sportCategory || prev.sportCategory;
            const nextProductName = extracted.productName || prev.productName;
            const nextCta =
              extracted.callToAction ||
              sanitizeCtaForSport(nextCategory, nextProductName, prev.callToAction);
            const nextNotes =
              extracted.additionalNotes !== undefined
                ? extracted.additionalNotes
                : sanitizeNotesForSport(nextCategory, nextProductName, prev.additionalNotes);

            return {
              ...prev,
              productName: nextProductName,
              sportCategory: nextCategory,
              productDescription: extracted.productDescription || prev.productDescription,
              targetAudience: extracted.targetAudience || prev.targetAudience,
              offerDetails: extracted.offerDetails || prev.offerDetails,
              marketingAngle: extracted.marketingAngle || prev.marketingAngle,
              callToAction: nextCta,
              additionalNotes: nextNotes,
            };
          });

          setExtractMessage({
            type: 'success',
            text: `Đã tự động trích xuất thông tin sản phẩm thành công từ liên kết!`,
          });
          return;
        }
      }
      throw new Error('Server endpoint unavailable');
    } catch {
      // Fallback for static hosting (GitHub Pages)
      try {
        const clientExtracted = extractUrlClientSide(formData.productUrl.trim());
        setFormData((prev) => {
          const nextCategory = (clientExtracted.sportCategory as any) || prev.sportCategory;
          const nextProductName = clientExtracted.productName || prev.productName;
          const nextCta =
            clientExtracted.callToAction ||
            sanitizeCtaForSport(nextCategory, nextProductName, prev.callToAction);
          const nextNotes =
            clientExtracted.additionalNotes ||
            sanitizeNotesForSport(nextCategory, nextProductName, prev.additionalNotes);

          return {
            ...prev,
            productName: nextProductName,
            sportCategory: nextCategory,
            productDescription: clientExtracted.productDescription || prev.productDescription,
            offerDetails: clientExtracted.offerDetails || prev.offerDetails,
            callToAction: nextCta,
            additionalNotes: nextNotes,
          };
        });
        setExtractMessage({
          type: 'success',
          text: `Đã phân tích đường link thành công (chế độ tĩnh GitHub Pages)!`,
        });
      } catch (err: any) {
        setExtractMessage({
          type: 'error',
          text: err?.message || 'Có lỗi xảy ra khi đọc link. Bạn vẫn có thể điền thông tin thủ công bên dưới.',
        });
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSportCategorySelect = (category: SportCategory) => {
    setFormData((prev) => {
      const isRacketSport =
        category === 'Pickleball' || category === 'Cầu lông' || category === 'Bóng bàn';
      const isOldCtaRacket = /test vợt|vợt|căng cước|dink bóng|smash/i.test(prev.callToAction);
      const nextCta =
        !prev.callToAction || (!isRacketSport && isOldCtaRacket)
          ? sanitizeCtaForSport(category, prev.productName, '')
          : prev.callToAction;

      const isOldNotesRacket = /dink bóng|vợt|smash/i.test(prev.additionalNotes || '');
      const nextNotes =
        !prev.additionalNotes || (!isRacketSport && isOldNotesRacket)
          ? sanitizeNotesForSport(category, prev.productName, '')
          : prev.additionalNotes;

      return {
        ...prev,
        sportCategory: category,
        callToAction: nextCta,
        additionalNotes: nextNotes,
      };
    });
  };

  return (
    <div id="campaign-input-card" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      {/* Header & Quick Sports Samples */}
      <div className="pb-4 mb-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-600" />
            Thiết Lập Chiến Dịch Marketing Thể Thao
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Dụng Cụ & Máy Tập
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Chọn môn thể thao, góc tiếp cận và tính năng để AI tạo bài viết, media prompt và JSON tự động.
        </p>

        {/* Quick Sports Samples Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Mẫu chiến dịch thể thao tiêu biểu:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SAMPLE_CAMPAIGNS.map((sample, idx) => (
              <button
                key={idx}
                id={`btn-load-sample-${idx}`}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  formData.productName === sample.data.productName
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border-slate-200 text-slate-700'
                }`}
              >
                {sample.badge}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        {/* Link Web / URL Bài Viết hoặc Sản Phẩm Dịch Vụ */}
        <div id="product-url-section" className="bg-gradient-to-r from-emerald-50/50 via-slate-50 to-blue-50/40 border border-emerald-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <label htmlFor="productUrl" className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Link Web / URL Bài Viết hoặc Sản Phẩm Dịch Vụ
            </label>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Tự Động Phân Tích
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                id="productUrl"
                type="url"
                value={formData.productUrl || ''}
                onChange={(e) => {
                  handleInputChange('productUrl', e.target.value);
                  if (extractMessage) setExtractMessage(null);
                }}
                placeholder="Dán link Shopee, Tiki, Lazada, website hãng thể thao hoặc bài viết review..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-xs"
              />
            </div>

            <button
              id="btn-extract-from-url"
              type="button"
              onClick={handleExtractFromUrl}
              disabled={isExtracting || !formData.productUrl?.trim()}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                isExtracting || !formData.productUrl?.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-98 border border-emerald-700'
              }`}
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang quét web...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quét & Tự Điền</span>
                </>
              )}
            </button>
          </div>

          {extractMessage && (
            <div
              className={`text-xs flex items-center gap-2 p-2.5 rounded-lg transition-all ${
                extractMessage.type === 'success'
                  ? 'bg-emerald-100/80 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              {extractMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              )}
              <span className="flex-1 font-medium">{extractMessage.text}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 leading-relaxed">
            💡 <strong>Mẹo:</strong> Dán đường link để AI đọc trực tiếp thông số kỹ thuật, giá bán và công nghệ từ website hoặc bài viết, giúp bài đăng Facebook và kịch bản video sát với thực tế nhất.
          </p>
        </div>

        {/* Chọn Bộ Môn Thể Thao */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            1. Phân Loại Môn Thể Thao / Dụng Cụ <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
            {SPORT_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => handleSportCategorySelect(cat.label)}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-left flex items-center gap-1.5 border transition-all ${
                  formData.sportCategory === cat.label
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tên sản phẩm */}
        <div>
          <label htmlFor="productName" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            2. Tên Sản Phẩm / Dụng Cụ / Máy Tập <span className="text-rose-500">*</span>
          </label>
          <input
            id="productName"
            type="text"
            required
            value={formData.productName}
            onChange={(e) => handleInputChange('productName', e.target.value)}
            placeholder="Ví dụ: Vợt Pickleball Carbon T700, Máy chạy bộ ProRun 3.5HP, Giày đá bóng Striker Neo TF..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
        </div>

        {/* Góc tiếp cận Marketing & Công thức */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="marketingAngle" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              Góc Tiếp Cận (Marketing Angle)
            </label>
            <select
              id="marketingAngle"
              value={formData.marketingAngle}
              onChange={(e) => handleInputChange('marketingAngle', e.target.value as MarketingAngle)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition-all cursor-pointer font-medium"
            >
              {MARKETING_ANGLES.map((angle) => (
                <option key={angle} value={angle}>
                  {angle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="copywritingFormula" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Công Thức Copywriting
            </label>
            <select
              id="copywritingFormula"
              value={formData.copywritingFormula}
              onChange={(e) => handleInputChange('copywritingFormula', e.target.value as CopywritingFormula)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition-all cursor-pointer font-medium"
            >
              <option value="AIDA">AIDA (Chú ý - Hứng thú - Khao khát - Hành động)</option>
              <option value="PAS">PAS (Nỗi đau tập luyện - Đào sâu - Giải pháp)</option>
              <option value="Storytelling">Storytelling (Hành trình thể thao & bứt phá)</option>
              <option value="FOMO">FOMO (Ưu đãi xả kho & số lượng có hạn)</option>
              <option value="FAB">FAB (Thông số kỹ thuật → Trợ lực → Lợi ích)</option>
            </select>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label htmlFor="productDescription" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            3. Thông Số Kỹ Thuật, Chất Liệu & Tính Năng Vượt Trội <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="productDescription"
            required
            rows={3}
            value={formData.productDescription}
            onChange={(e) => handleInputChange('productDescription', e.target.value)}
            placeholder="Chất liệu sợi carbon T700, động cơ 3.5HP giảm chấn khớp gối, đinh dăm TF bám sân cỏ nhân tạo, độ căng 30lbs trợ lực..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-y"
          />
          <p className="text-[11px] text-slate-500 mt-1 italic">
            {FORMULA_DESCRIPTIONS[formData.copywritingFormula]}
          </p>
        </div>

        {/* Grid 2 cột: Đối tượng & Khuyến mãi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetAudience" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              Người Chơi / Khách Hàng Mục Tiêu
            </label>
            <input
              id="targetAudience"
              type="text"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              placeholder="Lông thủ phong trào, dân văn phòng chơi Pickleball, gia đình cần cardio tại nhà..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="offerDetails" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Combo Quà Tặng / Ưu Đãi Thể Thao
            </label>
            <input
              id="offerDetails"
              type="text"
              value={formData.offerDetails}
              onChange={(e) => handleInputChange('offerDetails', e.target.value)}
              placeholder="Tặng 3 quả bóng thi đấu + túi đựng vợt 350k, miễn phí căng cước..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid 2 cột: Giọng điệu & Lời kêu gọi hành động */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="toneOfVoice" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              Giọng Điệu (Tone of Voice)
            </label>
            <select
              id="toneOfVoice"
              value={formData.toneOfVoice}
              onChange={(e) => handleInputChange('toneOfVoice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition-all cursor-pointer font-medium"
            >
              {TONE_OPTIONS.map((tone, idx) => (
                <option key={idx} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="callToAction" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lời Kêu Gọi Hành Động (CTA)
              </label>
              {formData.sportCategory && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60">
                  Chuẩn môn: {formData.sportCategory}
                </span>
              )}
            </div>
            <input
              id="callToAction"
              type="text"
              value={formData.callToAction}
              onChange={(e) => handleInputChange('callToAction', e.target.value)}
              placeholder={
                (SPORT_CTA_PRESETS[formData.sportCategory] || SPORT_CTA_PRESETS['Dụng cụ thể thao khác'])[0] ||
                'Nhắn tin ngay để nhận tư vấn & ưu đãi quà tặng!'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />

            {/* Quick CTA preset chips */}
            <div className="mt-1.5 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-400 font-medium">Gợi ý nhanh:</span>
              {(SPORT_CTA_PRESETS[formData.sportCategory] || SPORT_CTA_PRESETS['Dụng cụ thể thao khác']).slice(0, 3).map((cta, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInputChange('callToAction', cta)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all truncate max-w-[210px] ${
                    formData.callToAction === cta
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  title={cta}
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle tùy chọn nâng cao (Hẹn giờ & Ghi chú) */}
        <div className="pt-1">
          <button
            id="btn-toggle-advanced-options"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{showAdvanced ? '− Thu gọn tùy chọn lịch đăng & ghi chú' : '+ Thêm lịch hẹn giờ đăng Facebook & ghi chú riêng'}</span>
          </button>
        </div>

        {showAdvanced && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div>
              <label htmlFor="scheduledPublishTime" className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Thời Gian Hẹn Giờ Đăng Bài (Tùy chọn - scheduled_publish_time)
              </label>
              <input
                id="scheduledPublishTime"
                type="datetime-local"
                value={formData.scheduledPublishTime}
                onChange={(e) => handleInputChange('scheduledPublishTime', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-emerald-500 text-xs text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Nếu để trống, giá trị trong JSON tự động hóa sẽ là <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">null</code> (đăng ngay lập tức).
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="additionalNotes" className="block text-xs font-bold text-slate-700">
                  Ghi Chú Phong Cách Riêng / Yêu Cầu Kỹ Thuật Thể Thao
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      'additionalNotes',
                      SPORT_NOTES_PRESETS[formData.sportCategory] || SPORT_NOTES_PRESETS['Dụng cụ thể thao khác']
                    )
                  }
                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Áp dụng gợi ý chuẩn bộ môn
                </button>
              </div>
              <input
                id="additionalNotes"
                type="text"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder={
                  SPORT_NOTES_PRESETS[formData.sportCategory] ||
                  'Ví dụ: Nhấn mạnh công nghệ, chứng nhận chính hãng và bảo hành 1 đổi 1...'
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-emerald-500 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        )}

        {/* Nút Submit */}
        <div className="pt-2 flex items-center gap-3">
          <button
            id="btn-submit-generate"
            type="submit"
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Đang Sáng Tạo Chiến Dịch Thể Thao...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tạo Nội Dung Marketing Thể Thao Ngay</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
