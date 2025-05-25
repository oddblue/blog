<template>
    <div class="light-home">
        <div class="background-size">
            <LightBack />
        </div>
        <span class="word">Dream big, work hard.</span>
    </div>
</template>

<script setup>
import LightBack from './LightBack.vue';

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