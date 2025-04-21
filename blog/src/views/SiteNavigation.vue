<!-- App.vue -->
<template>
    <div class="site-container">
        <div class="navbar">
            <Navbar />
        </div>
        <div class="navigation-container">
            <div class="category">
                <div v-for="category in categories" :key="category" :ref="(el) => (categoryRefs[category] = el)"
                    class="category-section">
                    <h2>{{ category }}</h2>
                    <div class="sites-grid">
                        <SiteCard v-for="site in getSitesByCategory(category)" :key="site.id" :site="site" />
                    </div>
                </div>
            </div>
            <div class="list">
                <span class="list-title">目录</span>
                <div v-for="category in categories" :key="category" @click="scrollToCategory(category)"
                    class="category-item">
                    <span>{{ category }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue';
import SiteCard from '../components/SiteCard.vue';
import Navbar from '../components/Navbar.vue'
import github from '../assets/logo/github-fill.svg';

// 静态数据
const sites = ref([
    { id: 1, name: 'Google', logo: markRaw(github), url: 'https://www.google.com', category: '搜索引擎', description: '全球领先的搜索引擎' },
    { id: 2, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎2', description: '中国最大的搜索引擎' },
    { id: 3, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎2', description: '中国最大的搜索引擎' },
    { id: 4, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎3', description: '中国最大的搜索引擎' },
    { id: 5, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎3', description: '中国最大的搜索引擎' },
    { id: 6, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎4', description: '中国最大的搜索引擎' },
    { id: 7, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎4', description: '中国最大的搜索引擎' },
    { id: 8, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎5', description: '中国最大的搜索引擎' },
    { id: 9, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎5', description: '中国最大的搜索引擎' },
    { id: 10, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎', description: '中国最大的搜索引擎' },
    { id: 11, name: 'GitHub', logo: markRaw(github), url: 'https://www.github.com', category: '开发工具', description: '代码托管平台' },
    { id: 12, name: 'Stack Overflow', logo: markRaw(github), url: 'https://stackoverflow.com', category: '开发工具', description: '程序员问答社区' },
    { id: 13, name: 'YouTube', logo: markRaw(github), url: 'https://www.youtube.com', category: '娱乐', description: '视频分享平台' },
    { id: 14, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎', description: '中国最大的搜索引擎' },
    { id: 15, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎', description: '中国最大的搜索引擎' },
    { id: 16, name: 'Baidu', logo: markRaw(github), url: 'https://www.baidu.com', category: '搜索引擎', description: '中国最大的搜索引擎' },
]);

// 计算所有唯一分类
const categories = computed(() => {
    const cats = [...new Set(sites.value.map(site => site.category))];
    return cats;
});

// 根据分类获取对应网址
const getSitesByCategory = (category) => {
    return sites.value.filter(site => site.category === category);
};
// 存储所有分类的 ref
const categoryRefs = ref({});


// 滚动到指定分类
const scrollToCategory = (category) => {
    const element = categoryRefs.value[category];
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.warn(`未找到分类 ${category} 的元素`);
    }
};
</script>

<style scoped>
.site-container {
    width: 100vw;
}

.navbar {
    width: 100%;
    background-color: rgb(255, 255, 255) !important;
}

.navigation-container {
    padding: 20px;
    display: flex;
    flex-direction: row;
    position: relative;
    padding-top: 5%;
    box-sizing: border-box;
    width: 95%;
    margin: 0 auto;
    /* 水平居中 */
    justify-content: center;
}

.list {

    font-size: 1em;
    padding: 20px;
    line-height: 32px;

    position: sticky;
    top: 10vh;
    align-self: flex-start;
}

.list-title {
    font-size: 1.3em;
    font-weight: bold;
}

.category {
    display: flex;
    flex-direction: column;
    width: 80%;
}

.category-section {
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    width: 95%;
}

h2 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 15px;
}

.sites-grid {
    display: grid;
    /* 固定3列，但宽度自适应 */
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
}
</style>