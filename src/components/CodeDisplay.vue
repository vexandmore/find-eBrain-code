<script>
export default {
  props:['eBrainCode'],
  data() {
    return {
      
    }
  },
  computed: {
    haveCode() {
      return this.eBrainCode !== '';
    }
  }
}
</script>

<template>
  <p class="result">Code is: <code v-if="haveCode" class="result">{{eBrainCode}}</code> </p>
</template>

<style scoped>
</style>
