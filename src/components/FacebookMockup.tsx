import { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Globe, ThumbsUp, MessageCircle, Share2, MoreHorizontal, ShieldCheck, Edit3, Image as ImageIcon, ExternalLink, Sparkles, FileText, Code2 } from 'lucide-react';

interface FacebookMockupProps {
  postText: string;
  imagePrompt: string;
  brandName?: string;
  productUrl?: string;
  onUpdatePostText?: (newText: string) => void;
}

// Utility to clean markdown asterisks and symbols for Facebook posting
export function cleanTextForFacebook(text: string): string {
  if (!text) return '';
  return text
    // Replace bold **text** or __text__ with text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // Replace bullet points starting with * or - with •
    .replace(/^[\*\-]\s+/gm, '• ')
    // Replace italic *text* with text
    .replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '$1')
    // Replace markdown links [label](url) with label (url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    // Replace headers #, ##, ### with clean text
    .replace(/^#{1,6}\s+/gm, '');
}

export default function FacebookMockup({
  postText,
  imagePrompt,
  brandName = 'Thương Hiệu Của Bạn',
  productUrl,
  onUpdatePostText,
}: FacebookMockupProps) {
  const [copiedType, setCopiedType] = useState<'clean' | 'markdown' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(postText);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'markdown' | 'clean' | 'raw'>('markdown');
  const [likeCount, setLikeCount] = useState(248);
  const [isLiked, setIsLiked] = useState(false);
  const [activeReaction, setActiveReaction] = useState<'like' | 'love' | 'care' | null>(null);

  // Sync if postText changes
  if (!isEditing && editableText !== postText) {
    setEditableText(postText);
  }

  const handleCopyClean = () => {
    const clean = cleanTextForFacebook(editableText);
    navigator.clipboard.writeText(clean);
    setCopiedType('clean');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(editableText);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdatePostText) {
      onUpdatePostText(editableText);
    }
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setActiveReaction(null);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setActiveReaction('like');
      setLikeCount((prev) => prev + 1);
    }
  };

  // Truncate logic for realistic Facebook "Xem thêm"
  const lines = editableText.split('\n');
  const needsTruncation = lines.length > 7;
  const currentText = !isExpanded && needsTruncation ? lines.slice(0, 7).join('\n') : editableText;

  // Prepare text for react-markdown so line breaks are preserved
  const markdownText = currentText.split('\n').join('  \n');

  return (
    <div id="facebook-post-preview-container" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Mục 1: 📝 Bài Viết Facebook
          </span>
        </div>

        {/* View Mode Switcher and Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-medium border border-slate-300/60">
            <button
              id="view-mode-markdown"
              type="button"
              onClick={() => setViewMode('markdown')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'markdown'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Trình bày Markdown trực quan, không có dấu hoa thị *"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Markdown trực quan</span>
            </button>

            <button
              id="view-mode-clean"
              type="button"
              onClick={() => setViewMode('clean')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'clean'
                  ? 'bg-white text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Văn bản sạch cho Facebook, đã lọc bỏ các dấu *"
            >
              <FileText className="w-3 h-3 text-emerald-600" />
              <span>Văn bản sạch (Lọc *)</span>
            </button>

            <button
              id="view-mode-raw"
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                viewMode === 'raw'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mã nguồn thô"
            >
              <Code2 className="w-3 h-3 text-slate-500" />
              <span>Mã thô</span>
            </button>
          </div>

          <button
            id="btn-toggle-edit-post"
            type="button"
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else setIsEditing(true);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Lưu bài' : 'Sửa'}</span>
          </button>

          {/* Copy Clean (No Asterisks) for Facebook */}
          <button
            id="btn-copy-facebook-post"
            type="button"
            onClick={handleCopyClean}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
            title="Sao chép bài viết sạch cho Facebook (đã lọc sạch dấu *)"
          >
            {copiedType === 'clean' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã sao chép (Lọc *)!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép đăng FB</span>
              </>
            )}
          </button>

          {/* Copy Markdown */}
          <button
            id="btn-copy-markdown-post"
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            title="Sao chép dạng Markdown nguyên bản"
          >
            {copiedType === 'markdown' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã sao chép MD!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy MD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Facebook Post Card */}
      <div className="p-4 sm:p-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-inner ring-2 ring-blue-100">
                {brandName.charAt(0) || 'F'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 leading-none hover:underline cursor-pointer">
                    {brandName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                  <span>Vừa xong</span>
                  <span>·</span>
                  <Globe className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              id="btn-fb-post-menu"
              type="button"
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              title="Tùy chọn bài viết"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  id="edit-post-textarea"
                  rows={9}
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full p-2.5 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 leading-relaxed font-sans"
                  placeholder="Nhập nội dung bài viết..."
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Hỗ trợ định dạng Markdown: **in đậm**, *nghiêng*, - danh sách</span>
                  <button
                    type="button"
                    onClick={() => setEditableText(cleanTextForFacebook(editableText))}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Dọn sạch các dấu * ngay
                  </button>
                </div>
              </div>
            ) : viewMode === 'markdown' ? (
              <div className="text-sm text-slate-900 leading-relaxed font-sans break-words space-y-1.5">
                <Markdown
                  components={{
                    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-slate-950">{children}</strong>,
                    em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                    ul: ({ children }) => <ul className="my-2 space-y-1 list-disc pl-5 text-slate-800">{children}</ul>,
                    ol: ({ children }) => <ol className="my-2 space-y-1 list-decimal pl-5 text-slate-800">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    h1: ({ children }) => <h3 className="font-extrabold text-base text-slate-900 mt-3 mb-1">{children}</h3>,
                    h2: ({ children }) => <h4 className="font-bold text-sm text-slate-900 mt-2.5 mb-1">{children}</h4>,
                    h3: ({ children }) => <h5 className="font-bold text-sm text-slate-900 mt-2 mb-1">{children}</h5>,
                    hr: () => <hr className="my-3 border-slate-200" />,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium break-all"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-3 border-blue-500 pl-3 my-2 text-slate-700 bg-blue-50/50 py-1 rounded-r text-xs">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {markdownText}
                </Markdown>

                {!isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-more"
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="text-slate-500 hover:underline font-semibold cursor-pointer text-xs"
                  >
                    ...Xem thêm
                  </button>
                )}
                {isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-less"
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="block text-slate-500 hover:underline font-semibold cursor-pointer text-xs mt-2"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            ) : viewMode === 'clean' ? (
              <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap font-sans break-words">
                {cleanTextForFacebook(currentText)}
                {!isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-more-clean"
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="ml-1 text-slate-500 hover:underline font-semibold cursor-pointer text-xs"
                  >
                    ...Xem thêm
                  </button>
                )}
                {isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-less-clean"
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="block text-slate-500 hover:underline font-semibold cursor-pointer text-xs mt-2"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-mono break-words bg-slate-50 p-3 rounded-lg border border-slate-200">
                {currentText}
                {!isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-more-raw"
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="ml-1 text-blue-600 hover:underline font-semibold cursor-pointer text-xs"
                  >
                    ...Xem thêm
                  </button>
                )}
                {isExpanded && needsTruncation && (
                  <button
                    id="btn-fb-read-less-raw"
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="block text-blue-600 hover:underline font-semibold cursor-pointer text-xs mt-2"
                  >
                    Thu gọn
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Media Illustration Box (Visual Representation based on the media prompt) */}
          <div className="border-t border-b border-slate-100 bg-slate-900 relative overflow-hidden group min-h-[220px] flex items-center justify-center">
            {/* Ambient visual background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 opacity-90"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 p-5 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                Minh Họa Ảnh Chiến Dịch Facebook (1:1 / 16:9)
              </span>
              <p className="text-xs text-slate-200 line-clamp-3 font-mono bg-black/40 p-2.5 rounded-lg border border-white/10 text-left">
                {imagePrompt || 'Chưa có prompt hình ảnh...'}
              </p>
              <p className="text-[10px] text-slate-400 mt-2">
                * Dùng prompt ở Mục 2 trên Midjourney / DALL-E để tải ảnh thật và đăng kèm
              </p>
            </div>
          </div>

          {/* Facebook Link Preview Card (if productUrl exists) */}
          {productUrl && (
            <a
              id="fb-product-link-card"
              href={productUrl.startsWith('http') ? productUrl : `https://${productUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-b border-slate-100 bg-slate-50/80 hover:bg-slate-100/90 px-4 py-2.5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold truncate flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                    {(() => {
                      try {
                        return new URL(productUrl.startsWith('http') ? productUrl : `https://${productUrl}`).hostname;
                      } catch {
                        return 'Liên kết sản phẩm';
                      }
                    })()}
                  </p>
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    Xem thông tin sản phẩm & đặt mua chính hãng
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-700 bg-slate-200/90 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1 rounded border border-slate-300 group-hover:border-blue-600 transition-all shrink-0">
                  Xem ngay
                </span>
              </div>
            </a>
          )}

          {/* Engagement Count Bar */}
          <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                  👍
                </span>
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white">
                  ❤️
                </span>
              </div>
              <span className="font-medium">{likeCount} lượt thích</span>
            </div>
            <div className="flex items-center gap-3">
              <span>38 bình luận</span>
              <span>12 lượt chia sẻ</span>
            </div>
          </div>

          {/* Interactive Facebook Buttons */}
          <div className="px-2 py-1 flex items-center justify-around text-slate-600 text-xs font-semibold">
            <button
              id="btn-fb-like-action"
              type="button"
              onClick={handleToggleLike}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                isLiked ? 'text-blue-600 font-bold' : ''
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
            </button>

            <button
              id="btn-fb-comment-action"
              type="button"
              className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bình luận</span>
            </button>

            <button
              id="btn-fb-share-action"
              type="button"
              className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
