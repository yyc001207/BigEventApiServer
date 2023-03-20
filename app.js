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
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 封装res.cc函数
app.use((req, res, next) => {
    console.log(req);
    console.log(req.method + " " + req.url + ' ' + new Date())
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 解析token的中间件
const expressJwt = require('express-jwt')
const config = require('./config')
app.use(expressJwt.expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api/] }))

// 用户路由模块
const userRouter = require('@/router/user')
app.use('/api', userRouter)

// 用户信息模块
const userInfoRouter = require('@/router/userInfo')
app.use('/my', userInfoRouter)

// 文章分类管理模块
const artCateRouter = require('@/router/artcate')
app.use('/my/article', artCateRouter)

// 文章分类管理模块
const articleRouter = require('@/router/article')
app.use('/my/article', articleRouter)
// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！请重新登录')
    // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen('3007', () => {
    console.log('api server running at http://127.0.0.1:3007');
})