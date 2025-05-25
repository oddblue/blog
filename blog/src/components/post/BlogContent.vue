<template>
    <div class="markdown-body" v-html="localNote.content" ref="contentRef"></div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import 'github-markdown-css/github-markdown.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 定义 props
const props = defineProps({
  note: {
    type: Object,
    required: true,
    default: () => ({ content: '' }),
  },
});

// 本地状态
const localNote = ref(props.note);
const contentRef = ref(null); // 容器 DOM 的 ref，改名以更清晰
const anchors = ref([]); // 存储锚点信息 { id: string, text: string, level: number }

// 高亮代码块
const highlightCodeBlocks = async () => {
  if (!contentRef.value) {
    console.warn('Content container not found.');
    return;
  }
  const codeBlocks = contentRef.value.querySelectorAll('pre code'); // 查询所有代码块
  if (codeBlocks.length === 0) {
    console.log('No code blocks found to highlight.');
    return;
  }
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });
};

const emit = defineEmits(['Blog-list']);

// 监听 note 变化
watch(
  () => props.note,
  async (newNote) => {
    if (newNote.content !== localNote.value.content) { // 仅在内容变化时更新
      localNote.value = newNote;
      await nextTick();// 等待 DOM 完全更新

      // 1. 执行代码高亮
      highlightCodeBlocks();
      // 2. 生成锚点
      const newAnchorData = [];

      //获取html内容中的h元素，并生成数组
      const headingElements = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const existingIds = new Set(); // 用于确保生成的ID是唯一的，set变量存储不重复集合

      headingElements.forEach(headingEl => {
        //遍历数组，将h元素的文本内容去除首位空格
        const text = headingEl.textContent?.trim() || '';
        //parseInt将字符串转化为整数（第一个参数获取字符串，第二个参数将字符串解析内容转化数字进制），tagName获取元素标签名(h1元素返回h1),.substring获取字符串指定内容
        const level = parseInt(headingEl.tagName.substring(1), 10);
        let id = headingEl.id; // 检查是否已存在ID

        if (!id) { // 如果标题元素本身没有ID
          id = generateSafeId(text, existingIds);
          //将函数创造的id设置为元素id
          headingEl.id = id; // 将生成的ID设置回DOM元素上
        } else {
          //如果有原始id，则直接使用原始id添加到id集合中
          existingIds.add(id); // 如果已有ID，也加入set以便后续生成时查重
        }
        // 只为有文本的标题创建锚点
        if (text) {
          newAnchorData.push({ id, text, level });
        }
      });
      anchors.value = newAnchorData;
      //console.log(anchors.value)
      emit("Blog-list",anchors)
      
    } else if (!localNote.value.content) {
      anchors.value = []; // 如果内容为空，清空锚点
    }
  },
  { deep: true, immediate: true }, // 立即执行以处理初始加载 immediate: true 确保在组件初始化时也执行一次
);


// 生成唯一的、URL友好的ID，text表示h元素文本内容，existingIdsSet为id变量用于赋值 
const generateSafeId = (text, existingIdsSet) => {
  if (!text) {
    // 如果文本为空，生成一个基于当前已存在ID数量的唯一ID
    let newId = `heading-${existingIdsSet.size}`;
    //如果已经生成了id，通过while循环判断是否存在重复id，并通过循环随机生成新id重新判断，直到生成唯一id
    while (existingIdsSet.has(newId)) {
      newId = `heading-${existingIdsSet.size + Math.random().toString(36).substring(2, 7)}`;
    }
    //添加唯一id到set集合
    existingIdsSet.add(newId);
    return newId;
  }

  let id = text.trim().toLowerCase()
    .replace(/\s+/g, '-') // 替换空格为连字符
    .replace(/[^\w-]+/g, ''); // 移除所有非单词字符（字母、数字、下划线、连字符）

  // 如果处理后ID为空（例如，标题全是特殊符号）
  if (!id) {
    id = `heading-${existingIdsSet.size}`;
  }

  // 确保ID的唯一性
  let counter = 0;
  let originalId = id;
  while (existingIdsSet.has(id)) {
    counter++;
    id = `${originalId}-${counter}`;
  }
  existingIdsSet.add(id);
  return id;
};

</script>