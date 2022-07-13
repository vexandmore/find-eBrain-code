<script>
import GetCode from './components/GetCode.vue';
export default {
  components: {
    GetCode
  },
  data() {
    return {
      currentLanguage: 'en',
      languages: [{abbreviation: 'en', nativeName: 'English'}, {abbreviation: 'fr', nativeName: 'Français'}]
    }
  },
  computed: {
    headerText() {
      return this.currentLanguage === 'en' ? "Get your eBrain's code!" : "Obtiens le code de ton eBrain!";
    }
  },
  methods: {
    setLanguage(abbr) {
      this.currentLanguage = abbr;
    }
  }
}
</script>

<template>
  <div class="centeredContainer">
    <div class="dropdown" id="languageSelector">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="LanguageButton" data-bs-toggle="dropdown" aria-expanded="false">
        Langue/Language
      </button>
      <ul class="dropdown-menu" aria-labelledby="LanguageButton">
        <li v-for="language in languages"><a class="dropdown-item" href="#" @click='setLanguage(language.abbreviation)'>{{language.nativeName}}</a></li>
      </ul>
    </div>

    <h1> {{headerText}} </h1>

    <GetCode v-bind:current-language="currentLanguage"/>
  </div>
</template>

<style>
@import './assets/base.css';
#languageSelector {
  align-self: start;
  margin: 5px;
}

h1 {
  font-size: 36px;
  margin-top: 20px;
}

.centeredContainer {
  background-color: #FFFFFF;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  margin: auto;
  flex-direction: column;
  display: flex;
  align-items: center;

  padding: 5px 5px 30px 5px;
  margin-top: 30px;
  color: #333;
}
body {
  background-image: url("assets/bg-image.jpg");
  background-color: #000000;
  background-size: 100%;
}
</style>
