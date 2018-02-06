import Router from 'koa-router'

export const routes = app => {
  const router = new Router()

  router.get('/wechat-hear', (ctx, next) => {

  })
  router.post('/wechat-hear', (ctx, next) => {

  })

  app.use(router.routes())
  app.use(router.allowMethods())
}
