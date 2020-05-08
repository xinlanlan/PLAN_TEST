<template>
    <div id="example">
        <span>{{test}}</span>
        <button @click="handleClick">change</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                test: 'hello world'
            }
        },
        // mounted() {
        //     this.test = '123'
        //     console.log('script')
            
        //     Promise.resolve().then(function () {
        //         console.log('promise')
        //     })
        //     this.$nextTick(function () { 
        //         console.log('nextTick')
        //     })
            
        // },
        methods: {
            handleClick: function() {
                this.test = 'end';
                console.log('script')
                Promise.resolve().then(function () {
                    console.log('promise')
                })
                this.$nextTick(function () { 
                    console.log('nextTick')
                })
                
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>