<template>
  <div class="post-container">
    <Navbar @updatepath="updatePath" class="nabar" />
    <div class="blogcontent">
      <Content :currentpath="path" @select-file="selectFile" class="content" />
      <div class="blog">
        <BlogContent :path="path" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BlogContent from '../components/BlogContent.vue';
import Content from '../components/Content.vue';
import Navbar from '../components/Navbar.vue';

const props = defineProps({
  path: String,
});

const route = useRoute();
const path = ref(props.path || '/posts');

watch(() => route.path, (newPath) => {
  const decodedPath = decodeURI(newPath); // 解码 URL
  path.value = decodedPath;
}, { immediate: true });

const updatePath = (newPath) => {
  console.log('updatePath:', newPath);
  path.value = newPath; // Nabar 传递的路径已是未编码的
};

const selectFile = (filePath) => {
  console.log('selectFile:', filePath);
  path.value = filePath;
};

</script>

<style scoped>
.post-container {
  min-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;


}

.nabar {
  background-color: rgb(255, 255, 255);
}

.blogcontent {
  display: flex;
  flex-direction: row;
  gap: 20px;
  min-width: 100%;
}

.content {
  width: 10%;

}

.blog {
  width: 65%;
  padding: 0 40px;
}
</style>