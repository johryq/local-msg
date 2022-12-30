<template>
  <div class="user-list">
    <div class="row-search">
      <div class="search-box">
        <div class="refresh">
          <svg @click="refreshMsg" class="icon" aria-hidden="true">
            <use xlink:href="#icon-refresh"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- server -->
    <div @click="changeIndex(index)" v-if="userList.length > 0" :key="index" v-for="(user, index) in userList" class="row" :class="{ 'ac-row': userIndex === index }">
      <!-- <img src="@/assets/johryq_Arc.png" alt="" /> -->
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-maomi"></use>
      </svg>
      <div class="row-center">
        <div>{{ user.ip === 'server' ? user.resIP.split('.')[2] + '.' + user.resIP.split('.')[3] : user.name }}</div>
        <div class="small-size"></div>
      </div>
      <div class="row-right">
        <p class="small-size">{{ '' }}</p>
        <!-- allMsg.values ? '' : allMsg[userList[index].key].slice(-1)  -->
      </div>
    </div>
    <div v-else><p class="msg-default">还没有客户连接哦</p></div>
    <!-- client -->
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { syncMsgApi } from '@/server/api';

const store = useStore();

const { userList, allMsg, userIndex } = storeToRefs(store);
let timer = -1;

function changeIndex(index: number) {
  userIndex.value = index;
}

// const props = defineProps({
//   msg: Object,
// });

// const msg = toRefs(msgList.value[msgList.value.length - 1]);

// const showTime = computed({
//   get: () => (msg ? msg.time2 : ""),
//   set: () => (msg.time2.value = getShowDate(msg.time2.value)),
// });
const refreshMsg = () => {
  if (timer && timer !== -1) {
    clearTimeout(timer);
    timer = -1;
  }
  timer = setTimeout(async () => {
    const keys = userList.value.map((user) => {
      return user.key;
    });
    const { data: msgList } = await syncMsgApi(keys);
    // const msgList = await syncMsgApi([userList.value[0].key]);
    console.log(msgList);
    if (msgList.state === '200' && msgList.data) {
      // for (let i in msgList.data.kys) {
      //   allMsg.value[i] = msgList.data[i].map((v: string) => {
      //     JSON.parse(v);
      //   });
      // }
      allMsg.value = msgList.data;
      console.log(allMsg.value);
    }
  }, 200);
};
</script>

<style scoped lang="less">
@grayFontColor: #9e9e9e;

.msg-default {
  display: flex;
  justify-content: center;
  align-items: center;
  color: @grayFontColor;
}
.user-list {
  background-color: #fff;
  height: 100%;
  flex: 1;
  border-right: 1px solid #e3e4e5;
  .search-box,
  .row {
    width: 100%;
    height: 60px;
    padding: 5px;
  }
  .row-search {
    .search-box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .refresh {
        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .row {
    display: flex;
    align-items: center;
    overflow: hidden;
    .icon {
      width: 50px;
      height: 50px;
    }
    & > img {
      width: 40px;
      height: 40px;
    }
    .row-center {
      padding: 0 5px;
      width: 45%;
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      div {
        height: 40%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .small-size {
      font-size: 12px;
      color: #9e9e9e;
    }
    .row-right {
      text-align: right;
      width: 50px;
      height: 85%;
    }
  }
  .ac-row {
    background-color: #e3e4e5;
  }
}
</style>
