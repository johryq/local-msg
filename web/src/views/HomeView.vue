<template>
  <div class="main-containter">
    <div class="main">
      <LogingCpt></LogingCpt>
      <UserListCpt></UserListCpt>
      <div class="main-box">
        <div class="box-head">
          <div class="head-title">ip</div>
          <div class="head-more">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-more"></use>
            </svg>
            <svg @click="closeMsg" class="icon" aria-hidden="true">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
        </div>
        <div v-if="userList" class="box-msg">
          <!-- server -->
          <!-- <div v-if="userList[0].ip === 'server'" class="msg-default">和大家聊天吧！</div> -->
          <!-- client -->
          <!-- <div v-if="allMsg[userList[userIndex].key]" class="msg-default">和主服务器聊天吧！</div> -->
          <!-- have user -->
          <div class="msg-info-box">
            <ul v-if="userList.length > 0 && userList[userIndex].key">
              <MsgCpt v-for="(msg, index) in allMsg[userList[userIndex].key]" :msg-val="msg.msg" :msg-type="userList[userIndex].ip === 'server' ? (msg.type === 'rz' ? 'sz' : 'rz') : msg.type"></MsgCpt>
            </ul>
          </div>
        </div>
        <div class="box-input">
          <div class="input-file">
            <svg @click="sendFile" class="icon" aria-hidden="true">
              <use xlink:href="#icon-file1"></use>
            </svg>
            <input @change="finputChange" ref="finput" id="sfile" type="file" />
          </div>
          <div class="input-info">
            <textarea v-model="data.text" type="text" />
          </div>
          <div class="input-btn-box">
            <div @click="sendMsg" class="input-btn">发送</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '//at.alicdn.com/t/c/font_3824346_vea84vh265g.js';
import MsgCpt from '@/components/MsgCpt.vue';
import UserListCpt from '@/components/UserListCpt.vue';
import LogingCpt from '@/components/LodingCpt.vue';
import { msgType, type UserInfo } from '@/utils/type';
import { getUUID } from '@/utils/Utils';
import { useStore } from '@/stores/index';
import { storeToRefs } from 'pinia';
import { reactive, ref, onMounted } from 'vue';
import { getDateTime, getShowDate } from '@/utils/DateTime';
import { getIPApi, saveUserApi, updateListApi, sendMsgApi, syncMsgApi } from '@/server/api';

const store = useStore();

// 上传文件
const data = reactive({
  text: '',
  fileUrl: '',
});
const { allMsg, userIndex, userList, baseLoad } = storeToRefs(store);
// default 聊天背景
const showDefaultInfo = false;
// input file documentElement
let finput = ref();
let btnTimer = -1;
let syncMsgTimer = -1;

// 发送消息
const sendMsg = () => {
  if (btnTimer && btnTimer !== -1) {
    clearTimeout(btnTimer);
    btnTimer = -1;
  }
  btnTimer = setTimeout(async () => {
    if (data.text !== '') {
      const time = getDateTime();
      const msg = {
        id: 0,
        msg: data.text,
        type: msgType.sz,
        time: time,
        time2: getShowDate(time),
      };
      if (userList.value[userIndex.value].ip === 'server') {
        msg.type = msgType.rz;
      }
      const { data: msgRes } = await sendMsgApi(msg, userList.value[userIndex.value].key);
      if (msgRes.state === '200') {
        allMsg.value[userList.value[userIndex.value].key].push(msg);
        console.log('send succeed');
        data.text = '';
      } else {
        console.log(msgRes);
      }
    }
  }, 200);
};
const closeMsg = () => {
  localStorage.clear();
  store.$reset();
  console.log('clear store');
};

// input file
const sendFile = () => {
  finput.value.click();
  const reader = new FileReader();
  reader.readAsDataURL(finput.value.files[0]);
  reader.onload = () => {
    console.log(reader.result);
  };
};
const finputChange = () => {
  console.log(finput.value.files[0]);
  // data.fileUrl = finput.value.value;
};

