import Mongoose from 'mongoose'
import Configs from '../config'
import fs from 'fs'
import { resolve } from 'path'

const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
.filter(file => ~file.search(/^[^\.].*js$/))  // eslint-disable-line
.forEach(file => require(resolve(models, file)))

export const database = app => {
  Mongoose.set('debug', true)

  Mongoose.connect(Configs.db)

  Mongoose.connection.on('disconnected', () => {
    Mongoose.connect(Configs.db)
  })

  Mongoose.connection.on('error', err => {
    console.log(err)
  })

  Mongoose.connection.on('open', async => {
    console.log('Connected to MongoDB ', Configs.db)
  })
}
