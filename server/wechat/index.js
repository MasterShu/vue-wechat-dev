import mongoose from 'mongoose'
import Configs from '../config'
import Wechat from '../wechat-lib'

const Token = mongoose.model('Token')

const WechatConfig = {
  wechat: {
    appID: Configs.wechat.appID,
    appSecret: Configs.wechat.appSecret,
    token: Configs.wechat.token,
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data)
  }
}

export const getWechat = () => {
  const wechatClient = new Wechat(WechatConfig.wechat)
  return wechatClient
}
