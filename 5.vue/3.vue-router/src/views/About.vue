<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link to="/about/a">A</router-link>
    <router-link to="/about/b">B</router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$route)
  }
}
</script>

<style lang="sass" scoped>

</style>
