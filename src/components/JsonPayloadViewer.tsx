import { useState } from 'react';
import { Copy, Check, Download, Send, CheckCircle2, Code2, RefreshCw } from 'lucide-react';
import { FacebookJsonPayload, DispatchStatus } from '../types';

interface JsonPayloadViewerProps {
  jsonData: FacebookJsonPayload;
}

export default function JsonPayloadViewer({ jsonData }: JsonPayloadViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchStatus | null>(null);

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facebook-post-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSimulateDispatch = async () => {
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const response = await fetch('/api/dispatch-facebook-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postData: jsonData }),
      });
      const data = await response.json();
      setDispatchResult({
        success: true,
        message: data.message,
        postId: data.post_id,
        pageId: data.page_id,
        scheduledTime: data.scheduled_time,
        timestamp: data.timestamp,
      });
    } catch (err: any) {
      setDispatchResult({
        success: false,
        message: 'Lỗi mô phỏng kết nối API: ' + (err?.message || 'Không thể gửi'),
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div id="json-automation-container" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 sm:p-6 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-600" />
              Mục 3: ⚙️ Cấu Trúc JSON (Dữ Liệu API Tự Động Hóa)
            </h3>
            <p className="text-[11px] text-slate-500">
              Payload chuẩn xác dùng cho Facebook Graph API, Zapier, n8n, Make hoặc Webhook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-copy-json"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Đã sao chép JSON!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép JSON</span>
              </>
            )}
          </button>

          <button
            id="btn-download-json"
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Tải .json</span>
          </button>

          <button
            id="btn-simulate-dispatch"
            type="button"
            disabled={isDispatching}
            onClick={handleSimulateDispatch}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs disabled:opacity-50 transition-colors"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Test API Webhook</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dispatch simulation notification if active */}
      {dispatchResult && (
        <div
          id="dispatch-simulation-alert"
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            dispatchResult.success
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-bold">{dispatchResult.message}</p>
            {dispatchResult.postId && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-emerald-800">
                <span>
                  Post ID: <code className="font-mono font-semibold">{dispatchResult.postId}</code>
                </span>
                <span>Lịch đăng: {dispatchResult.scheduledTime}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* JSON Code Window */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-inner text-slate-100">
        <div className="px-4 py-2 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <span>payload.json</span>
          </div>
          <span className="text-emerald-400 font-sans font-semibold text-[10px]">
            ✓ JSON Valid Format
          </span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[360px] font-mono text-xs leading-relaxed">
          <pre className="text-emerald-300 whitespace-pre-wrap selection:bg-emerald-800 selection:text-white">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
