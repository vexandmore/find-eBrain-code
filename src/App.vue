<script setup>
import GetCode from './components/GetCode.vue';
</script>

<template>
  <div class="centeredContainer">
    <h1> Get your eBrain's code! </h1>
    <GetCode />
  </div>
</template>

<style>
@import './assets/base.css';

.centeredContainer {
  background-color: #FFFFFF;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  margin: auto;
  flex-direction: column;
  display: flex;
  align-items: center;

  padding-bottom: 30px;
  margin-top: 30px;
  color: #333;
}
body {
  background-image: url("assets/patrick-hendry-lbOfqldsKEw-unsplash.jpg");
  background-color: #000000;
  background-size: 100%;
}
</style>
