<template>
    <el-anchor select-scroll-top>
        <h3 class="list-title">目录</h3>
        <el-anchor-link v-for="category in props.categories" :key="category" :href="`#${category}`">
            {{ category }}
        </el-anchor-link>
    </el-anchor>
</template>
<script setup>
const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
});
</script>

