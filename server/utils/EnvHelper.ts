import * as dotenv from 'dotenv'

export class EnvHelper {
  static config = dotenv.config()  
  static redisIP = process.env.REDIS_IP  
}
