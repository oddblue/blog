<template>
  <div class="content-container">
    <file-tree :items="fileTree" @select-file="handleSelectFile" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FileTree from './FileTree.vue';
const props = defineProps({
  currentpath: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['select-file']);
const expanded = ref({});
const allFiles = import.meta.glob('../posts/**/*.md', { query: '?raw', import: 'default', eager: true });

const parentPath = computed(() => {
  const parts = props.currentpath.split('/').filter(Boolean);//切割传递过来的路径
  const postsIndex = parts.indexOf('posts');//定位起始路径
  if (postsIndex !== -1 && postsIndex + 1 < parts.length) {//判断是否有子目录
    return `/posts/${parts[postsIndex + 1]}/`;
  }
  return '/posts';
});

// 构建文件树，支持多层嵌套
const fileTree = computed(() => {
  const tree = {};
  const normalizedBasePath = `..${parentPath.value}`;

  for (const [filePath] of Object.entries(allFiles)) {//遍历所有文件，查找符合条件的文件
    if (!filePath.startsWith(normalizedBasePath)) continue;//判断是否符合条件

    const relativePath = filePath.replace(normalizedBasePath, '');//获取相对路径,去除起始路径

    if (!relativePath) continue;//判断是否有相对路径

    const parts = relativePath.split('/');//切割相对路径，返回数组
    let currentLevel = tree; // 当前层级

    // 处理多层目录
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;//判断是否是最后一级
      const name = isLastPart ? part.replace('.md', '') : part;//如果是最后一级，去除.md后缀

      if (isLastPart) {
        // 最后一级是md文件
        currentLevel[name] = {
          path: filePath,
          isFolder: false
        };
      } else {
        // 中间层是文件夹
        currentLevel[name] = currentLevel[name] || {//如果没有当前层级，创建一个
          files: {},
          isFolder: true
        };
        currentLevel = currentLevel[name].files;
      }
    }
  }
  // 默认展开当前路径相关的目录
  const currentParts = props.currentpath.split('/').filter(Boolean);
  const currentSecondLevel = currentParts[2];
  if (tree[currentSecondLevel]?.isFolder && !expanded.value[currentSecondLevel]) {//判断是否是文件夹,并且它当前未展开
    //？.（可选链操作符）判断是否存在,使用？.可以避免报错
    expanded.value[currentSecondLevel] = true;
  }
  return tree;
});

// 定义 handleSelectFile 处理函数
const handleSelectFile = (filePath) => {
  filePath = filePath.replace('..', '');
  emit('select-file', filePath);
};
</script>

<style scoped>

.content-container {
  padding-top: 8vh;
  padding-left: 10vw;
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  font-size: 1em;
  color: #333;
}
</style>
