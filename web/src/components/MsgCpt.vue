<template>
  <li class="msg-box">
    <span class="sz" v-if=" props.msgType === msgType.sz">
      {{ msgVal }}
    </span>
    <span class="rz" v-else-if="props.msgType === msgType.rz">{{
      msgVal
    }}</span>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { msgType } from "@/utils/type";

const props = defineProps<{
  msgType: string;
  msgVal: string;
}>();
</script>

<style scoped lang="less">
@szColor: #95ec69;
@rzColor: #999;
.msg-box {
  .sz,
  .rz {
    padding: 6px 10px;
    border-radius: 5px;
    margin-left: 20px;
    position: relative;
  }
  .sz {
    background-color: @szColor;
    float: right;
    margin-right: 50px;
  }
  .rz {
    background-color: @rzColor;
    float: left;
    margin-left: 50px;
    color: #fff;
  }
  .rz::after,
  .sz::after {
    position: absolute;
    top: 50%;
    right: -7px;
    transform: translateY(-50%) rotate(45deg);
    content: "";
    display: block;
    width: 13px;
    height: 13px;
    background-color: @szColor;
  }
  .rz::after {
    background-color: @rzColor;
    left: -7px;
  }
}
.msg-box::after,
.msg-box::before {
  display: table;
  content: "";
}
.msg-box::after {
  clear: both;
}
.msg-box {
  margin: 20px 0;
}
</style>
