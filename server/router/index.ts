import express, { Express, Router, Request, Response } from 'express';
import { RedisHelper } from '../utils/RedisHelper';
import { ReturnData, Msg, ReturnMsg, MsgList } from '../utils/type';

export const router: Router = express.Router();

const redisHelper = new RedisHelper();
router.get('/', (req: Request, res: Response) => {
  res.send('hello-world');
});

// 获取ip
router.get('/ip', async (req: Request, res: Response) => {
  let ip = await getClientIp(req);
  if (ip !== '') {
    if (ip === req.host) {
      ip = 'server';
    }
    res.json(returnDataInit({ ip }));
  } else {
    res.json(returnDataInit({}, '500', ReturnMsg.nullIP));
  }
});

router.get('/delall', async (req, res) => {
  let ip = await getClientIp(req);
  if (ip !== '') {
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === req.host) {
      const result: number = await redisHelper.serverStop();
      if (result > 0) {
        res.json(returnDataInit({}, '200', 'del all sucesss'));
        return;
      }
    }
  }
  res.json(returnDataInit({}, '500', 'del all error'));
});

// 初始化用户
router.post('/saveuser', async (req: Request, res: Response) => {
  console.log('saveUser');

  const user = req.body.data;
  res.json(returnDataInit(redisHelper.addUserInfo(user)));
});

// 获取及更新消息列表，以及用户列表
router.post('/updatelist', async (req, res) => {
  console.log('updateList');

  let ip = await getClientIp(req);
  const user = req.body.data;
  if (ip !== '') {
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === req.host) {
      user.ip = 'server';
    } else {
      user.ip = ip;
    }
    res.json(returnDataInit({ userList:await redisHelper.getUserList(user), msgList:await redisHelper.getMsgList(user) }));
  } else {
    res.json(returnDataInit({}, '500', ReturnMsg.nullIP));
  }
});

router.post('/sendmsg', async (req, res) => {
  const { msg, key } = req.body.data;
  console.log('sendmsg' + key + ':' + msg.msg);

  if (key === null || msg === null) {
    res.json(returnDataInit({}, '500', ReturnMsg.nullReq));
  } else {
    const result = await redisHelper.pushMsg(key, msg);
    if (result === 0) {
      res.json(returnDataInit({}, '500', ReturnMsg.returnNull));
    } else {
      res.json(returnDataInit(result));
    }
  }
});

router.post('/syncmsg', async (req, res) => {
  const data = req.body.data;
  const result: any = await redisHelper.syncMsg(data);
  console.log(data);

  if (result) {
    res.json(returnDataInit(result));
  } else {
    res.json(returnDataInit({}, '500'));
  }
});

function returnDataInit(data: object, state: string = '200', msg: string = ReturnMsg.ok) {
  let returnData: ReturnData = { state, data: data, msg };
  return returnData;
}

let getClientIp = async function (req: any) {
  // let ip = req.host || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '';
  let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  let regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/g;
  if (ip) {
    const realIP = ip.split(':')[3];
    if (regexIP.test(realIP)) {
      return realIP;
    }
  }
};
