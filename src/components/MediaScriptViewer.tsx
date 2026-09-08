import { useState } from 'react';
import { Copy, Check, Video, Clapperboard, Sparkles } from 'lucide-react';

interface MediaScriptViewerProps {
  imagePrompt: string;
  videoScript: string;
}

export default function MediaScriptViewer({ imagePrompt, videoScript }: MediaScriptViewerProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(imagePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(videoScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Parse video script lines for timeline rendering if formatted with "Giây"
  const scriptLines = videoScript
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div id="media-and-video-container" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6 p-5 sm:p-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse"></span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Mục 2: 🎨 Gợi Ý Hình Ảnh / Video (Đa Phương Tiện)
          </h3>
        </div>
      </div>

      {/* Part A: Image Generation Prompt */}
      <div id="image-prompt-card" className="bg-slate-50/80 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Câu lệnh tạo ảnh (Bằng tiếng Anh)
              </h4>
              <p className="text-[11px] text-slate-500">
                Tối ưu cho Midjourney v6, DALL-E 3, Gemini Imagen với bối cảnh, ánh sáng và góc chụp
              </p>
            </div>
          </div>

          <button
            id="btn-copy-image-prompt"
            type="button"
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition-colors w-fit"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép Prompt</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 selection:bg-violet-500 selection:text-white">
          <code>{imagePrompt || '// Đang chờ sinh câu lệnh tạo ảnh...'}</code>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
            Midjourney v6
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
            DALL-E 3
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
            Studio Lighting
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono">
            --ar 1:1 / --ar 16:9
          </span>
        </div>
      </div>

      {/* Part B: Short Video Script */}
      <div id="video-script-card" className="bg-slate-50/80 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Clapperboard className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Kịch bản Video ngắn (15 - 30 giây)
              </h4>
              <p className="text-[11px] text-slate-500">
                Phân cảnh chi tiết gồm Hình ảnh (Visual) và m thanh / Lời thoại (Audio)
              </p>
            </div>
          </div>

          <button
            id="btn-copy-video-script"
            type="button"
            onClick={handleCopyScript}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors w-fit"
          >
            {copiedScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép Kịch bản</span>
              </>
            )}
          </button>
        </div>

        {scriptLines.length > 0 ? (
          <div className="space-y-2.5">
            {scriptLines.map((line, idx) => {
              const isTimeHeader = line.includes('Giây') || line.startsWith('- Giây');
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    isTimeHeader
                      ? 'bg-white border-blue-200 shadow-2xs'
                      : 'bg-white/60 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="p-1 rounded bg-blue-50 text-blue-600 mt-0.5 shrink-0">
                      <Video className="w-3 h-3" />
                    </span>
                    <div className="font-sans whitespace-pre-wrap">{line}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-500 italic">
            Chưa có kịch bản video. Hãy nhập thông tin sản phẩm và nhấn nút tạo.
          </div>
        )}
      </div>
    </div>
  );
}
