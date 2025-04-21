<template>
  <div class="blog-container" >
    <div class="mdcontent" >
      <div v-html="compiledMarkdown" :key="normalizedPath"></div>
    </div>
    <div class="mdlist">
      <BlogList :markdowncontent="markdownContent"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted} from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import BlogList from '../components/BlogList.vue';

const md = new MarkdownIt({
  highlight: (code, lang) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'text';
    const highlighted = language === 'text' ? md.utils.escapeHtml(code) : hljs.highlight(code, { language }).value;
    return `
    <div class="code-container">
      <span class="language-label">${language}</span>
      <button class="language-button" title="复制代码">复制</button>
      <pre class="hljs"><code class="${language}">${highlighted}</code></pre>
    </div>
    `;
  },
});

const props = defineProps({
  path: String,
});


const modules = import.meta.glob('/src/posts/**/*.md', { query: '?raw', import: 'default', eager: true });

const normalizedPath = computed(() => {
  let path = props.path;
  if (!path.startsWith('/src')) path = '/src' + path;
  return path.endsWith('.md') ? path : `${path}.md`;
});

const markdownContent = ref(modules[normalizedPath.value] || '文件未找到');


watch(normalizedPath, async (newPath) => {
  markdownContent.value = modules[newPath] || '文件未找到';
  await nextTick();
  window.scrollTo(0, 0); // 重置窗口滚动
});

const compiledMarkdown = computed(() => {
  const tokens = md.parse(markdownContent.value, {});
  let html = md.render(markdownContent.value);
  tokens.forEach((token) => {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace('h', ''));
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken && nextToken.type === 'inline') {
        const text = nextToken.content;
        let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '');
        html = html.replace(
          `<${token.tag}>${text}</${token.tag}>`,
          `<${token.tag} id="${id}">${text}</${token.tag}>`
        );
      }
    }
  });
  return html;
});

onMounted(() => {
  const codeBlocks = document.querySelectorAll('.code-container'); // 修正选择器
  codeBlocks.forEach((wrapper) => {
    const button = wrapper.querySelector('button'); // 修正选择器
    const code = wrapper.querySelector('code').textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = '已复制';
        setTimeout(() => button.textContent = '复制', 2000);
      } catch (err) {
        console.error('复制失败:', err);
        button.textContent = '复制失败';
      }
    });
  });
});
</script>


<style scoped>
.blog-container {
  max-width: 70vw;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  /* 使用更现代的字体 */
  line-height: 1.6;
  /* 增加行距，提升可读性 */
  color: #333;
  /* 柔和的文本颜色 */
  display: flex;
  flex-direction: row;
  gap: 45px;
  

}

.mdcontent {
  width: 72%;
  margin-top: 6vh;
}

.mdlist {
  width: 20%;
  
}


/* 标题样式 */
.mdcontent :deep(h1),
.mdcontent :deep(h2),
.mdcontent :deep(h3),
.mdcontent :deep(h4),
.mdcontent :deep(h5),
.mdcontent :deep(h6) {
  margin: 1.5em 0 0.5em;
  color: #2e343b;
  font-weight: 600;
}

.mdcontent :deep(h1) {
  font-size: 1.8em;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3em;
}

.mdcontent :deep(h2) {
  font-size: 1.3em;
  border-bottom: 1px solid #eee;
}

.mdcontent :deep(h3) {
  font-size: 1.2em;
}

.mdcontent :deep(h4),
.mdcontent :deep(h5),
.mdcontent :deep(h6) {
  font-size: 1.1em;
}

/* 段落样式 */
.mdcontent :deep(p) {
  margin: 1em 0;
  text-align: justify;
  font-size: 1em;
  /* 两端对齐，提升专业感 */
}

/* 列表样式 */
.mdcontent :deep(ul ol) {
  margin: 1em 0;
  padding-left: 2em;
  font-size: 1em;
  line-height: 1.8;
}

.mdcontent :deep(ul li) {
  list-style-type: disc;
  /* 圆点列表 */
  font-size: 1em;
  line-height: 1.8;
  /* 两端对齐，提升专业感 */
}

.mdcontent :deep(ol li) {
  list-style-type: decimal;
  /* 数字列表 */
  font-size: 1em;
  line-height: 1.8;
}

.mdcontent :deep(pre code) {
  font-size: 0.95em;
  font-family: Consolas;


}

.mdcontent :deep(code[class*="language-"]) {
  white-space: normal;
  position: relative;
  /* 相对定位 */
}

.mdcontent :deep(.code-container) {
  display: flex;
  background: #f0eded;
  border-radius: 20px;
  padding: 10px 15px 10px 15px;
  line-height: 1.6;
  overflow: auto;
}

/* 悬停时隐藏 span */
.mdcontent :deep(.code-container:hover .language-button) {
  display: none;
  /* 悬停时隐藏 span */
}

.mdcontent :deep(.code-container:hover .language-button) {
  display: inline-block;
  /* 悬停时显示 button */
}

.mdcontent :deep(.language-label) {
  font-size: 1em;
  position: absolute;
  top: 10px;
  right: 10px;
}

.mdcontent :deep(.language-button) {
  font-size: 1em;
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
  /* 默认隐藏 */
}

.mdcontent :deep(.hljs) {
  margin-top: 25px;
}

.mdcontent :deep(pre) {
  font-size: 1em;
  font-family: Consolas;
}

/* 行内代码 */
.mdcontent :deep(p code) {
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 1em;
  font-family: 'Arial', sans-serif;
  /* 使用更现代的字体 */
  color: #000000;
  background: #f0f0f0;
  color: #d63200;
  /* 代码颜色 */
}

/* 引用样式 */
.mdcontent :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3498db;
  /* 蓝色左侧边框 */
  background: #f9f9f9;
  /* 浅背景 */
  color: #555;
}

/* 链接样式 */
.mdcontent :deep(a) {
  color: #3498db;
  text-decoration: none;
  /* 移除下划线 */
  transition: color 0.3s;
  /* 平滑过渡 */
}

.mdcontent :deep(a:hover) {
  color: #2980b9;
  text-decoration: underline;
  /* 悬停时添加下划线 */
}

/* 表格样式 */
.mdcontent :deep(table) {
  width: 100%;
  border-collapse: collapse;
  /* 合并边框 */
  margin: 1em 0;
}

/* 表格标题和单元格样式 */
.mdcontent :deep(th),
.mdcontent :deep(td) {
  padding: 0.8em;
  border: 1px solid #ddd;
}

.mdcontent :deep(th) {
  background: #f5f5f5;
  font-weight: bold;
}

.mdcontent :deep(tr:nth-child(even)) {
  background: #fafafa;
  /* 斑马纹效果 */
}

/* 图片样式 */
.mdcontent :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

.mdcontent :deep(hr) {
  border: none;
  /* 移除默认样式 */
  border-top: 2px solid rgba(112, 129, 112, 0.1);
  /* 红色，50% 透明 */
}
</style>