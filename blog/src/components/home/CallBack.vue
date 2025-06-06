<template>
  <div>加载中...</div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';

const auth0 = useAuth0();
const router = useRouter();
const isHandled = ref(false);
const error = ref(null);

onMounted(async () => {
  if (isHandled.value) {
    ElMessage('回调已处理，跳过');
    return;
  }

  try {
    // 等待 Auth0 SDK 初始化
    if (auth0.isLoading.value) {
      await new Promise((resolve) => {
        watch(auth0.isLoading, (isLoading) => {
          if (!isLoading) {
            //console.log('Auth0 SDK 初始化完成');
            resolve();
          }
        });
      });
    }

    // 处理回调
    isHandled.value = true;
    async () => {
      try {
        await handleRedirectCallback();
        router.push('/');
        ElMessage.success('登陆成功');
      } catch (error) {
        ElMessage.error('回调验证失败，请刷新重试');
        router.push('/');
      }
    };
  } catch (err) {
    console.error('回调错误:', err);
    error.value = err.message || '处理回调失败';
  }
});
</script>