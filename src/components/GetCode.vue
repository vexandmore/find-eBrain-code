<script>
import CodeDisplay from './CodeDisplay.vue'
import Progress from './Progress.vue'
import {USBconnect} from '../USBconnect.js'

export default {
  props: {
    currentLanguage: String
  },
  data() {
    return {
      eBrainCode: '',
      showLoading: false,
      showCode: false,
      progressPercent: 0,
      connection: {}
    }
  },
  computed: {
    buttonText() {
      return this.currentLanguage === 'en' ? "Get code!" : "Obtiens le code!";
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
      this.progressPercent = 1;
      var self = this;
      self.eBrainCode = '';
      var errorCallback = () => self.showError();
      this.connection = null;
      try {
        this.connection = await USBconnect((msg) => { self.whenReceiveCode.call(self, msg); },
                       () =>{}, errorCallback);
        this.receiveTimeout = setTimeout(() => {
          this.disconnectShowError();
        }, 2000);
        this.showLoading = true;
        this.connection.writeToStream(JSON.stringify({ cmd: "getConfig", id: "Df4h4" }));
      } catch (e) {
        this.disconnectShowError();
      }
    },
    whenReceiveCode(msg) {
      clearTimeout(this.receiveTimeout);
      this.eBrainCode = msg.msg.ap_ssid;
      // fake progress setup
      var increment1 = this.getRandomInRange(20, 55);
      var increment2 = this.getRandomInRange(65, 85);
      var delay1 = this.getRandomInRange(1000, 2000);
      var delay2 = delay1 + this.getRandomInRange(1000, 2000);
      var delay3 = delay2 + this.getRandomInRange(1000, 2000);
      // fake progress execution
      var self = this;
      setTimeout(function () { self.progressPercent = increment1; }, delay1);
      setTimeout(function () { self.progressPercent = increment2; }, delay2);
      setTimeout(function () { self.progressPercent = 100; }, delay3);
      setTimeout(function () { self.showCode = true; self.showLoading = false; }, delay3 + 2000);
      this.connection.disconnect(); // disconnect
      this.connection.disconnected = () => {}; // disable error message that would otherwise show up when it's unplugged.
    },
    disconnectShowError() {
      if (this.connection != null) {
        this.connection.disconnect();
      }
      new bootstrap.Modal('#connectionErrorModal', {backdrop: true, keyboard: true, focus: true}).show();
      this.showLoading = false;
      this.progressPercent = 0;
    }
  }
}
</script>

<template>
<!-- Bootstrap modal, to show an error. -->
  <div class="modal fade" tabindex="-1" id="connectionErrorModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Error! Erreur!</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Un erreur s'est produit en se connectant au eBrain! Error connecting to eBrain!</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- These are the main parts the user sees -->
  <button class="btn btn-primary btn-lg" @click="tryForCode">{{buttonText}}</button>

  <CodeDisplay v-bind:eBrainCode='eBrainCode' v-bind:current-language="currentLanguage" v-if='showCode' />
  <Progress v-show='showLoading' v-bind:percent-complete="progressPercent" color="654757"></Progress>
</template>

<style scoped>
</style>




  