import type { MsgList, UserInfo } from '@/utils/type';
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  persist: true,
  state: () => {
    return {
      userIndex: 0,
      baseLoad: true,
      allMsg: <MsgList>{},
      userList: <UserInfo[]>[],
    };
  },
});
