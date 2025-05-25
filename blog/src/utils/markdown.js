import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动将 URL 转为链接
  typographer: true, // 启用排版优化
});

// 转换 Markdown 到 HTML 并清理
export function convertMarkdownToHtml(markdownText) {
  try {
    // 转换为 HTML
    const html = md.render(markdownText);
    // 使用 DOMPurify 清理，防止 XSS
    const cleanHtml = DOMPurify.sanitize(html);
    return cleanHtml;
  } catch (error) {
    console.error('Markdown 转换失败:', error);
    return '';
  }
}