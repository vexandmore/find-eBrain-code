<script>
import CodeDisplay from './CodeDisplay.vue'
import Progress from './Progress.vue'
import {USBconnect, writeToStream} from '../USBconnect.js'

export default {
  data() {
    return {
      eBrainCode: '',
      world: {},
      showLoading: false,
      showCode: false,
      progressPercent: 0
    }
  },
  components: {
    CodeDisplay,
    Progress
  },
  methods: {
    getRandomInRange(min, max) {
        return (Math.random() * (max - min)) + min;
    },
    async tryForCode() {
        var self = this;
        self.eBrainCode = '';
        await USBconnect(function(msg) {
            self.eBrainCode = msg.msg.ap_ssid;
            self.showLoading = true;
            // fake progress
            var increment1 = self.getRandomInRange(20, 60);
            var increment2 = self.getRandomInRange(65, 95);
            var delay1 = self.getRandomInRange(1000, 2000);
            var delay2 = delay1 + self.getRandomInRange(1000, 2000);
            var delay3 = delay2 + self.getRandomInRange(1000, 2000);
            setTimeout(function(){self.progressPercent = increment1;}, delay1);
            setTimeout(function(){self.progressPercent = increment2;}, delay2);
            setTimeout(function(){self.progressPercent = 100;}, delay3);
            setTimeout(function(){self.showCode = true; self.showLoading = false;}, delay3 + 500);
            console.log(msg.msg.ap_ssid);
        });
        writeToStream(JSON.stringify({cmd: "getConfig", id: "Df4h4"}));
    }
  }
}
</script>

<template>
    <button class="btn btn-success btn-lg" @click="tryForCode">Get code!</button>
    <CodeDisplay v-bind:eBrainCode='eBrainCode' v-if='showCode' />
    <Progress  v-show='showLoading' v-bind:percent-complete="progressPercent"></Progress>
</template>

<style scoped>
</style>




  