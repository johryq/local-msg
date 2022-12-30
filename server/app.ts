import express, { Express, Router, Request, Response, NextFunction } from 'express';
import { router } from './router/index';

const app: Express = express();

// 解析res.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 跨域
app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

app.listen(3333, () => {
  console.log('run server in http://localhost:3333');
});
