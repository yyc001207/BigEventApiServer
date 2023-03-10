const express = require('express')
require('module-alias/register')
const app = express()
const joi = require('joi')
// 配置跨域
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件
// 仅 application/x-www-form-urlencoded 格式
app.use(express.urlencoded({ extended: false }))

// 封装res.cc函数
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 用户路由模块
const userRouter = require('@/router/user')
app.use('/api', userRouter)

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen('3007', () => {
    console.log('api server running at http://127.0.0.1:3007');
})