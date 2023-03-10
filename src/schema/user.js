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