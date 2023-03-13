const express = require('express')

const router = express.Router()

const routerHandler = require('@/router_handler/user')

const expressJoi = require('@escook/express-joi')

const { req_login_schema } = require('@/schema/user')

// 注册新用户
router.post('/reguser', expressJoi(req_login_schema), routerHandler.regUser)
// 登录
router.post('/login', expressJoi(req_login_schema), routerHandler.login)

module.exports = router