<script>
export default {
  props:{
    percentComplete: Number,
    color: String
  },
  data() {
    return {
        barID: Math.round(Math.random() * 10000000),
    }
  },
  /*computed: {
    style() {
        return 'color: ' + this.color + '; height: 50px; width: 200px;';
    }
  },*/
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
    <div class="loadContainer">
        <div v-bind:id="barID" class="ldBar" data-preset="energy"></div>
    </div>
</template>

<style scoped>
@import './loadingio/loading-bar.min.css';
.ldBar {
    /*Using !important is the ONLY WAY this works, for some reason this library directly sets 
    the width and height in px on the elements*/
    width: 180px!important;
    height: 50px!important;
}
.ldbar-label {
  text-align: center;
}
.loadContainer {
    display: flex;
    justify-content: center;
}
</style>
