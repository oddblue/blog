<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="isAuthenticated">
      <p>Welcome, {{ user.name }}! Your role is {{ userRole }}.</p>
      <div v-if="userRole === 'user' || userRole === 'admin'" >bbbbb</div>
      <div v-if="userRole === 'admin'">aaaaa</div>
    </div>
    <div v-else>
      <p>You are a guest. Please log in to see more content.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';



const auth0 = useAuth0();
const isAuthenticated = auth0.isAuthenticated;
const user = auth0.user;
const userRole = user.value?.['https://dev-j8kiozma53twzodw.us.auth0.com/api/v2/role'] || 'user';
</script>