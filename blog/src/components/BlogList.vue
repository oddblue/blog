<template>
    <div class="file-list">
        <div v-for="file in files" :key="file.path" @click="selectFile(file.path)" class="file-item">
            {{ file.name }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

defineProps({
    folder: String, // 接收父组件传递的文件夹名
});
const emit = defineEmits(['file-selected']);

const files = ref([]);
const modules = import.meta.glob('../posts/*/*.md',{ query: '?raw', import: 'default' });

// 根据文件夹名过滤文件
watch(() => props.folder, (newFolder) => {
    files.value = Object.entries(modules)
        .filter(([path]) => path.includes(`/${newFolder}/`))
        .map(([path]) => ({
            path,
            name: path.split('/').pop().replace('.md', ''), // 提取文件名
        }));
}, { immediate: true });

function selectFile(path) {
    emit('file-selected', path); // 通知父组件显示文件内容
}
</script>

<style scoped>
.file-list {
    padding: 20px;
}

.file-item {
    cursor: pointer;
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.file-item:hover {
    background: #f0f0f0;
}
</style>