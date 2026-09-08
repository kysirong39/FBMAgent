/**
 * Utility functions for cleaning and formatting Markdown text
 */

export function cleanMarkdownAsterisks(text: string): string {
  if (!text) return '';
  return text
    // Replace bold **text** or __text__ with text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // Replace bullet points starting with * or - with •
    .replace(/^[\*\-]\s+/gm, '• ')
    // Replace italic *text* with text (ensure not matching emojis or standalone)
    .replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '$1')
    // Replace markdown links [label](url) with label (url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    // Replace headers #, ##, ### with clean text
    .replace(/^#{1,6}\s+/gm, '');
}

export function prepareMarkdownWithBreaks(text: string): string {
  if (!text) return '';
  // Ensures single line breaks are treated as hard breaks in markdown
  return text.split('\n').join('  \n');
}
