<template>
    <div class="post-container">
        <Nabar />
        <BlogContent :path="path" />
    </div>
</template>

<script setup>
import BlogContent from '../components/BlogContent.vue';
import Nabar from '../components/Nabar.vue';

defineProps({
    path: String, // 接收路由传递的 path
});
</script>

<style scoped>
.post-container {
    padding: 20px;
}
</style>