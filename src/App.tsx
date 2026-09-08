import { useState, useEffect } from 'react';
import Header from './components/Header';
import CampaignForm from './components/CampaignForm';
import FacebookMockup from './components/FacebookMockup';
import MediaScriptViewer from './components/MediaScriptViewer';
import JsonPayloadViewer from './components/JsonPayloadViewer';
import RawOutputViewer from './components/RawOutputViewer';
import CampaignHistory from './components/CampaignHistory';
import HelpStandardsModal from './components/HelpStandardsModal';
import { CampaignInput, CampaignResult } from './types';
import { SAMPLE_CAMPAIGNS } from './data/samples';
import { generateClientSideCampaign } from './data/clientFallbackGenerator';
import { Eye, FileCode, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

const INITIAL_CAMPAIGN = SAMPLE_CAMPAIGNS[0].data;

// Default pre-populated result so the app displays instantly on first load
const DEFAULT_PREVIEW_RESULT: CampaignResult = {
  id: 'default-preview-1',
  timestamp: new Date().toISOString(),
  rawText: `### 📝 BÀI VIẾT FACEBOOK
🎾 BẠN ĐANG MẤT ĐIỂM ĐÁNG TIẾC VÌ CẦM TRÊN TAY CÂY VỢT RUNG TAY VÀ THIẾU SPIN?
Đối thủ liên tục dink bóng khó, bóng xoáy hiểm hóc khiến bạn lúng túng đánh hỏng?
Đã đến lúc nâng cấp vũ khí thi đấu và làm chủ toàn diện sân đấu Pickleball cùng siêu phẩm hot nhất năm 2026!

⚡ CHÀO MỪNG BẠN ĐẾN VỚI: VỢT PICKLEBALL SỢI CARBON TORAY T700 SPINMASTER PRO!
Được nghiên cứu và chế tác chuyên biệt cho người chơi mong muốn bứt phá trình độ từ phong trào lên thi đấu chuyên nghiệp:
✅ Bề mặt sợi Carbon thô Toray T700 Nhật Bản: Tạo độ nhám ma sát cực đại, giúp mọi cú xoáy spin, cắt bóng hay topspin cắm sân chuẩn xác đến từng centimet.
✅ Lõi tổ ong Polypropylene Polymer 16mm: Triệt tiêu 95% rung chấn, mở rộng điểm ngọt (sweet-spot) tối đa, cho cảm giác dink bóng mềm mại và kiểm soát bóng hoàn hảo.
✅ Cán vợt công thái học bọc da đục lỗ thoáng khí: Chống trơn trượt mồ hôi, đầm tay, vung vợt linh hoạt cho cả đánh đơn lẫn đánh đôi.
✅ Đạt chuẩn kiểm định USAPA Approved cho mọi giải đấu chính thức!

🎁 COMBO ƯU ĐÃI ĐỘC QUYỀN TRONG TUẦN LỄ RA MẮT:
- Tặng ngay 03 quả bóng Pickleball chuẩn thi đấu quốc tế trị giá 150.000đ
- Tặng 01 túi bao vợt chống sốc cao cấp trị giá 200.000đ
- Miễn phí giao hàng toàn quốc + Cho phép kiểm tra và test bóng tại sân trước khi thanh toán!

👇 Bấm "Gửi tin nhắn" để chọn màu sắc & nhận ngay ưu đãi quà tặng trước khi hết suất!
#PickleballVietnam #VotPickleball #TorayT700 #SpinMasterPro #TheThaoPhongTrao #PickleballChinhHang

### 🎨 GỢI Ý HÌNH ẢNH / VIDEO
**Câu lệnh tạo ảnh (Bằng tiếng Anh):**
A dynamic commercial sports photography shot of a sleek Toray T700 raw carbon fiber pickleball paddle, displayed prominently on a vibrant blue-and-green outdoor pickleball court under golden hour stadium floodlights. Neon yellow pickleball in mid-air with subtle motion blur, crisp sweat droplets on the court, dramatic rim lighting, hyper-realistic, photorealistic 8k octane render, cinematic depth of field, commercial sports product aesthetic --ar 1:1

**Kịch bản Video ngắn (Tùy chọn nếu cần thiết):**
- Giây 0-3: Visual: Cận cảnh một cú smash bóng Pickleball tốc độ cao, bóng cắm thẳng xuống vạch vôi sân đối thủ. Audio: Tiếng "pop" đanh thép vang dội khắp sân đấu. Lời bình: "Bạn có muốn mọi cú smash trên sân đều cắm sâu và hiểm hóc như thế này?"
- Giây 3-10: Visual: Góc quay 360 độ siêu nét zoom vào bề mặt vân carbon nhám Toray T700 và cấu trúc lõi tổ ong 16mm giảm chấn. Audio: Nhạc beat workout thể thao sôi động, dồn dập. Lời bình: "Công nghệ sợi Carbon Toray T700 Nhật Bản kết hợp lõi tổ ong 16mm - Tối đa hóa độ xoáy spin và triệt tiêu mỏi cổ tay."
- Giây 10-15: Visual: Vận động viên tươi cười giơ cao vợt ăn mừng cùng đồng đội, màn hình hiện combo quà tặng 3 bóng + bao vợt kèm nút 'Nhắn tin ngay'. Audio: Tiếng vỗ tay reo hò và giai điệu chiến thắng. Lời bình: "Nhắn tin ngay hôm nay để nhận trọn bộ quà tặng 350K và miễn phí giao hàng toàn quốc!"

### ⚙️ CẤU TRÚC JSON (DỮ LIỆU API)
\`\`\`json
{
  "platform": "facebook",
  "post_type": "text_with_media",
  "message": "🎾 BẠN ĐANG MẤT ĐIỂM ĐÁNG TIẾC VÌ CẦM TRÊN TAY CÂY VỢT RUNG TAY VÀ THIẾU SPIN?\\nĐối thủ liên tục dink bóng khó, bóng xoáy hiểm hóc khiến bạn lúng túng đánh hỏng?\\nĐã đến lúc nâng cấp vũ khí thi đấu và làm chủ toàn diện sân đấu Pickleball cùng siêu phẩm hot nhất năm 2026!\\n\\n⚡ CHÀO MỪNG BẠN ĐẾN VỚI: VỢT PICKLEBALL SỢI CARBON TORAY T700 SPINMASTER PRO!\\nĐược nghiên cứu và chế tác chuyên biệt cho người chơi mong muốn bứt phá trình độ từ phong trào lên thi đấu chuyên nghiệp:\\n✅ Bề mặt sợi Carbon thô Toray T700 Nhật Bản: Tạo độ nhám ma sát cực đại, giúp mọi cú xoáy spin, cắt bóng hay topspin cắm sân chuẩn xác đến từng centimet.\\n✅ Lõi tổ ong Polypropylene Polymer 16mm: Triệt tiêu 95% rung chấn, mở rộng điểm ngọt (sweet-spot) tối đa, cho cảm giác dink bóng mềm mại và kiểm soát bóng hoàn hảo.\\n✅ Cán vợt công thái học bọc da đục lỗ thoáng khí: Chống trơn trượt mồ hôi, đầm tay, vung vợt linh hoạt cho cả đánh đơn lẫn đánh đôi.\\n✅ Đạt chuẩn kiểm định USAPA Approved cho mọi giải đấu chính thức!\\n\\n🎁 COMBO ƯU ĐÃI ĐỘC QUYỀN TRONG TUẦN LỄ RA MẮT:\\n- Tặng ngay 03 quả bóng Pickleball chuẩn thi đấu quốc tế trị giá 150.000đ\\n- Tặng 01 túi bao vợt chống sốc cao cấp trị giá 200.000đ\\n- Miễn phí giao hàng toàn quốc + Cho phép kiểm tra và test bóng tại sân trước khi thanh toán!\\n\\n👇 Bấm \\\"Gửi tin nhắn\\\" để chọn màu sắc & nhận ngay ưu đãi quà tặng trước khi hết suất!\\n#PickleballVietnam #VotPickleball #TorayT700 #SpinMasterPro #TheThaoPhongTrao #PickleballChinhHang",
  "scheduled_publish_time": null,
  "media_generation_prompt": "A dynamic commercial sports photography shot of a sleek Toray T700 raw carbon fiber pickleball paddle, displayed prominently on a vibrant blue-and-green outdoor pickleball court under golden hour stadium floodlights. Neon yellow pickleball in mid-air with subtle motion blur, crisp sweat droplets on the court, dramatic rim lighting, hyper-realistic, photorealistic 8k octane render, cinematic depth of field, commercial sports product aesthetic --ar 1:1"
}
\`\`\``,
  facebookPost: `🎾 BẠN ĐANG MẤT ĐIỂM ĐÁNG TIẾC VÌ CẦM TRÊN TAY CÂY VỢT RUNG TAY VÀ THIẾU SPIN?
Đối thủ liên tục dink bóng khó, bóng xoáy hiểm hóc khiến bạn lúng túng đánh hỏng?
Đã đến lúc nâng cấp vũ khí thi đấu và làm chủ toàn diện sân đấu Pickleball cùng siêu phẩm hot nhất năm 2026!

⚡ CHÀO MỪNG BẠN ĐẾN VỚI: VỢT PICKLEBALL SỢI CARBON TORAY T700 SPINMASTER PRO!
Được nghiên cứu và chế tác chuyên biệt cho người chơi mong muốn bứt phá trình độ từ phong trào lên thi đấu chuyên nghiệp:
✅ Bề mặt sợi Carbon thô Toray T700 Nhật Bản: Tạo độ nhám ma sát cực đại, giúp mọi cú xoáy spin, cắt bóng hay topspin cắm sân chuẩn xác đến từng centimet.
✅ Lõi tổ ong Polypropylene Polymer 16mm: Triệt tiêu 95% rung chấn, mở rộng điểm ngọt (sweet-spot) tối đa, cho cảm giác dink bóng mềm mại và kiểm soát bóng hoàn hảo.
✅ Cán vợt công thái học bọc da đục lỗ thoáng khí: Chống trơn trượt mồ hôi, đầm tay, vung vợt linh hoạt cho cả đánh đơn lẫn đánh đôi.
✅ Đạt chuẩn kiểm định USAPA Approved cho mọi giải đấu chính thức!

🎁 COMBO ƯU ĐÃI ĐỘC QUYỀN TRONG TUẦN LỄ RA MẮT:
- Tặng ngay 03 quả bóng Pickleball chuẩn thi đấu quốc tế trị giá 150.000đ
- Tặng 01 túi bao vợt chống sốc cao cấp trị giá 200.000đ
- Miễn phí giao hàng toàn quốc + Cho phép kiểm tra và test bóng tại sân trước khi thanh toán!

👇 Bấm "Gửi tin nhắn" để chọn màu sắc & nhận ngay ưu đãi quà tặng trước khi hết suất!
#PickleballVietnam #VotPickleball #TorayT700 #SpinMasterPro #TheThaoPhongTrao #PickleballChinhHang`,
  imagePrompt:
    'A dynamic commercial sports photography shot of a sleek Toray T700 raw carbon fiber pickleball paddle, displayed prominently on a vibrant blue-and-green outdoor pickleball court under golden hour stadium floodlights. Neon yellow pickleball in mid-air with subtle motion blur, crisp sweat droplets on the court, dramatic rim lighting, hyper-realistic, photorealistic 8k octane render, cinematic depth of field, commercial sports product aesthetic --ar 1:1',
  videoScript: `- Giây 0-3: Visual: Cận cảnh một cú smash bóng Pickleball tốc độ cao, bóng cắm thẳng xuống vạch vôi sân đối thủ. Audio: Tiếng "pop" đanh thép vang dội khắp sân đấu. Lời bình: "Bạn có muốn mọi cú smash trên sân đều cắm sâu và hiểm hóc như thế này?"
- Giây 3-10: Visual: Góc quay 360 độ siêu nét zoom vào bề mặt vân carbon nhám Toray T700 và cấu trúc lõi tổ ong 16mm giảm chấn. Audio: Nhạc beat workout thể thao sôi động, dồn dập. Lời bình: "Công nghệ sợi Carbon Toray T700 Nhật Bản kết hợp lõi tổ ong 16mm - Tối đa hóa độ xoáy spin và triệt tiêu mỏi cổ tay."
- Giây 10-15: Visual: Vận động viên tươi cười giơ cao vợt ăn mừng cùng đồng đội, màn hình hiện combo quà tặng 3 bóng + bao vợt kèm nút 'Nhắn tin ngay'. Audio: Tiếng vỗ tay reo hò và giai điệu chiến thắng. Lời bình: "Nhắn tin ngay hôm nay để nhận trọn bộ quà tặng 350K và miễn phí giao hàng toàn quốc!"`,
  jsonData: {
    platform: 'facebook',
    post_type: 'text_with_media',
    message: `🎾 BẠN ĐANG MẤT ĐIỂM ĐÁNG TIẾC VÌ CẦM TRÊN TAY CÂY VỢT RUNG TAY VÀ THIẾU SPIN?\nĐối thủ liên tục dink bóng khó, bóng xoáy hiểm hóc khiến bạn lúng túng đánh hỏng?\nĐã đến lúc nâng cấp vũ khí thi đấu và làm chủ toàn diện sân đấu Pickleball cùng siêu phẩm hot nhất năm 2026!\n\n⚡ CHÀO MỪNG BẠN ĐẾN VỚI: VỢT PICKLEBALL SỢI CARBON TORAY T700 SPINMASTER PRO!\nĐược nghiên cứu và chế tác chuyên biệt cho người chơi mong muốn bứt phá trình độ từ phong trào lên thi đấu chuyên nghiệp:\n✅ Bề mặt sợi Carbon thô Toray T700 Nhật Bản: Tạo độ nhám ma sát cực đại, giúp mọi cú xoáy spin, cắt bóng hay topspin cắm sân chuẩn xác đến từng centimet.\n✅ Lõi tổ ong Polypropylene Polymer 16mm: Triệt tiêu 95% rung chấn, mở rộng điểm ngọt (sweet-spot) tối đa, cho cảm giác dink bóng mềm mại và kiểm soát bóng hoàn hảo.\n✅ Cán vợt công thái học bọc da đục lỗ thoáng khí: Chống trơn trượt mồ hôi, đầm tay, vung vợt linh hoạt cho cả đánh đơn lẫn đánh đôi.\n✅ Đạt chuẩn kiểm định USAPA Approved cho mọi giải đấu chính thức!\n\n🎁 COMBO ƯU ĐÃI ĐẶC QUYỀN TRONG TUẦN LỄ RA MẮT:\n- Tặng ngay 03 quả bóng Pickleball chuẩn thi đấu quốc tế trị giá 150.000đ\n- Tặng 01 túi bao vợt chống sốc cao cấp trị giá 200.000đ\n- Miễn phí giao hàng toàn quốc + Cho phép kiểm tra và test bóng tại sân trước khi thanh toán!\n\n👇 Bấm \"Gửi tin nhắn\" để chọn màu sắc & nhận ngay ưu đãi quà tặng trước khi hết suất!\n#PickleballVietnam #VotPickleball #TorayT700 #SpinMasterPro #TheThaoPhongTrao #PickleballChinhHang`,
    scheduled_publish_time: null,
    media_generation_prompt:
      'A dynamic commercial sports photography shot of a sleek Toray T700 raw carbon fiber pickleball paddle, displayed prominently on a vibrant blue-and-green outdoor pickleball court under golden hour stadium floodlights. Neon yellow pickleball in mid-air with subtle motion blur, crisp sweat droplets on the court, dramatic rim lighting, hyper-realistic, photorealistic 8k octane render, cinematic depth of field, commercial sports product aesthetic --ar 1:1',
  },
  input: INITIAL_CAMPAIGN,
};

export default function App() {
  const [formData, setFormData] = useState<CampaignInput>(INITIAL_CAMPAIGN);
  const [currentResult, setCurrentResult] = useState<CampaignResult>(DEFAULT_PREVIEW_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [history, setHistory] = useState<CampaignResult[]>(() => {
    try {
      const saved = localStorage.getItem('fb_marketing_history');
      return saved ? JSON.parse(saved) : [DEFAULT_PREVIEW_RESULT];
    } catch {
      return [DEFAULT_PREVIEW_RESULT];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fb_marketing_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
  }, [history]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo chiến dịch marketing.');
      }

      const newResult: CampaignResult = {
        id: `campaign-${Date.now()}`,
        timestamp: new Date().toISOString(),
        rawText: data.rawText,
        facebookPost: data.facebookPost,
        imagePrompt: data.imagePrompt,
        videoScript: data.videoScript,
        jsonData: data.jsonData,
        input: { ...formData },
        metadata: data.metadata,
      };

      setCurrentResult(newResult);
      setHistory((prev) => [newResult, ...prev.filter((item) => item.id !== newResult.id)]);
    } catch (serverErr: any) {
      console.warn('Server generation unavailable, using client fallback (e.g. GitHub Pages):', serverErr);
      try {
        // Resilient fallback for GitHub Pages (client-side static hosting)
        const fallbackData = generateClientSideCampaign(formData);
        const fallbackResult: CampaignResult = {
          id: `campaign-${Date.now()}`,
          timestamp: new Date().toISOString(),
          rawText: fallbackData.rawText,
          facebookPost: fallbackData.facebookPost,
          imagePrompt: fallbackData.imagePrompt,
          videoScript: fallbackData.videoScript,
          jsonData: fallbackData.jsonData,
          input: { ...formData },
          metadata: fallbackData.metadata,
        };

        setCurrentResult(fallbackResult);
        setHistory((prev) => [fallbackResult, ...prev.filter((item) => item.id !== fallbackResult.id)]);
      } catch (clientErr: any) {
        console.error('Client fallback failed:', clientErr);
        setErrorMessage(serverErr?.message || 'Không thể tạo nội dung, vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePostText = (newText: string) => {
    setCurrentResult((prev) => ({
      ...prev,
      facebookPost: newText,
      jsonData: {
        ...prev.jsonData,
        message: newText,
      },
    }));
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chiến dịch?')) {
      setHistory([]);
    }
  };

  const handleSelectHistoryItem = (item: CampaignResult) => {
    setCurrentResult(item);
    if (item.input) {
      setFormData((prev) => ({
        ...prev,
        ...item.input,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-700 hover:underline ml-4"
            >
              Đóng
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Inputs & Campaign Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <CampaignForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: 3 Output Sections */}
          <div className="lg:col-span-7 space-y-6">
            {/* View Switcher Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  id="tab-visual-view"
                  type="button"
                  onClick={() => setActiveTab('visual')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'visual'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trực Quan (Giao Diện FB & Media)</span>
                </button>

                <button
                  id="tab-markdown-view"
                  type="button"
                  onClick={() => setActiveTab('markdown')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'markdown'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Định Dạng Markdown (3 Mục Chuẩn)</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline mr-2">
                Công thức: <strong className="text-slate-700">{formData.copywritingFormula}</strong>
              </span>
            </div>

            {activeTab === 'visual' ? (
              <div className="space-y-6">
                {/* 1. Facebook Mockup Post */}
                <FacebookMockup
                  postText={currentResult.facebookPost}
                  imagePrompt={currentResult.imagePrompt}
                  brandName={formData.productName || 'Thương Hiệu Của Bạn'}
                  productUrl={formData.productUrl || currentResult.metadata?.productUrl || undefined}
                  onUpdatePostText={handleUpdatePostText}
                />

                {/* 2. Media Image & Video Script */}
                <MediaScriptViewer
                  imagePrompt={currentResult.imagePrompt}
                  videoScript={currentResult.videoScript}
                />

                {/* 3. JSON Automation API Payload */}
                <JsonPayloadViewer jsonData={currentResult.jsonData} />
              </div>
            ) : (
              /* Raw Verbatim Markdown view */
              <RawOutputViewer rawText={currentResult.rawText} />
            )}
          </div>
        </div>
      </main>

      {/* History Drawer/Modal */}
      <CampaignHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Standards & Formulas Help Modal */}
      <HelpStandardsModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <p>
          Trợ Lý Marketing Facebook AI • Hỗ trợ AIDA, PAS, Storytelling, Prompt Midjourney v6 & Tự động hóa Facebook Graph API
        </p>
      </footer>
    </div>
  );
}
