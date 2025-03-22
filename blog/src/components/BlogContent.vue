<template>
  <div class="post-container"> 
    <div v-html="compiledMarkdown"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const props = defineProps({
  path: String,
});

const modules = import.meta.glob('/src/posts/**/*.md', { query: '?raw', import: 'default', eager: true });

const normalizedPath = computed(() => {
  let path = props.path;
  if (!path.startsWith('/src')) {
    path = '/src' + path;
  }
  return path.endsWith('.md') ? path : `${path}.md`;
});

const markdownContent = ref(modules[normalizedPath.value] || '文件未找到');

// 监听 normalizedPath 的变化
watch(normalizedPath, (newPath) => {
  markdownContent.value = modules[newPath] || '文件未找到';
});

const compiledMarkdown = computed(() => md.render(markdownContent.value));
</script>

<style scoped>
.post-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif; /* 使用更现代的字体 */
  line-height: 1.6; /* 增加行距，提升可读性 */
  color: #333; /* 柔和的文本颜色 */
}

/* 标题样式 */
.post-container :deep(h1),
.post-container :deep(h2),
.post-container :deep(h3),
.post-container :deep(h4),
.post-container :deep(h5),
.post-container :deep(h6) {
  margin: 1.5em 0 0.5em;
  color: #2e343b;
  font-weight: 600;
}

.post-container :deep(h1){
  font-size: 2.5em;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3em;
}

.post-container :deep(h2) {
  font-size: 2em;
  border-bottom: 1px solid #eee;
}

.post-container :deep(h3) {
  font-size: 1.5em;
}

.post-container :deep(h4),
.post-container :deep(h5),
.post-container :deep(h6) {
  font-size: 1.2em;
}

/* 段落样式 */
.post-container :deep(p){
  margin: 1em 0;
  text-align: justify; /* 两端对齐，提升专业感 */
}

/* 列表样式 */
.post-container :deep(ul ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.post-container :deep(ul li){
  list-style-type: disc; /* 圆点列表 */
}

.post-container :deep(ol li){
  list-style-type: decimal; /* 数字列表 */
}

/* 代码块样式 */
.post-container :deep(pre) {
  background: #f5f5f5; /* 浅灰背景 */
  padding: 1em;
  border-radius: 5px; /* 圆角 */
  overflow-x: auto; /* 横向滚动 */
  font-family: 'Courier New', monospace; /* 等宽字体 */
}

.post-container :deep(code) {
  background: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* 行内代码 */
.post-container :deep(p code) {
  color: #d63200; /* 代码颜色 */
}

/* 引用样式 */
.post-container :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3498db; /* 蓝色左侧边框 */
  background: #f9f9f9; /* 浅背景 */
  color: #555;
}

/* 链接样式 */
.post-container :deep(a) {
  color: #3498db;
  text-decoration: none; /* 移除下划线 */
  transition: color 0.3s; /* 平滑过渡 */
}

.post-container :deep(a:hover) {
  color: #2980b9;
  text-decoration: underline; /* 悬停时添加下划线 */
}

/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse; /* 合并边框 */
  margin: 1em 0;
}

th, td {
  padding: 0.8em;
  border: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  font-weight: bold;
}

tr:nth-child(even) {
  background: #fafafa; /* 斑马纹效果 */
}
</style>