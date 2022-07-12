<script>
export default {
  props:{
    percentComplete: Number
  },
  data() {
    return {
        barID: Math.round(Math.random() * 10000000)
    }
  },
  computed: {
    name() {
        return 'color: ' + color + ';';
    }
  },
  mounted: function() {
    let loadingScript = document.createElement('script');
    loadingScript.setAttribute('src', './src/components/loadingio/loading-bar.min.js');
    document.head.appendChild(loadingScript);
  },
  updated: function() {
    document.getElementById(this.barID).ldBar.set(this.percentComplete);
  }
}
</script>

<template>
    <!-- NOTE: updating data-value does not reactively update the loading bar, I do so w/ updated-->
  <div v-bind:id="barID" class="ldBar" v-bind:data-value="percentComplete" style="width: 100%;" data-preset="energy"></div>
</template>

<style scoped>
@import './loadingio/loading-bar.min.css';
.ldBar {
    width: 100%;
}
</style>
