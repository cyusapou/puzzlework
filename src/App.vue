<template>
  <AppNav />
  <main class="main-content">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import AppNav from './components/layout/AppNav.vue'
</script>

<style>
/* Any global un-scoped App styles if needed */
</style>
