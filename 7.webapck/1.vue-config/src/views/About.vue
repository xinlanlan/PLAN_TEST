<template>
  <div>
    <div class="msg" style="margin-bottom: 10px">{{ msg }}</div>
    <div class="hello" @click="change">
      <Hello @click.native="search"></Hello>
      <World></World> 
    </div>
    
  </div>
</template>

<script>
import Hello from '@/components/Hello'
import World from '@/components/World'
export default {
  data() {
    return {
      msg: 'this is about pages'
    }
  },
  methods: {
    search(e) {
      console.log('hello input')
    },
    change() {
      console.log('change')
    }
  },
  components: {
    Hello,
    World
  }
}
</script>

<style lang="scss" scoped>
</style>