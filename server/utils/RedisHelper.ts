import { createClient } from 'redis';
import { UserInfo, DbName, Msg, ReturnData, MsgList } from './type';

export class RedisHelper {
  redis: any;
  constructor() {
    this.init();
  }
  init() {
    let client = createClient({
      url: 'redis://:password@192.168.10.2:6379',
    });
    client.connect();
    this.redis = client;
  }

  // --- add
  // 发送消息redis
  async pushMsg(key: any, msg: Msg) {
    return this.redis.RPUSH(key, JSON.stringify(msg));
  }

  // 添加用户
  async addUserInfo(userInfo: UserInfo) {
    // server connect
    if (userInfo.ip === 'server') {
      return;
    }
    // client
    const server: UserInfo = JSON.parse(await this.redis.LINDEX(DbName.liUser, 0));
    const sv: UserInfo = {
      id: 0,
      ip: 'server',
      resIP: 'server',
      name: 'server',
      key: '',
      key2: [userInfo.key],
      img: '',
    };

    // 添加 server
    if (server === null) {
      // 首次添加！userList 初始化
      await this.redis.RPUSH(DbName.liUser, JSON.stringify(sv));
    } else {
      if (server.key2.filter((v: string) => v === userInfo.key).length > 0) {
        return 'saved key';
      }
      // 更新server key2[]
      if (userInfo.resIP === 'server') {
        server.key2.push(userInfo.key);
        this.redis.LSET(DbName.liUser, 0, JSON.stringify(server));
      }
    }
    // 添加client-server key

    const res = await this.redis.RPUSH(DbName.liUser, JSON.stringify(userInfo));
    userInfo.id = res - 1;
    // 更新key id
    await this.redis.LSET(DbName.liUser, res - 1, JSON.stringify(userInfo));
    return userInfo;
  }

  // --- select
  // 获取全部聊天记录
  async getMsgList(userInfo: UserInfo) {
    let msgList: MsgList = {};
    if (userInfo.ip === 'server') {
      // 所有与server连接的token msglist
      const { key2 } = JSON.parse(await this.redis.LINDEX(DbName.liUser, 0));
      await Promise.all(
        key2.map(async (v: string) => {
          msgList[v] = (await this.redis.LRANGE(v, 0, -1)).map((res: string) => {
            console.log(res);
            return JSON.parse(res);
          });
        }),
      );
    } else {
      // 用户-用户 msglist
      if (userInfo.key2) {
        if (userInfo.key2.length === 0) {
          return (msgList[userInfo.key] = await this.redis.LRANGE(userInfo.key, 0, -1)).map((v: string) => JSON.parse(v));
        } else {
          // userInfo.key2.forEach(async (v) => {
          //   msgList[v] = JSON.parse(await this.redis.LRANGE(v, 0, -1));
          // });
        }
      }
    }
    return msgList;
  }

  // 获取用户列表
  async getUserList(userInfo: UserInfo) {
    const users: [UserInfo] = (await this.redis.LRANGE(DbName.liUser, 1, -1)).map((v: string) => {
      const res = JSON.parse(v);
      res.resIP = res.ip;
      res.ip = 'server';
      return res;
    });
    let userList = <UserInfo[]>[];
    console.log(users);

    if (userInfo.ip === 'server') {
      return users;
    } else {
      // if (userInfo.key2 === null) {
      //   let result: null | userInfo = users.filter((v: UserInfo) => v.key === userInfo.key);
      //   if (result) {
      //     userList.push(result);
      //   }
      // }
      // users.map((val: UserInfo) => {
      //   let result = userInfo.key2.filter((v: string) => v === val.key);
      //   if (result) {
      //     userList.push(val);
      //   }
      // });
      return userList;
    }
  }

  async syncMsg(keys: string[]) {
    if (keys) {
      if (keys.length === 0) {
        return;
      }
      let msgList: MsgList = {};
      await Promise.all(
        keys.map(async (v: string) => {
          msgList[v] = (await this.redis.LRANGE(v, 0, -1)).map((res: string) => JSON.parse(res));
        }),
      );
      // msgList[keys[0]] = await this.redis.LRANGE(keys[0], 0, -1);
      return msgList;
    }
  }

  // --- del
  async serverStop() {
    const server = JSON.parse(await this.redis.LINDEX(DbName.liUser, 0));
    let keys = <string[]>[DbName.liUser];
    if (server.key2) {
      if (server.key2.length > 0) {
        server.key2.forEach((key: string) => {
          keys.push(key);
        });
      }
    }
    return await this.redis.DEL(keys);
  }

  // 更新key2
  async updateServer(userInfo: UserInfo) {
    const serverInfo: UserInfo = JSON.parse(await this.redis.LINDEX(DbName.liUser, 0));
    // 添加server key
    if (userInfo.resIP === 'server') {
      serverInfo.key2.push(userInfo.key);
      this.redis.LSET(DbName.liUser, 0, JSON.stringify(serverInfo));
    } else {
      // let userIndex = -1;
      // const userList: [UserInfo] = await this.redis.LRANGE(DbName.liUser, 0, -1);
      // const user = userList.filter((v, index) => v.key == userInfo.key);
    }
  }

  async closeRedis() {
    await this.redis.disconnect();
  }

  async testCon() {
    const client = createClient({
      url: 'redis://:Stone@123@192.168.10.6:6379',
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    const isok = client.isReady;
    console.log(isok);

    const value = await client.get('local_msg');
    return value;
  }
}
