import Router from 'koa-router'
import Configs from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'

export const routes = app => {
  const router = new Router()

  router.all('/wechat', wechatMiddle(Configs.wechat, reply))

  // router.post('/wechat-hear', (ctx, next) => {

  // })

  app.use(router.routes())
    .use(router.allowedMethods())
}
