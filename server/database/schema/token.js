import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TokenSchema = new Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TokenSchema.pre('save', function (next) {
  console.log('is this', this)
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec()
    return token
  },

  async saveAccessToken(data) {
    console.log(data)
    let token = await this.findOne({
      name: 'access_token'
    }).exec()
    if (token) {
      token.token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }
    try {
      await token.save()
    } catch (e) {
      console.log('存储失败')
      console.log(e)
    }
    return data
  }
}

// eslint-disable-next-line
const Token = mongoose.model('Token', TokenSchema)
