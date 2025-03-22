<template>
    <div class="navbar-container">
        <div class="logo">首页</div>
        <div class="component-container">
            <div class="buttons-container" @mouseleave="hideFolderContent">
                <div v-for="folder in topFolders" :key="folder" @mouseover="showFolderContent(folder)"
                    :class="{ active: selectedFolder === folder }" class="folder-item">
                    {{ folder }}
                    <div v-if="hoveredFolder === folder" class="dropdown" @mouseover="keepFolderContent"
                        @mouseleave="hideFolderContent">
                        <router-link v-for="item in folderContents[folder]" :key="item.path" :to="item.route"
                            class="dropdown-item" tag="div" @click="hideFolderContent">
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
                <div>网址导航</div>
            </div>
            <div>深色模式</div>
            <div>git</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const modules = import.meta.glob('../posts/**/*.md', { query: '?raw', import: 'default' });

const folderStructure = {};
Object.keys(modules).forEach((path) => {//Object.keys 是 JavaScript 的内置方法，它接受一个对象（如 modules）作为参数，返回该对象的所有可枚举键组成的数组。
    const parts = path.split('/').filter(Boolean);
    //.filter(Boolean) 是一个简洁的过滤方法，用于移除数组中的“假值”（falsy values，例如空字符串 ''、 undefined、 null 等）。
    const topFolderIndex = parts.indexOf('posts') + 1;
    //parts.indexOf('posts') 查找 'posts' 在 parts 数组中的索引位置。
    //例如，对于 parts = ['src', 'posts', 'blog']，'posts' 的索引是 1。
    const topFolder = parts[topFolderIndex];

    if (!folderStructure[topFolder]) {
        folderStructure[topFolder] = [];//如果 folderStructure[topFolder] 不存在，则创建一个空数组。 
    }

    if (parts.length > topFolderIndex + 1) {//检查 parts 数组的长度是否大于 topFolderIndex + 1，即确保 'posts' 后的 topFolder 后面还有至少一个部分（nextPart）。
        const nextPart = parts[topFolderIndex + 1];//获取 topFolder 后的第一个部分,也就是子文件夹或文件的名称。
        const isMdFile = nextPart.endsWith('.md');//检查 nextPart 是否以 .md 结尾。结果为boolean值。
        const displayName = isMdFile ? nextPart.replace('.md', '') : nextPart;
        /*根据 isMdFile 的boolean值，决定 displayName：
          如果是 Markdown 文件（isMdFile = true），移除 .md 后缀。
          如果不是（isMdFile = false），保持原样。*/
        const routePath = isMdFile ? `/posts/${topFolder}/${displayName}` : `/posts/${topFolder}/${nextPart}`;
        //根据 isMdFile 的值，决定 routePath：
        //如果是 Markdown 文件（isMdFile = true），routePath 是 /posts/${topFolder}/${displayName}。
        //如果不是（isMdFile = false），routePath 是 /posts/${topFolder}/${nextPart}。
        const existing = folderStructure[topFolder].find((item) => item.name === displayName);
        //检查对应顶级文件夹中是否已有同名条目，避免重复添加。
        if (!existing) {//添加新的文件夹或文件到顶级文件夹中。
            folderStructure[topFolder].push({
                name: displayName,
                path: path,
                route: routePath,
            });
        }
    }
});
console.log(folderStructure);
//folderStructure 是一个对象，它的键是顶级文件夹的名称，值是一个包含该文件夹下所有文件的数组。
const topFolders = ref(Object.keys(folderStructure));//Object.keys(folderStructure) 返回 folderStructure 对象的所有键组成的数组。
//topFolders 是一个 ref，它的值是一个包含所有顶级文件夹名称的数组。
const folderContents = ref(folderStructure);
const selectedFolder = ref(topFolders.value[0] || '');//selectedFolder 是一个 ref，它的值是当前选中的顶级文件夹名称。默认选择第一个顶级文件夹。
const hoveredFolder = ref(null);//hoveredFolder 是一个 ref，它的值是当前鼠标悬停的顶级文件夹名称。

function showFolderContent(folder) {
    hoveredFolder.value = folder;
}

function keepFolderContent() { }

function hideFolderContent() {
    hoveredFolder.value = null;
}
</script>
<style scoped>
.navbar-container {
    display: flex;
    flex-direction: row;
    background-color: rgb(255, 255, 255);
    justify-content: space-between;
    padding: 20px 0;
    width: 100%;
    font-size: 18px;
    max-height: 7%;
    box-sizing: border-box;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
    cursor: pointer;
}

.component-container {
    display: flex;
    flex-direction: row;
    margin-right: 20px;
}

.buttons-container {
    display: flex;
    flex-direction: row;
}

.folder-item {
    height: 40px;
    margin-right: 20px;
    box-sizing: border-box;
}

.folder-item {
    position: relative;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: -55%;
    background-color: #fff;
    padding: 5px;
    z-index: 10;
    min-width: 100px;
    border-radius: 15px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.dropdown-item {
    padding: 5px;
}

.dropdown-item:hover {
    background-color: #f0f0f0;
}

.other {
    margin-right: 20px;
    cursor: pointer;
}
</style>