<template>
    <div class="navbar-container">
        <router-link class="logo" to="/">首页</router-link>
        <div class="component-container">
            <div class="buttons-container" @mouseleave="hideFolderContent">
                <div v-for="folder in topFolders" :key="folder" @mouseover="showFolderContent(folder)"
                    :class="{ active: selectedFolder === folder }" class="folder-item">
                    {{ folder }}
                    <Down class="icon" />
                    <div v-if="hoveredFolder === folder" class="dropdown" @mouseover="keepFolderContent"
                        @mouseleave="hideFolderContent">
                        <div v-for="item in folderContents[folder]" :key="item.path" :to="item.route"
                            class="dropdown-item" tag="div" @click="handleItemClick(item)">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
            <router-link to='/sitecards' class="buttons">网址导航</router-link>
            <div class="buttons">深色模式</div>
            <div class="buttons">git</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Down from '../assets/icons/down.svg'; // 直接作为组件导入

const emit = defineEmits(['updatepath']);
const router = useRouter();
const modules = import.meta.glob('/src/posts/**/*.md', { query: '?raw', import: 'default' });
const folderStructure = {};
const folderContents = ref({});
const hoveredFolder = ref(null);
const selectedFolder = ref(null);

// 构建文件夹结构
Object.keys(modules).forEach((path) => {
    const parts = path.split('/').filter(Boolean);
    const topFolderIndex = parts.indexOf('posts') + 1;
    const topFolder = parts[topFolderIndex];//获取顶级文件夹名称


    if (!folderStructure[topFolder]) {
        folderStructure[topFolder] = [];//初始化顶级文件夹
    }

    if (parts.length > topFolderIndex + 1) {//判断是否有子文件夹
        const nextPart = parts[topFolderIndex + 1];
        const isMdFile = nextPart.endsWith('.md');//判断是否是md文件，如果不为md结尾说明是文件夹
        const displayName = isMdFile ? nextPart.replace('.md', '') : nextPart;//去除md后缀
        const routePath = isMdFile ? `/posts/${topFolder}/${displayName}` : `/posts/${topFolder}/${nextPart}`;
        //根据isMdFile判断顶级文件夹下的内容是md文件还是文件夹,并且生成路由路径
        //如果是md文件，路由路径为/posts/顶级文件夹/文件名,如果是文件夹，路由路径为/posts/顶级文件夹/子文件夹名称
        const existing = folderStructure[topFolder].find((item) => item.name === displayName);//判断是否已经存在该文件夹或文件
        if (!existing) {//如果判断后没有重复内容
            folderStructure[topFolder].push({//添加对应的顶级文件夹下，内容包含文件或文件夹名，文件路径，路由路径，是否是文件夹
                name: displayName,
                path: path,
                route: routePath,
                isDir: !isMdFile,
            });
        }
    }
});

const topFolders = Object.keys(folderStructure);
folderContents.value = folderStructure;

const showFolderContent = (folder) => {
    hoveredFolder.value = folder;
    selectedFolder.value = folder;
};

const keepFolderContent = () => {
    hoveredFolder.value = selectedFolder.value;
};

const hideFolderContent = () => {
    hoveredFolder.value = null;
};

const handleItemClick = (item) => {//处理点击事件
    let targetPath = item.route;//获取对应内容路由信息
    if (item.isDir) {//判断当前内容是否是文件夹，如果是文件夹则获取该文件夹下第一个md文件
        const firstMd = findFirstMdInDir(item.route);//调用函数查找第一个md文件
        targetPath = firstMd || item.route;//如果没有找到md文件，则使用当前文件夹的路由
    }
    router.push(targetPath);//跳转到对应路由
    emit('updatepath', targetPath); // 通知 Post.vue
};

const findFirstMdInDir = (dirPath) => {//用于查找文件夹下第一个md文件
    const normalizedDirPath = dirPath.startsWith('/src') ? dirPath : '/src' + dirPath;//判断路径是否以src开头，如果不是则添加src
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
.navbar-container {
    display: flex;
    flex-direction: row;
    background-color: rgba(255, 255, 255);
    justify-content: space-between;
    padding: 20px 0;
    width: 100%;
    font-size: 16px;
    max-height: 7%;
    box-sizing: border-box;
    z-index: 1000;
    position: fixed;
    top: 0;

}

.logo {
    font-size: 24px;
    font-weight: bold;
    margin-left: 10%;
    cursor: pointer;
}

.icon {
    width: 15px;
    height: 15px;
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

.buttons {
    margin-right: 20px;
    cursor: pointer;
    margin-top: 0.3em;
}

.folder-item {
    height: 130%;
    margin: 0.3em 20px 20px 0;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
}

.dropdown {
    position: absolute;
    top: 3vh;
    left: -1vw;
    background-color: #fff;
    padding: 5px;
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
</style>