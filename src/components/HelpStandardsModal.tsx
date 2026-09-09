import { useState } from 'react';
import { X, CheckCircle2, FileText, Image as ImageIcon, Code2, Globe, AlertTriangle, Play, Terminal, ExternalLink, Copy, Check } from 'lucide-react';

interface HelpStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpStandardsModal({ isOpen, onClose }: HelpStandardsModalProps) {
  const [activeTab, setActiveTab] = useState<'standards' | 'github_pages'>('github_pages');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="help-modal"
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Trung Tâm Trợ Giúp & Hướng Dẫn Kỹ Thuật</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quy chuẩn 3 mục chiến dịch & Hướng dẫn hiện link GitHub Pages
            </p>
          </div>
          <button
            id="btn-close-help"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('github_pages')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'github_pages'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Khắc phục chưa thấy Link URL GitHub Pages</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-extrabold">Cần đọc</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standards')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'standards'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Quy chuẩn Marketing 3 Mục</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'github_pages' ? (
            <div className="space-y-4">
              {/* Alert notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">
                    Vì sao cài đặt GitHub Pages xong vẫn CHƯA THẤY link web xuất hiện?
                  </h4>
                  <p className="text-amber-800 mt-1 text-xs leading-relaxed">
                    Trên GitHub, đường link URL màu xanh lá (dạng <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">https://username.github.io/repo-name/</code>) <b>chỉ xuất hiện sau khi quá trình Build/Deploy đầu tiên hoàn tất thành công</b>. Hãy chọn 1 trong 2 cách cực kỳ nhanh dưới đây để làm link xuất hiện ngay:
                  </p>
                </div>
              </div>

              {/* Method 1: GitHub Actions */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
                    <Play className="w-4 h-4 text-blue-600 fill-current" />
                    Cách 1: Kích hoạt chạy GitHub Actions (Tự động 100% - Khuyên Dùng)
                  </h4>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">Khuyên dùng</span>
                </div>

                <p className="text-slate-700">
                  Nếu bạn đã chọn <b>Build and deployment &gt; Source: GitHub Actions</b>, bạn cần kích hoạt nó chạy lần đầu tiên:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-slate-800 pl-1">
                  <li>
                    Trên thanh menu của repository GitHub, bấm vào tab <b>&ldquo;Actions&rdquo;</b> (bên cạnh tab Code, Pull requests).
                  </li>
                  <li>
                    Ở danh sách Workflows bên trái, nhấp chọn: <b>&ldquo;Deploy to GitHub Pages&rdquo;</b>.
                  </li>
                  <li>
                    Nhìn sang góc bên phải, bấm vào nút màu xanh: <b>&ldquo;Run workflow&rdquo;</b> &gt; chọn branch <code>main</code> hoặc <code>master</code> &gt; bấm nút <b>&ldquo;Run workflow&rdquo;</b>.
                  </li>
                  <li>
                    Đợi khoảng <b>1 - 2 phút</b> cho đến khi tiến trình chạy xong và hiện dấu tích xanh <b>✅</b>.
                  </li>
                  <li>
                    Quay lại tab <b>Settings &gt; Pages</b>, bạn sẽ thấy ngay thông báo viền xanh:
                    <div className="mt-1.5 p-2 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 font-mono text-[11px] font-bold">
                      &quot;Your site is live at https://[tên-github-của-bạn].github.io/[tên-repo]/&quot;
                    </div>
                  </li>
                </ol>

                <div className="p-2.5 bg-white rounded-lg border border-blue-100 text-[11px] text-slate-600">
                  💡 <b>Lưu ý quyền (Workflow Permissions):</b> Nếu Action báo lỗi quyền, vào <b>Settings &gt; Actions &gt; General</b> &gt; cuộn xuống mục <b>Workflow permissions</b> &gt; tích chọn <b>&ldquo;Read and write permissions&rdquo;</b> rồi bấm <b>Save</b>.
                </div>
              </div>

              {/* Method 2: npm run deploy */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                    <Terminal className="w-4 h-4 text-emerald-600" />
                    Cách 2: Triển khai 1 lệnh bằng `npm run deploy` (Cực Kỳ Đơn Giản)
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">1 Lệnh duy nhất</span>
                </div>

                <p className="text-slate-700">
                  Dự án đã được cấu hình sẵn thư viện <code>gh-pages</code>. Bạn chỉ cần mở terminal trên máy và gõ:
                </p>

                <div className="flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-xs">
                  <span>npm run deploy</span>
                  <button
                    type="button"
                    onClick={() => copyCommand('npm run deploy', 'deploy-cmd')}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copiedCmd === 'deploy-cmd' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-700">
                  Lệnh này sẽ tự động đóng gói web vào <code>dist</code> và đẩy lên nhánh <code>gh-pages</code> trên GitHub.
                </p>

                <div className="space-y-1 text-slate-800">
                  <p>Sau đó trên GitHub:</p>
                  <ul className="list-disc list-inside pl-1 space-y-1">
                    <li>Vào <b>Settings &gt; Pages</b>.</li>
                    <li>Ở mục <b>Source</b>, chọn <b>&ldquo;Deploy from a branch&rdquo;</b>.</li>
                    <li>Ở mục <b>Branch</b>, chọn nhánh <b><code>gh-pages</code></b> và thư mục <b><code>/(root)</code></b> &gt; Bấm <b>Save</b>.</li>
                  </ul>
                  <p className="font-bold text-emerald-800 pt-1">
                    ✨ Sau 30 giây, link web sẽ xuất hiện ngay lập tức!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                  <FileText className="w-4 h-4 text-blue-600" />
                  1. Tạo Bài Đăng Facebook (Văn Bản)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  <li>Thu hút chú ý mạnh mẽ ngay trong 3 dòng đầu (Stop the scroll).</li>
                  <li>Áp dụng các công thức kinh điển: <b>AIDA</b>, <b>PAS</b>, <b>FAB</b>, hoặc <b>Storytelling</b>.</li>
                  <li>Lời kêu gọi hành động (CTA) dứt khoát, thôi thúc khách hàng tương tác hoặc nhắn tin.</li>
                  <li>Chèn hashtag tối ưu thuật toán thể thao (#Pickleball, #CauLong, #GymFitness,...).</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 space-y-1.5">
                <h4 className="font-bold text-violet-900 flex items-center gap-1.5 text-sm">
                  <ImageIcon className="w-4 h-4 text-violet-600" />
                  2. Tạo Câu Lệnh Hình Ảnh & Kịch Bản Video
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  <li><b>Hình ảnh:</b> Prompt chi tiết bằng tiếng Anh (dành cho Midjourney, DALL-E) kèm bối cảnh sân đấu, cinematic rim lighting, hiệu ứng chuyển động và tỷ lệ <code>--ar 1:1</code>.</li>
                  <li><b>Video ngắn (15-30 giây):</b> Phân cảnh theo từng mốc giây (0-3s Hook, 3-10s Trải nghiệm, 10-15s Kêu gọi hành động), gồm phần <i>Visual (Hình ảnh)</i> và <i>Audio (Lời bình)</i>.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  3. Đóng Gói Dữ Liệu Tự Động Hóa (Định Dạng JSON)
                </h4>
                <p>
                  Chuẩn hóa dữ liệu để các công cụ tự động hóa như n8n, Make, Zapier hoặc Facebook Graph API có thể đăng bài tự động hoặc hẹn giờ xuất bản:
                </p>
                <div className="bg-slate-900 text-emerald-300 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {`{
  "platform": "facebook",
  "post_type": "text_with_media",
  "message": "[Nội dung bài viết Facebook]",
  "scheduled_publish_time": null,
  "media_generation_prompt": "[Prompt tạo ảnh tiếng Anh]"
}`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {activeTab === 'github_pages'
              ? 'Tất cả cấu hình base ./ và workflow đã sẵn sàng trong mã nguồn.'
              : 'Đảm bảo tuân thủ đầy đủ 3 mục trước khi xuất bản.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
