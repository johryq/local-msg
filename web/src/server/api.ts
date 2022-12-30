import type { Msg, UserInfo } from '@/utils/type';
import axios from 'axios';

const baseServer = axios.create({
  baseURL: 'http://192.168.10.5:3333',
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

export function getIPApi() {
  return baseServer.get('/ip');
}

export function saveUserApi(user: UserInfo) {
  return baseServer.post('/saveuser', { data: user });
}

export function updateListApi(user: UserInfo) {
  return baseServer.post('/updatelist', { data: user });
}

export function sendMsgApi(msg: Msg, key: string) {
  return baseServer.post('/sendmsg', { data: { msg, key } });
}

export function syncMsgApi(keys: string[]) {
  return baseServer.post('/syncmsg', { data: keys });
}

export function delAllApi() {
  return baseServer.get('/delall');
}

// export function getMsgListApi(key: string) {
//   return baseServer.get('/getmsglist?key=' + key);
// }
