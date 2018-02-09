import Router from 'koa-router'
import Configs from '../config'
import sha1 from 'sha1'

export const routes = app => {
  const router = new Router()

  router.get('/wechat', (ctx, next) => {
    const token = Configs.wechat.token
    const {signature, nonce, timestamp, echostr} = ctx.query
    console.log(ctx.query)
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    console.log(sha)
    console.log(echostr)
    console.log(sha === signature)
    if (sha === signature) {
      ctx.body = echostr
    } else {
      ctx.body = 'Failed'
    }
  })
  // router.post('/wechat-hear', (ctx, next) => {

  // })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
