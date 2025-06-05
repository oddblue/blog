<template>
  <div>加载中...</div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const auth0 = useAuth0();
const router = useRouter();
const isHandled = ref(false);
const error = ref(null);

onMounted(async () => {
  if (isHandled.value) {
    console.log('回调已处理，跳过');
    return;
  }

  try {
    // 记录 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    console.log('回调 URL 参数:', { code, state });

    // 检查 URL 参数
    if (!code || !state) {
      throw new Error('回调 URL 缺少 code 或 state 参数');
    }

    // 等待 Auth0 SDK 初始化
    if (auth0.isLoading.value) {
      console.log('等待 Auth0 SDK 初始化...');
      await new Promise((resolve) => {
        watch(auth0.isLoading, (isLoading) => {
          if (!isLoading) {
            console.log('Auth0 SDK 初始化完成');
            resolve();
          }
        });
      });
    }

    // 处理回调
    isHandled.value = true;
    await auth0.handleRedirectCallback();

    // 跳转到目标页面
    await router.push('/dashboard');
  } catch (err) {
    console.error('回调错误:', err);
    error.value = err.message || '处理回调失败';
  }
});
</script>