onMounted(async () => {
  console.log('onmounted');
  if (baseLoad.value) {
    // 初始化基本数据
    const { data: dIp } = await getIPApi();

    const key = getUUID(dIp.data.ip);
    const user: UserInfo = <UserInfo>{
      id: 0,
      ip: dIp.data.ip,
      resIP: 'server',
      name: 'server',
      key: key,
      key2: [],
      img: '',
    };
    console.log(user);
    // 添加当前用户
    const { data: dUser } = await saveUserApi(user);
    const { data: dMsg } = await updateListApi(user);

    console.log(dIp, dUser, dMsg);

    const ul = dMsg.data.userList;
    const ml = dMsg.data.msgList;
    // 初始化用户列表，消息列表
    if (dUser.state === '200') {
      if (ul) {
        userList.value = ul;
      } else {
        userList.value[0] = user;
      }
      if (ml) {
        allMsg.value = ml;
      } else {
        // if (userList.value) {
        //   allMsg.value[userList.value[0].key];
        // }
      }
    } else {
      console.log('ip加载失败');
      return;
    }
    baseLoad.value = false;
  }
  // syncMsgTimer = setInterval(syncMsg, 10000);
});

async function syncMsg() {
  const { data: msgRes } = await syncMsgApi([userList.value[0].key]);
  if (msgRes.state === '500') {
    setTimeout(() => {
      clearInterval(syncMsgTimer);
    }, 500);
  } else {
    if (msgRes.data) {
      console.log('sync msg');
      for (const key in msgRes.data) {
        if (allMsg.value.key) {
          if (msgRes.data[key].length !== allMsg.value[key].length) {
            allMsg.value = msgRes.data;
            return;
          }
        } else {
          allMsg.value = msgRes.data;
          return;
        }
      }
    }
  }
}

function saveUser(user: UserInfo, isServer: boolean = true) {
  // if (userList.value.length === 1 && userList.value[0].ip === 'server') {
  if (isServer) {
    userList.value[0] = {
      id: user.id,
      ip: user.ip,
      resIP: 'server',
      name: user.name,
      key: user.key,
      key2: user.key2,
      img: user.img,
    };
  } else {
    // 与其他客户端
    const haveUser = userList.value.filter((v) => {
      v.key2 = user.key2;
    });
    if (haveUser.length === 0) {
      userList.value.push(user);
    }
  }
}
</script>

<style lang="less" scoped>
@bgColor: #353535;
@boxColor: #fff;
@msgBoxWidth: 550px;
@msgBoxHeight: 650px;
@bgFontColor: #e3e4e5;
@grayFontColor: #9e9e9e;
@noneSpace: 15px;
@media only screen and (max-width: 600px) {
  .main-containter .main-box {
    height: 100% !important;
    width: 100% !important;
    border-radius: 0 !important;
  }
}
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: @grayFontColor;
}
#sfile {
  display: none;
}
.main {
  display: flex;
  width: 750px;
  height: 650px;
}
.main-containter {
  background-color: @bgColor;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .main-box {
    width: @msgBoxWidth;
    height: @msgBoxHeight;
    // min-width: @msgBoxWidth;
    // min-height: @msgBoxHeight;
    background-color: @boxColor;
    border-radius: 0 5px 5px 0;
    display: flex;
    flex-direction: column;
    .box-head {
      height: 60px;
      border-bottom: 1px solid @bgFontColor;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .head-title {
        font-size: 18px;
        font-weight: 500;
      }
    }
    .box-msg {
      flex: 1;
      height: 80%;
      overflow-y: auto;
      scrollbar-gutter: stable;
      .msg-default {
        display: flex;
        justify-content: center;
        align-items: center;
        color: @grayFontColor;
      }
      .msg-info-box {
        // overflow: hidden;
      }
    }
    .box-input {
      height: 180px;
      border-top: 1px solid @bgFontColor;
      display: flex;
      flex-direction: column;
      .input {
        &-file {
          height: 40px;
          line-height: 50px;
          padding-left: @noneSpace;
        }
        &-info {
          flex: 1;
          margin: 0 @noneSpace;
          textarea {
            width: 100%;
            height: 100%;
            overflow-y: auto;
          }
        }
        &-btn-box {
          height: 50px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-right: @noneSpace;
          .input-btn {
            width: 100px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            color: #999;
          }
          .btn-ac {
            color: #07c160;
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
}
</style>
