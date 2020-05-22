<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'this is about pages'
      }
    },
    mounted () {
      console.log(2);
    },
  }
</script>

<style lang="scss" scoped>

</style>