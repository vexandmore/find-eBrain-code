<script>
import CodeDisplay from './CodeDisplay.vue'
import Progress from './Progress.vue'
import {USBconnect, writeToStream} from '../USBconnect.js'

export default {
  data() {
    return {
      eBrainCode: '',
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
        this.showLoading = false;
        this.showCode = false;
        this.progressPercent = 0;
        var self = this;
        self.eBrainCode = '';
        await USBconnect((msg) => {self.whenReceiveCode(msg, self);}).catch(() => alert('Error connecting!'));
        writeToStream(JSON.stringify({cmd: "getConfig", id: "Df4h4"}));
    },
    whenReceiveCode(msg, self) {
        self.eBrainCode = msg.msg.ap_ssid;
        self.showLoading = true;
        // fake progress
        var increment1 = self.getRandomInRange(20, 55);
        var increment2 = self.getRandomInRange(65, 85);
        var delay1 = self.getRandomInRange(1000, 2000);
        var delay2 = delay1 + self.getRandomInRange(1000, 2000);
        var delay3 = delay2 + self.getRandomInRange(1000, 2000);
        setTimeout(function(){self.progressPercent = increment1;}, delay1);
        setTimeout(function(){self.progressPercent = increment2;}, delay2);
        setTimeout(function(){self.progressPercent = 100;}, delay3);
        setTimeout(function(){self.showCode = true; self.showLoading = false;}, delay3 + 2000);
        console.log(msg.msg.ap_ssid);
    }
  }
}
</script>

<template>
    <button class="btn btn-success btn-lg" @click="tryForCode">Get code!</button>
    <CodeDisplay v-bind:eBrainCode='eBrainCode' v-if='showCode' />
    <Progress  v-show='showLoading' v-bind:percent-complete="progressPercent" color="654757"></Progress>
</template>

<style scoped>
</style>




  