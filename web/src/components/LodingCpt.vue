<template>
  <div :hidden="showThis" class="loding">
    <p>loding{{ dot }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const dot = ref(" . ");
let showThis = true;
const timer = setInterval(() => {
  dot.value += " . ";
}, 300);

await setTimeout(() => {
  clearInterval(timer);
  showThis = false;
}, 10000);
</script>

<style scoped lang="less">
.loding {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 750px;
  height: 650px;
  background-color: #9e9e9e;
  color: #fff;
  p {
    text-align: center;
    line-height: 650px;
  }
}
</style>
