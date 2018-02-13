const tip = `我的地盘, 听我的!!\n不服来 <a href="https://baidu.com">百度</a>`

export default async (ctx, next) => {
  const message = ctx.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取关了')
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + ' photos sent'
    } else if (message.Event === 'CLICK') {
      if (message.EventKey === 'bt') {
        console.log(1)
        // ctx.body = bt
        console.log(2)
      }
    } else {
      ctx.body = tip
    }
    console.log(3)
  } else if (message.MsgType === 'text') {
    // if (message.Content === '更新按钮吧') {
    //   const menu = require('./menu').default
    //   let menuMsg = '创建成功'

    //   try {
    //     await client.handle('delMenu')
    //   } catch (e) {
    //     console.log('删除菜单失败')
    //     console.log(e)

    //     menuMsg = '删除失败'
    //   }

    //   try {
    //     await client.handle('createMenu', menu)
    //   } catch (err) {
    //     console.log('创建菜单失败')
    //     console.log(err)
    //     menuMsg += menuMsg
    //   }

    //   ctx.body = menuMsg
    // } else if (message.Content === 'bt' || message.Content === '3') {
    //   ctx.body = bt
    // }
    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/xAyPZaQZmH09wYBjskFEQSoM4te0SnXR9YgbJxlDPVPDZtgLCW5FacWUlxFiaZ7d8vgGY6mzmF9aRibn05VvdtTw/0',
      url: message.Url
    }]
  }

  console.log(message)
  // ctx.body = tip
}
