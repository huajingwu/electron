<script setup>
import HelloWorld from './components/HelloWorld.vue'

function setTitle(){
   window.electronAPI.setTitle('好好学习')
}
async function openFile(){
    const filePath = await window.electronAPI.openFile()
    console.log(filePath);
}

window.electronAPI.setTitle('好好学习')



</script>

<template>
  <div>
   版本2
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
