const db = require('@/db/index')
const bcrypt = require('bcryptjs')
// 注册用户
exports.regUser = (req, res) => {
    const userInfo = req.body
    // 校验数据是否为空
    if (!userInfo.username || !userInfo.password) {
        return res.cc('用户名或密码不合法')
    }
    // 校验用户名
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userInfo.username, (err, results) => {
        if (err) return res.cc(err)
        // 判断用户名是否被占用
        if (results.length > 0) return res.cc("用户名已被占用")
        // 密码加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userInfo.username, password: userInfo.password }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册用户失败，稍后再试')
            res.cc('注册成功', 0)
        })
    })
}

// 登录
exports.login = (req, res) => {

}