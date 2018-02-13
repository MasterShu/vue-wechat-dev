import Router from 'koa-router'
import Configs from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'

export const routes = app => {
  const router = new Router()

  router.all('/wechat', wechatMiddle(Configs.wechat, reply))
  router.get('/upload', async (ctx, next) => {
    const mp = require('../wechat')
    const client = mp.getWechat()

    const data = await client.handle('uploadMaterial', 'pic', resolve(__dirname, '../../assets/img/logo.png'))
    console.log('is data', data)
  })
  // router.post('/wechat-hear', (ctx, next) => {

  // })

  app.use(router.routes())
    .use(router.allowedMethods())
}
