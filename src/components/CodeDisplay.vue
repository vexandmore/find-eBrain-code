<script>
export default {
  props: {
    eBrainCode: String,
    currentLanguage: String
  },
  data() {
    return {
      
    }
  },
  computed: {
    haveCode() {
      return this.eBrainCode !== '';
    },
    announcementText() {
      return this.currentLanguage === 'en' ? "Code is: " : "Le code est: ";
    }
  }
}
</script>

<template>
  <p class="result">{{announcementText}} <code v-if="haveCode" class="result">{{eBrainCode}}</code> </p>
</template>

<style scoped>
.result {
  font-size: 20px;
  margin-top: 20px;
}
</style>
