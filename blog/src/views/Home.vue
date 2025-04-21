<template>
    <div class='home-container'>
        <Navbar />
        <div class="content">
            <LightHome />
        </div>
    </div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue';
import Cool3DBackground from '../components/Cool3DBackground.vue';
import LightHome from '../components/LightHome.vue';
</script>
<style scoped>
.home-container {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
}
.home-container :deep(.navbar-container){
    background-color: rgba(255, 255, 255,0.1);
}
.content {
    width: 100vw;
    height: 80vw;
}
</style>
