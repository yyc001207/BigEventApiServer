const query = require('@/db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
// 注册用户
exports.regUser = async (req, res) => {
    const userInfo = req.body
    // 校验用户名
    const sqlStr = 'select * from ev_users where username=?'
    try {
        let result = await query(sqlStr, userInfo.username)
        // 判断用户名是否被占用
        if (result.length > 0) return res.cc("用户名已被占用")
        // 密码加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        const sql = 'insert into ev_users set ?'
        let results = await query(sql, { username: userInfo.username, password: userInfo.password })
        if (results.affectedRows !== 1) return res.cc('注册用户失败，稍后再试')
        res.cc('注册成功', 0)
    } catch (error) {
        res.cc(error)
    }
}

// 登录
exports.login = async (req, res) => {
    const userInfo = req.body
    const sqlStr = 'select * from ev_users where username=?'
    let result = await query(sqlStr, userInfo.username)
    try {
        // 用户是否存在
        if (result.length !== 1) return res.cc('未注册用户')
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
        if (!compareResult) {
            return res.cc('密码错误')
        }
        // 去除password与用户头像
        const user = { ...result[0], password: '', user_pic: '' }
        // 生成token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer ' + tokenStr
        })
    } catch (error) {
        res.cc(error)
    }



}