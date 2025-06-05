<template>
  <el-anchor v-if="loading">
    <el-anchor-link v-for="anchor in localAnchors" :key="anchor.id" :href="'#' + anchor.id" :title="anchor.text"
      :data-level="anchor.level">
      <el-text truncated :style="{ paddingLeft: (anchor.level - 1) * 15 + 'px' }" size="small">{{ anchor.text
      }}</el-text>
    </el-anchor-link>
  </el-anchor>
  <el-empty description="没有目录内容" v-else />
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  anchors: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
const localAnchors = ref(null);

//监听父组件传递目录参数
watch(
  () => props.anchors,
  () => {
    if (!props.anchors) {
      localAnchors.value = null;
      loading.value = false;
    }
    else if (props.anchors.value.length > 0) {
      localAnchors.value = props.anchors.value;
      loading.value = true;
    }
    else {
      loading.value = false;
    }
  },
  { immediate: true, deep: true },
)
</script>
<style scoped>
.el-text {
  width: 12vw;
}
</style>