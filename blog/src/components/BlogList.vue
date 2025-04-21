<template>
  <div class="toc-container">
    <div class="toc">
      <h3>目录</h3>
      <ul class="toc-list">
        <li v-for="item in toc" :key="item.id" :class="['level-' + item.level, { active: activeId === item.id }]">
          <a :href="'#' + item.id" @click.prevent="scrollTo(item.id)">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  markdowncontent: {
    type: String,
    required: true,
  },
});

const md = new MarkdownIt({ html: true });

const toc = computed(() => {
  const tokens = md.parse(props.markdowncontent || '', {});
  const tocList = [];
  const seenIds = new Set();

  tokens.forEach((token, index) => {// 遍历所有 token, 找到标题, 生成目录, 并记录已经出现的 id
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.replace('h', ''));
      const nextToken = tokens[index + 1];
      if (nextToken && nextToken.type === 'inline') {
        const text = nextToken.content || `heading-${index}`;
        let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '');
        let uniqueId = id || `heading-${index}`;
        let counter = 1;
        while (seenIds.has(uniqueId)) {// 如果 id 已经存在, 则添加计数器
          uniqueId = `${id}-${counter}`;
          counter++;
        }
        seenIds.add(uniqueId);
        tocList.push({ id: uniqueId, text, level });
      }
    }
  });
  return tocList;
});

// 当前高亮的目录项 ID
const activeId = ref('');

// IntersectionObserver 实例
const observer = ref(null);

// 初始化或更新 IntersectionObserver
const setupObserver = () => {
  // 如果已有 observer，先清理
  if (observer.value) {
    observer.value.disconnect();
  }

  // 创建新的 observer, IntersectionObserver函数自动获取当前视口内元素，当标题元素进入视口时更新高亮, 0.5 表示标题元素一半进入视口时就更新高亮
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {// 当标题元素进入视口时，更新高亮
          activeId.value = entry.target.id;
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }
  );

  // 观察当前页面中的所有标题元素
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    if (heading.id) {
      observer.value.observe(heading);//调用 observe 方法，并传递观察的元素的数组
    } else {
      console.warn('Heading without ID:', heading); // 调试
    }
  });
};

// 首次挂载时初始化 observer
onMounted(() => {
  setupObserver();
});

// 监听 markdowncontent 变化，重新设置 observer
watch(
  () => props.markdowncontent,
  () => {
    // 使用 nextTick 确保 DOM 更新后再重新观察
    nextTick(() => {
      setupObserver();
      // 可选：初始化时设置默认高亮（例如第一个标题）
      const firstHeading = document.querySelector('h1, h2, h3, h4, h5, h6');
      if (firstHeading && firstHeading.id) {
        activeId.value = firstHeading.id;
      }
    });
  }
);

// 组件卸载时清理 observer
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});

// 平滑滚动到指定标题
const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    activeId.value = id; // 点击时手动更新高亮
  }
};

// 引入 nextTick
import { nextTick } from 'vue';
</script>

<style scoped>
.toc-container {
  max-width: 300px;
  font-size: 0.9em;
  width: 100%;
}

.toc {
  position: fixed;
  width: 15vw;
  height: 91vh;
  overflow-x: hidden;
  overflow-y: auto;
  top: 8vh;
  scrollbar-width: none;
  /* Firefox */
}

.toc-list {
  list-style: none;
  padding: 0;
  position: relative;
  /* 为高亮提供定位上下文 */
}

h3 {
  margin-left: 10px;
}

li {
  list-style-type: none;
  font-size: 1em;
  margin-left: 0;
}

.toc-list li.active {
  font-weight: bold;
  border-left: 3px solid #4855de;
}

/* 使用 CSS 变量定义缩进 */
.level-1 {
  padding-left: 10px;
}

.level-2 {
  padding-left: 30px;
}

.level-3 {
  padding-left: 50px;
}

.level-4 {
  padding-left: 70px;
}

.level-5 {
  padding-left: 90px;
}

.level-6 {
  padding-left: 110px;
}

a {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #666;
  cursor: pointer;
  width: 13vw;
}

a:hover {
  text-decoration: none;
}
</style>