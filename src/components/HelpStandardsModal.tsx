import { X, CheckCircle2, FileText, Image as ImageIcon, Code2 } from 'lucide-react';

interface HelpStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpStandardsModal({ isOpen, onClose }: HelpStandardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="help-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Quy Chuẩn Marketing & Tự Động Hóa Facebook
            </h3>
            <p className="text-xs text-slate-500">
              3 bước tiêu chuẩn bắt buộc cho mọi chiến dịch Facebook
            </p>
          </div>
          <button
            id="btn-close-help"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
              <FileText className="w-4 h-4 text-blue-600" />
              1. Tạo Bài Đăng Facebook (Văn Bản)
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>Thu hút chú ý mạnh mẽ ngay trong 3 dòng đầu (Stop the scroll).</li>
              <li>Áp dụng các công thức kinh điển: <b>AIDA</b> (Attention-Interest-Desire-Action), <b>PAS</b> (Problem-Agitate-Solution), hoặc <b>Storytelling</b>.</li>
              <li>Lời kêu gọi hành động (CTA) rõ ràng, thôi thúc khách hàng inbox hoặc bấm link.</li>
              <li>Chèn 3-5 hashtag tối ưu cho thuật toán tìm kiếm của Facebook.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 space-y-1.5">
            <h4 className="font-bold text-violet-900 flex items-center gap-1.5 text-sm">
              <ImageIcon className="w-4 h-4 text-violet-600" />
              2. Tạo Câu Lệnh Hình Ảnh & Kịch Bản Video
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li><b>Hình ảnh:</b> Prompt chi tiết bằng tiếng Anh (dành cho Midjourney, DALL-E) kèm bối cảnh, ánh sáng, phong cách nghệ thuật và tỷ lệ khung hình (<code className="bg-violet-100 px-1 py-0.5 rounded text-violet-900">--ar 1:1</code> hoặc <code className="bg-violet-100 px-1 py-0.5 rounded text-violet-900">--ar 16:9</code>).</li>
              <li><b>Video ngắn (15-30 giây):</b> Phân cảnh theo từng mốc giây (0-3s, 3-10s, 10-15s), gồm phần <i>Visual (Hình ảnh)</i> và <i>Audio (m thanh / Lời thoại)</i>.</li>
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

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
