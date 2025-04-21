<template>
    <div class="light-home">
        <div class="background-size">
            <LightBack />
        </div>
        <span class="word">Dream big, work hard.</span>
        <div class="navigation">
            <div class="grid-container">
                <div class="first-content">
                    <div v-for="folder in topFolders" :key="folder" @mouseover="showFolderContent(folder)"
                        :class="{ active: selectedFolder === folder }" class="nav-item"
                        @click="handleItemClick(folder)">
                        <span>{{ getEmoji(folder) }} {{ folder }}</span>
                        <span>➡️</span>
                    </div>
                    <router-link to='/sitecards' class="nav-item">
                        <span>🔗 网址导航</span>
                        <span>➡️</span>
                    </router-link>
                </div>
                <div class="second-content">
                    <div class="nav-item">
                        <span>微信小程序</span>
                        <span>➡️</span>
                    </div>
                    <div class="nav-item">
                        <span>🗑️更新日志</span>
                        <span>➡️</span>
                    </div>
                    <div class="nav-item">
                        <span>🔓 git</span>
                        <span>➡️</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import LightBack from './LightBack.vue';
// 定义selectedFolder（响应式）
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 定义emit
const emit = defineEmits(['updatepath']);

// 动态导入md文件
const modules = import.meta.glob('/src/posts/**/*.md', { query: '?raw', import: 'default' });

const folderStructure = {};

// 构建文件夹结构
Object.keys(modules).forEach((path) => {
    const parts = path.split('/').filter(Boolean);
    const topFolderIndex = parts.indexOf('posts') + 1;
    const topFolder = parts[topFolderIndex];

    if (!folderStructure[topFolder]) {
        folderStructure[topFolder] = [];
    }
});

// 获取顶级文件夹
const topFolders = Object.keys(folderStructure);

const selectedFolder = ref(null);

// 处理鼠标悬停事件
const showFolderContent = (folder) => {
    selectedFolder.value = folder;
    // 如果需要，可以通过emit传递数据
    emit('updatepath', folderStructure[folder]);
};

// Emoji映射对象
const folderEmojiMap = {
    '八股文': '📜',  // 代表文章或文稿
    '封装函数': '📦', // 代表打包或封装
    '笔记': '📔',    // 代表笔记本
    'default': '📁'  // 默认文件夹图标
};

// 获取emoji的方法
const getEmoji = (folder) => {
    return folderEmojiMap[folder] || folderEmojiMap['default'];
};

const handleItemClick = (folder) => {//处理点击事件
    const firstMd = findFirstMdInDir(folder);//调用函数查找第一个md文件
    router.push(firstMd);//跳转到对应路由
};

const findFirstMdInDir = (dirPath) => {//用于查找文件夹下第一个md文件
    const normalizedDirPath = '/src/posts/' + dirPath;//判断路径是否以src开头，如果不是则添加src
    const matchingFiles = [];
    for (const filePath of Object.keys(modules)) {//遍历所有md文件
        if (filePath.startsWith(normalizedDirPath) && filePath.endsWith('.md')) {//判断文件路径是否以当前文件夹路径开头，并且是md文件
            matchingFiles.push(filePath);//添加到匹配文件列表
        }
    }
    if (matchingFiles.length > 0) {//如果匹配文件列表不为空
        matchingFiles.sort();//对匹配文件列表进行排序
        const firstFilePath = matchingFiles[0];//   获取第一个文件路径
        return firstFilePath.replace('/src', '');//去除src前缀
    }
    return null;
};
</script>

<style scoped>
.light-home {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.background-size {
    width: 60%;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

}

.navigation {
    width: 100%;
    position: absolute;
    bottom: 0;
}

.word {
    font-size: 4em;
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: bold;
    font-style: italic;
    background: linear-gradient(45deg, #0008ff, #ff0000);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    animation: glow 2s infinite;
    position: absolute;
    top: 12%;
    left: 16%;
}

@keyframes glow {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.grid-container {
    display: grid;
    grid-template-rows: auto auto;
    /* 上下两行 */
    padding: 20px;
    width: 70%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.first-content,
.second-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
    /* 格子间距 */
}


.nav-item {
    height: 18vh;
    max-height: 165px;
    /* 固定高度 */
    margin: 0.5em;
    padding: 0.5em;
    color: white;
    display: flex;
    flex-direction: column;
    /* 垂直排列 span */
    align-items: flex-end;
    flex-grow: 1;
    /* 动态分配宽度 */
    transition: all 0.1s;
    cursor: pointer;
    border-radius: 8px;
    min-width: 150px;
    /* 最小宽度，防止过窄 */
    justify-content: space-between;
}

/* 自定义背景色，模仿图片效果 */
.first-content .nav-item:nth-child(1) {
    background: #5A6A7B;
}

.first-content .nav-item:nth-child(2) {
    background: #C5A47E;
}

.first-content .nav-item:nth-child(3) {
    background: #8A3C3C;
}

.first-content .nav-item {
    background: #2E7D7A;
}

.second-content .nav-item:nth-child(1) {
    background: #1A4A4E;
}

.second-content .nav-item:nth-child(2) {
    background: #F28C38;
}

.second-content .nav-item:nth-child(3) {
    background: #D47A8A;
}

/* 悬停效果 */
.nav-item:hover {
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
}

.nav-item .active {
    background: rgba(255, 255, 255, 0.3);
}

/* 控制 span 的样式 */
.nav-item span {
    width: 100%;
}

.nav-item span:first-of-type {
    align-self: flex-end;
    text-align: left;
    font-size: 2em;
}

.nav-item span:nth-of-type(2) {
    text-align: right;
    align-self: flex-start;
    font-size: 1.75em;
}

@media (max-width: 768px) {

    .second-content {
        flex-direction: column;
        /* 移动端垂直排列 */
    }

    .nav-item {
        width: 100%;
        /* 移动端占满宽度 */
        min-width: unset;
    }
}
</style>