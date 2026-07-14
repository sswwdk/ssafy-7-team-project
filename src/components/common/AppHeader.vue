<script setup>
import { ROUTE_NAMES } from '@/constants/routes'
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <RouterLink class="brand" :to="{ name: ROUTE_NAMES.HOME }">LocalHub</RouterLink>
      <nav class="main-nav" aria-label="주요 메뉴">
        <RouterLink :to="{ name: ROUTE_NAMES.POSTS }">커뮤니티</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.MAP }">지도</RouterLink>
        <RouterLink :to="{ name: ROUTE_NAMES.FESTIVALS }">축제</RouterLink>
      </nav>
    </div>
  </header>
</template>
