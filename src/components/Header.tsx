import { Sparkles, Facebook, History, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  historyCount: number;
}

export default function Header({ onOpenHistory, onOpenHelp, historyCount }: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Facebook className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Trợ Lý Marketing Facebook AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Thể Thao & Dụng Cụ Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Chuyên sâu Thể Thao, Máy Tập & Dụng Cụ (Pickleball, Cầu Lông, Bóng Đá, Gym, Bơi Lội...) • Chuẩn JSON API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Hệ thống sẵn sàng</span>
          </div>

          <button
            id="btn-open-history"
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors relative"
            title="Lịch sử các chiến dịch đã tạo"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Lịch sử</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="btn-open-help"
            type="button"
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            title="Hướng dẫn công thức & quy chuẩn"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Quy chuẩn</span>
          </button>
        </div>
      </div>
    </header>
  );
}
