<!-- src/components/FileTree.vue -->
<template>
    <div class="file-tree">
        <ul class="file-list">
            <li v-for="(item, key) in items" :key="key" :class="{ 'folder': item.isFolder }">
                <template v-if="item.isFolder">
                    <span @click="toggleFolder(key)" class="folder-name">
                        {{ key }} {{ expanded[key] ? '▼' : '▶' }}
                    </span>
                    <file-tree v-if="expanded[key]" :items="item.files" class="sub-list" @select-file="selectFile" />
                </template>
                <template v-else>
                    <a @click="selectFile(item.path)" class="file-name">{{ key }}</a>
                </template>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { ref} from 'vue';

defineProps({
    items: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['select-file']);
const expanded = ref({});

const toggleFolder = (key) => {//展开文件夹
    expanded.value[key] = !expanded.value[key];
};

const selectFile = (filePath) => {//选择文件通知父组件
    filePath = filePath.replace('..', '');
    emit('select-file', filePath);
};
</script>

<style scoped>

.file-tree {
    position: sticky;
    top: 10vh;
    overflow: auto;
    max-height: 90vh;

}

.file-list {
    list-style: none;
}

.folder {
    margin: 10px 0;
}

.folder-name {
    cursor: pointer;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
}

.sub-list {
    list-style: none;
    padding-left: 20px;
}

.file-name {
    cursor: pointer;
    color: #888;
    text-decoration: none;
}

.file-name:hover {
    text-decoration: underline;
}

li {
    margin: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* 不换行*/
}

ul {
    padding-left: 0;
}
</style>