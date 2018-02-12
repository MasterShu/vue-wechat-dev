const tip = `我的地盘, 听我的!!\n不服来 <a href="https://baidu.com">百度</a>`

export default async (ctx, next) => {
  const message = ctx.wexin

  console.log(message)
  ctx.body = tip
}
