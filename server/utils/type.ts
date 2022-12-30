export interface UserInfo {
  id: number;
  ip: string;
  resIP: string;
  name: string;
  key: string;
  key2: string[];
  img: string;
}

// ServerToken [string][]

export interface Msg {
  id: number;
  msg: string;
  type: 'sz' | 'rz';
  time: string;
  time2: string;
}

export interface ReturnData {
  state: string;
  data: object;
  msg: string;
}

export interface MsgList {
  [propname: string]: Msg[];
}

export const DbName: { [key: string]: string } = {
  liUser: 'list_localMsg_user',
  liMsg: 'set_localMsg_msg',
};

export const ReturnMsg = {
  ok: 'ok',
  nullReq: '请求参数获取失败',
  returnNull: '服务器获取失败',
  nullIP: '获取IP失败',
};
