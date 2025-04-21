<template>
  <div class="cube-container" :style="containerStyle" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div ref="container" id="container"></div>
    <button @click="toggleMode" class="mode-toggle">
      {{ isDarkMode ? '浅色模式' : '深色模式' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { gsap } from 'gsap';

// 定义 Point 类
class Point {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() {
    return new Point(this.x, this.y, this.z);
  }
}

// 定义 Plane 类
class Plane {
  constructor(p, r, c) {
    this.position = p;
    this.rotation = r;
    this.color = c;
    this.createCanvas();
    this.ctx.shadowColor = '#fff';
    this.ctx.shadowBlur = 16;
  }
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = `${mPlaneSize}px`;
    this.canvas.style.height = `${mPlaneSize}px`;
    this.canvas.width = mPlaneSize;
    this.canvas.height = mPlaneSize;
    this.ctx = this.canvas.getContext('2d');

    gsap.set(this.canvas, {
      position: 'absolute',
      left: `-${mPlaneSize * 0.5}px`,
      top: `-${mPlaneSize * 0.5}px`,
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      rotationX: this.rotation.x,
      rotationY: this.rotation.y,
      rotationZ: this.rotation.z,
    });
  }
  clear() {
    this.ctx.clearRect(0, 0, mPlaneSize, mPlaneSize);
  }
}

// 定义 Trail 类
class Trail {
  constructor(position) {
    this.style = { strokeStyle: '#f00', lineWidth: 1 };
    this.t0 = 0;
    this.t1 = 0;
    this.deltaTime = 1 / randomRange(5, 20);
    this.points = [position || new Point()];
    this.maxLength = 3;
  }
  set color(c) {
    this.style.strokeStyle = c;
  }
  update() {
    this.t1 += this.deltaTime;
    this.t0 = Math.max(0, this.t1 - this.maxLength);
    if (this.t1 >= this.points.length - 1) {
      this.appendPoint();
    }
  }
  appendPoint() {
    const point = this.points[this.points.length - 1].clone();
    const direction = getRandomDirection();
    point.x = clamp(point.x + direction.x, 0, mDivisions);
    point.y = clamp(point.y + direction.y, 0, mDivisions);
    point.z = clamp(point.z + direction.z, 0, mDivisions);
    this.points.push(point);
  }
  draw() {
    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      let start = this.t0 > i ? this.t0 - i : 0;
      let end = this.t1 < i + 1 ? this.t1 - i : 1;
      if (this.t0 < i + 1) {
        this.connectPoints(p0, p1, start, end);
      }
    }
  }
  connectPoints(p0, p1, start, end) {
    const x0 = p0.x + (p1.x - p0.x) * start;
    const y0 = p0.y + (p1.y - p0.y) * start;
    const z0 = p0.z + (p1.z - p0.z) * start;
    const x1 = p0.x + (p1.x - p0.x) * end;
    const y1 = p0.y + (p1.y - p0.y) * end;
    const z1 = p0.z + (p1.z - p0.z) * end;

    if (p0.x === p1.x) {
      const ctx = mXPlanes[p0.x].ctx;
      applyStyle(ctx, this.style);
      ctx.beginPath();
      ctx.moveTo(z0 * mSegmentSize, y0 * mSegmentSize);
      ctx.lineTo(z1 * mSegmentSize, y1 * mSegmentSize);
      ctx.stroke();
    }
    if (p0.y === p1.y) {
      const ctx = mYPlanes[p0.y].ctx;
      applyStyle(ctx, this.style);
      ctx.beginPath();
      ctx.moveTo(x0 * mSegmentSize, z0 * mSegmentSize);
      ctx.lineTo(x1 * mSegmentSize, z1 * mSegmentSize);
      ctx.stroke();
    }
    if (p0.z === p1.z) {
      const ctx = mZPlanes[p0.z].ctx;
      applyStyle(ctx, this.style);
      ctx.beginPath();
      ctx.moveTo(x0 * mSegmentSize, y0 * mSegmentSize);
      ctx.lineTo(x1 * mSegmentSize, y1 * mSegmentSize);
      ctx.stroke();
    }
  }
}

// 全局变量
const mXPlanes = [];
const mYPlanes = [];
const mZPlanes = [];
const mAllPlanes = [];
const mTrails = [];
const mPlaneSize = 200;
const mDivisions = 5;
const mSegmentSize = mPlaneSize / mDivisions;

// DOM 引用和模式状态
const container = ref(null);
const isDarkMode = ref(true); // 默认深色模式

// 计算样式
const containerStyle = computed(() => ({
  backgroundColor: isDarkMode.value ? '#000' : '#f0f0f0',
}));

// 鼠标交互变量
const mouse = { x: 0, y: 0 };
let autoTween = null;

// 初始化函数
const init = () => {
  container.value.style.transformOrigin = '50% 50% 0';
  gsap.set(container.value, {
    perspective: 4000,
    transformStyle: 'preserve-3d',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transformOrigin: '50% 50% 0',
  });

  createPlanes();
  createTrails();

  autoTween = gsap.to(container.value, {
    duration: 20,
    ease: 'none',
    rotationX: 360,
    rotationY: 360,
    repeat: -1,
    transformOrigin: '50% 50% 0',
    paused: false,
  });
};

