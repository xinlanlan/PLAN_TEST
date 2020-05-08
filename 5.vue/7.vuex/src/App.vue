<template>
  <div id="app">
    {{age}}<br/>
    {{$store.getters.myAge}}<br/>
    {{$store.state.a.age}}<br/>
    {{$store.state.b.age}}<br/>
    {{$store.state.b.c.age}}<br/>
    <button @click="syncChange">同步更改</button><br/>
    <button @click="asyncChange">异步更改</button><br/>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'



export default {
  computed: {
    ...mapState(['age']),
    ...mapGetters(['myAge'])
  },
  methods: {
    ...mapMutations({aaa: 'syncChange'}),
    ...mapActions({bbb: 'asyncChange'}),
    syncChange() {
      this.aaa(10)
    },
    asyncChange() {
      this.bbb(-5)
    }
  }
}
</script>

<style>
</style>
