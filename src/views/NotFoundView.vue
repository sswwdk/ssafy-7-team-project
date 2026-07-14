<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
</script>

<template>
  <div class="container narrow-container page-stack">
    <section class="state-box">
      <h1>404</h1>
      <p>요청한 페이지를 찾을 수 없습니다.</p>
      <RouterLink class="button button-primary" :to="{ name: ROUTE_NAMES.HOME }">
        홈으로
      </RouterLink>
    </section>
  </div>
</template>
