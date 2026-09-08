import { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, FileText, Sparkles, Code2, Layers } from 'lucide-react';
import { cleanMarkdownAsterisks, prepareMarkdownWithBreaks } from '../data/formatUtils';

interface RawOutputViewerProps {
  rawText: string;
}

export default function RawOutputViewer({ rawText }: RawOutputViewerProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copiedType, setCopiedType] = useState<'raw' | 'clean' | null>(null);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawText);
    setCopiedType('raw');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyClean = () => {
    navigator.clipboard.writeText(cleanMarkdownAsterisks(rawText));
    setCopiedType('clean');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div id="raw-markdown-output-container" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Định Dạng Markdown & Văn Bản Xuất Bản (3 Mục Chuẩn)
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200">
            <button
              id="raw-view-rendered"
              type="button"
              onClick={() => setViewMode('rendered')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === 'rendered'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Trình bày Markdown (Đẹp)</span>
            </button>

            <button
              id="raw-view-source"
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === 'raw'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Mã nguồn thô</span>
            </button>
          </div>

          {/* Copy Clean (No Asterisks) */}
          <button
            id="btn-copy-clean-raw"
            type="button"
            onClick={handleCopyClean}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title="Sao chép toàn bộ văn bản đã lọc bỏ các dấu hoa thị *"
          >
            {copiedType === 'clean' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã chép (Lọc *)!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sao chép (Lọc *)</span>
              </>
            )}
          </button>

          {/* Copy Raw Markdown */}
          <button
            id="btn-copy-raw-markdown"
            type="button"
            onClick={handleCopyRaw}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {copiedType === 'raw' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Toàn bộ nội dung chiến dịch được định dạng Markdown chuẩn mực: Tiêu đề in đậm sắc nét, danh sách gạch đầu dòng rõ ràng, không còn dấu hoa thị (*) dư thừa làm rối mắt.
      </p>

      {viewMode === 'rendered' ? (
        <div
          id="markdown-rendered-view"
          className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 text-slate-900 text-sm leading-relaxed max-h-[600px] overflow-y-auto space-y-4"
        >
          {rawText ? (
            <Markdown
              components={{
                h1: ({ children }) => (
                  <div className="border-b border-slate-200 pb-2 mb-3 mt-4">
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      {children}
                    </h2>
                  </div>
                ),
                h2: ({ children }) => (
                  <div className="border-b border-slate-200 pb-2 mb-3 mt-4">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      {children}
                    </h3>
                  </div>
                ),
                h3: ({ children }) => (
                  <div className="bg-slate-200/60 text-slate-900 px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider my-3 border border-slate-300/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>{children}</span>
                  </div>
                ),
                p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-800">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-bold text-slate-950 bg-amber-50/50 px-0.5 rounded">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                ul: ({ children }) => <ul className="my-2 space-y-1 list-disc pl-5 text-slate-800">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 space-y-1 list-decimal pl-5 text-slate-800">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                hr: () => <hr className="my-4 border-slate-200" />,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-blue-500 pl-3 my-2 text-slate-700 bg-blue-50/50 py-1.5 rounded-r">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                  if (isBlock) {
                    return (
                      <div className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 text-slate-100">
                        <div className="px-3 py-1.5 bg-slate-950 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                          <span>JSON / Code Snippet</span>
                          <span className="text-[10px] uppercase">Dữ liệu API</span>
                        </div>
                        <pre className="p-3.5 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre selection:bg-blue-600 selection:text-white">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs font-mono font-semibold">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {prepareMarkdownWithBreaks(rawText)}
            </Markdown>
          ) : (
            <div className="text-slate-400 text-xs italic py-6 text-center">
              Chưa có dữ liệu chiến dịch. Hãy cấu hình và nhấn &ldquo;Khởi Tạo Chiến Dịch&rdquo;.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-[550px] overflow-y-auto whitespace-pre-wrap border border-slate-800 selection:bg-blue-600 selection:text-white">
          {rawText || '// Hãy gửi thông tin chiến dịch để hiển thị định dạng đầu ra.'}
        </div>
      )}
    </div>
  );
}
