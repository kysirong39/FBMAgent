import { Trash2, ExternalLink, Calendar, X, Layers } from 'lucide-react';
import { CampaignResult } from '../types';

interface CampaignHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: CampaignResult[];
  onSelect: (campaign: CampaignResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function CampaignHistory({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClearAll,
}: CampaignHistoryProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="history-modal"
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">
              Lịch Sử Các Chiến Dịch Đã Tạo ({history.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="btn-clear-all-history"
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors"
              >
                Xóa tất cả
              </button>
            )}
            <button
              id="btn-close-history"
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Chưa có chiến dịch nào được lưu.</p>
              <p className="text-xs text-slate-500 mt-1">
                Các bài viết và prompt bạn tạo sẽ tự động được lưu tại đây.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {item.input.productName || 'Chiến dịch không tên'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {item.input.copywritingFormula || 'AIDA'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {item.facebookPost.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở xem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
