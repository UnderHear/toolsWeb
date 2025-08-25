<template>
  <MainHeader />
  <router-view />
</template>

<script>
import MainHeader from './components/Header.vue';

export default {
  name: 'App',
  components: {
    MainHeader
  }
};
</script>

<style>
</style>