<template>
  <div class="home">
    <div class="msg">{{ msg }}</div>
    <router-link to="/about">点击跳转</router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'i am home'
      }
    }
  }
</script>

<style lang="scss" scoped>

</style> 