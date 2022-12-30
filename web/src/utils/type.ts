export interface UserInfo {
  id: number;
  ip: string;
  resIP: string;
  name: string;
  key: string;
  key2: string[];
  img: string;
}

export interface Msg {
  id: number;
  msg: string;
  type: string;
  time: string;
  time2: string;
}


export interface MsgList {
  [propname: string]: Msg[];
}

// export interface UserList {
//   [UserInfo]
// }

export const msgType = {
  sz: 'sz',
  rz: 'rz',
  img: 'img',
  video: 'video',
  file: 'file',
};
