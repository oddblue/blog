<template lang="">
    <div>
        <LightBack>
            <span>
                <h1 class="text-4xl font-bold text-center text-white">Welcome to My Blog</h1>
                <p class="text-lg text-center text-gray-300">Explore my thoughts and ideas</p>
                <div class="flex justify-center mt-4">
                    <a href="#about" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">About Me</a>
                    <a href="#projects" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4">Projects</a>
                    <a href="#contact" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4">Contact</a>
                </div>
            </span>
        </LightBack>
    </div>
</template>
<script setup>
import LightBack from './LightBack.vue';
</script>
<style lang="">

</style>