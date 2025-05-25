<template>
  <div v-loading="loading">
    <el-anchor v-if="!loading">
      <el-anchor-link v-for="anchor in localAnchors" :key="anchor.id" :href="'#' + anchor.id" :title="anchor.text"
        :data-level="anchor.level">
        <el-text truncated :style="{ paddingLeft: (anchor.level - 1) * 15 + 'px' }" size="small">{{ anchor.text }}</el-text>
      </el-anchor-link>
    </el-anchor>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';

// 定义 props
const props = defineProps({
  anchors: {
    type: Object,
    required: true,
  },
});

const loading = ref(true)
const localAnchors = ref(props.anchors);

watch(
  () => props.anchors,
  () => {
    //console.log(localAnchors.value.length)
    //localAnchors.value = newanchors.value;
    if (localAnchors.value.length > 0) {
      loading.value = false
    }
  },
  {immediate: true },
)

</script>
<style scoped>
.el-text{
  width: 12vw;
}
</style>