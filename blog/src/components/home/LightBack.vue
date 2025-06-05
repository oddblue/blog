<!-- BackgroundCircles.vue -->
<template>
    <div class="background-container">
        <div class="circle circle-red"></div>
        <div class="circle circle-blue"></div>
        <div class="circle circle-green"></div>
        <div class="reflection"></div>
    </div>
</template>

<style scoped>
.background-container {
    z-index: -1;
    position: relative;
    animation: rotate 10s linear infinite;
    filter: blur(150px);
    width: 80%;
    aspect-ratio: 1 / 1;
}

.circle {
    position: absolute;
    width: 65%;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    /* 增大发散半径 */
    background: radial-gradient(circle, var(--color) 0%, transparent 300%);
}

/* 调整为等边三角形布局 */
.circle-red {
    --color: rgb(255, 100, 100);
    top: -5%;
    left: 50%;
    transform: translate(-50%, 0);
}

.circle-blue {
    --color: rgb(100, 100, 255);
    top: 40%;
    left: 25%;
    transform: translate(-50%, 0);
}

.circle-green {
    --color: rgb(100, 255, 100);
    top: 40%;
    left: 75%;
    transform: translate(-50%, 0);
}

/* 镜面反射效果 */
.reflection {
    position: absolute;
    width: 100%;
    height: 50%;
    bottom: 0;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.2) 100%
    );
    filter: blur(10px);
    transform: scaleY(-1);
    opacity: 0.3;
}

/* 定义旋转动画 */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 响应式调整 */
@media (max-width: 600px) {
    .circle {
        width: 55%;
        height: 55%;
    }
    .background-container {
        filter: blur(3px);
    }
}
</style>