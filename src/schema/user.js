// 注册登录验证规则
const joi = require('joi')

const username = joi.string().alphanum().min(3).max(10).required()

const password = joi.string().pattern(/^[\S]{6,12}/).required()

exports.req_login_schema = {
    body: {
        username,
        password
    }
}

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.update_userInfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    }
}
// 验证头像规则
const avatar = joi.string().dataUri().required()

exports.update_avatar_schema = {
    body: {
        avatar,
    },
}