import {Response} from 'express'

declare module 'express'{
  export interface Response{
    sjon: {
      state: string,
      data: object,
      msg: string
    }
  }
}
