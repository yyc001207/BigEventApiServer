const express = require('express')

const expressJoi = require('@escook/express-joi')

const { update_userInfo_schema, update_password_schema, update_avatar_schema } = require('@/schema/user')

const router = express.Router()

const routerHandler = require('@/router_handler/userInfo')

router.get('/userInfo', routerHandler.getUserInfo)

router.post('/userInfo', expressJoi(update_userInfo_schema), routerHandler.updateUserInfo)

router.post('/updatepwd', expressJoi(update_password_schema), routerHandler.updatePassword)

router.post('/update/avatar', expressJoi(update_avatar_schema), routerHandler.updateAvatar)

module.exports = router