// 切换模式
const toggleMode = () => {
  isDarkMode.value = !isDarkMode.value;
  updateColors();
};

// 更新颜色
const updateColors = () => {
  const planeColors = isDarkMode.value
    ? { x: '#00f', y: '#0f0', z: '#f00' } // 深色模式
    : { x: '#0066cc', y: '#009900', z: '#cc0000' }; // 浅色模式：更深的颜色

  mXPlanes.forEach(plane => (plane.color = planeColors.x));
  mYPlanes.forEach(plane => (plane.color = planeColors.y));
  mZPlanes.forEach(plane => (plane.color = planeColors.z));

  // 更新轨迹颜色（可选：调整亮度）
  mTrails.forEach(trail => {
    const h = randomRange(0, 180) | 0;
    const s = randomRange(80, 100) | 0;
    const l = isDarkMode.value ? randomRange(80, 100) | 0 : randomRange(50, 70) | 0; // 浅色模式降低亮度
    trail.color = `hsl(${h},${s}%,${l}%)`;
  });
};

// 鼠标移动事件（带阻尼效果）
const onMouseMove = (event) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  mouse.x = (event.clientX - windowWidth / 2) / (windowWidth / 2);
  mouse.y = (event.clientY - windowHeight / 2) / (windowHeight / 2);

  autoTween.pause();

  const targetRotationX = -mouse.y * 90;
  const targetRotationY = mouse.x * 90;

  gsap.to(container.value, {
    rotationX: "+=" + (targetRotationX - gsap.getProperty(container.value, 'rotationX')) * 0.1,
    rotationY: "+=" + (targetRotationY - gsap.getProperty(container.value, 'rotationY')) * 0.1,
    duration: 0.1,
    transformOrigin: '50% 50% 0',
  });
};

// 鼠标离开事件
const onMouseLeave = () => {
  autoTween.play();
};

// 创建平面
const createPlanes = () => {
  const startOffset = mPlaneSize * -0.5;
  mXPlanes.length = 0;
  mYPlanes.length = 0;
  mZPlanes.length = 0;
  for (let i = 0; i <= mDivisions; i++) {
    mXPlanes.push(createPlane(new Point(startOffset + mSegmentSize * i, 0, 0), new Point(0, -90, 0), isDarkMode.value ? '#00f' : '#0066cc'));
    mYPlanes.push(createPlane(new Point(0, startOffset + mSegmentSize * i, 0), new Point(90, 0, 0), isDarkMode.value ? '#0f0' : '#009900'));
    mZPlanes.push(createPlane(new Point(0, 0, startOffset + mSegmentSize * i), new Point(), isDarkMode.value ? '#f00' : '#cc0000'));
  }
};

const createPlane = (p, r, c) => {
  const plane = new Plane(p, r, c);
  mAllPlanes.push(plane);
  container.value.appendChild(plane.canvas);
  return plane;
};

// 创建轨迹
const createTrails = () => {
  for (let i = 0; i < 10; i++) {
    const x = randomRange(0, mDivisions) | 0;
    const y = randomRange(0, mDivisions) | 0;
    const z = randomRange(0, mDivisions) | 0;
    const position = new Point(x, y, z);
    const h = randomRange(0, 180) | 0;
    const s = randomRange(80, 100) | 0;
    const l = isDarkMode.value ? randomRange(80, 100) | 0 : randomRange(50, 70) | 0;
    const color = `hsl(${h},${s}%,${l}%)`;
    startTrailsAt(position, color);
  }
};

const startTrailsAt = (point, color) => {
  for (let i = 0; i < 6; i++) {
    const trail = new Trail(point);
    trail.color = color;
    mTrails.push(trail);
  }
};

// 更新和绘制
const update = () => mTrails.forEach(trail => trail.update());
const draw = () => {
  mAllPlanes.forEach(plane => plane.clear());
  mTrails.forEach(trail => trail.draw());
};

const loop = () => {
  update();
  draw();
  requestAnimationFrame(loop);
};

// 生命周期钩子
onMounted(() => {
  init();
  requestAnimationFrame(loop);
});

// 工具函数
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(x, min, max) {
  return x < min ? min : x > max ? max : x;
}

function applyStyle(ctx, style) {
  for (const p in style) {
    ctx[p] = style[p];
  }
}

const getRandomDirection = (() => {
  const directions = [
    new Point(1, 0, 0), new Point(-1, 0, 0),
    new Point(0, 1, 0), new Point(0, -1, 0),
    new Point(0, 0, 1), new Point(0, 0, -1),
  ];
  return () => directions[Math.floor(Math.random() * directions.length)];
})();
</script>

<style scoped>
.cube-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s ease;
  /* 平滑切换背景色 */
}

#container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

canvas {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  /* 可根据模式调整透明度 */
}

.mode-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
}

.mode-toggle:hover {
  background-color: #555;
}
</style>