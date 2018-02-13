import request from 'request-promise'
import fs from 'fs'
import * as _ from 'lodash'

const url = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: url + 'token?grant_type=client_credential',
  temporary: {
    upload: url + 'media/upload?',
    fetch: url + 'media/get?'
  },
  permanent: {
    upload: url + 'material/add_material?',
    uploadNews: url + 'material/add_news?',
    uploadNewsPic: url + 'media/uploadimg?',
    fetch: url + 'material/get_material?',
    del: url + 'material/del_material?',
    update: url + 'material/update_news?',
    count: url + 'material/get_materialcount?',
    batch: url + 'material/batchget_material?'
  }
}
class Wechat {
  constructor(opts) {
    this.opts = {...opts}
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
  }

  async request(options) {
    options = {...options, json: true}
    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.log(error, 'is request')
    }
  }

  async fetchAccessToken() {
    let data = await this.getAccessToken()
    if (!this.isValidAccessToken(data)) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }

  async updateAccessToken() {
    const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appSecret}`
    const data = await this.request({url: url})
    const now = (new Date().getTime())
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn
    return data
  }

  isValidAccessToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }

    const expiresIn = data.expires_in
    const now = (new Date().getTime())
    if (now < expiresIn) {
      return true
    } else {
      return false
    }
  }

  async handle(operation, ...args) {
    const tokenData = await this.fetchAccessToken()
    const options = this[operation](tokenData.access_token, ...args)
    const data = await this.request(options)

    return data
  }

  uploadMaterial(token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.upload

      _.extend(form, permanent)
    }

    if (type === 'pic') {
      url = api.permanent.uploadNewsPic
    }

    if (type === 'news') {
      url = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    let uploadUrl = url + 'access_token=' + token

    if (!permanent) {
      uploadUrl += '&type=' + type
    } else {
      if (type !== 'news') {
        form.access_token = token
      }
    }

    const options = {
      method: 'POST',
      url: uploadUrl,
      json: true
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }

    return options
  }

  fetchMaterial(token, mediaId, type, permanent) {
    let form = {}
    let fetchUrl = api.temporary.fetch

    if (permanent) {
      fetchUrl = api.permanent.fetch
    }

    let url = fetchUrl + 'access_token=' + token
    let options = { method: 'POST', url: url }

    if (permanent) {
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    } else {
      if (type === 'video') {
        url = url.replace('https://', 'http://')
      }

      url += '&media_id=' + mediaId
    }

    return options
  }

  deleteMaterial(token, mediaId) {
    const form = {
      media_id: mediaId
    }
    const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId

    return { method: 'POST', url: url, body: form }
  }

  updateMaterial(token, mediaId, news) {
    const form = {
      media_id: mediaId
    }

    _.extend(form, news)
    const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

    return { method: 'POST', url: url, body: form }
  }

  countMaterial(token) {
    const url = api.permanent.count + 'access_token=' + token

    return { method: 'POST', url: url }
  }

  batchMaterial(token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10

    const url = api.permanent.batch + 'access_token=' + token

    return { method: 'POST', url: url, body: options }
  }
}

export default Wechat
