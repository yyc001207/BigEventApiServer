const query = require('@/db/index')
const bcrypt = require('bcryptjs')
// 获取用户信息
exports.getUserInfo = async (req, res) => {
    // 创建查询用户信息sql语句
    const sqlStr = 'select id,username,nickname,email,user_pic from ev_users where id=?'
    let result = await query(sqlStr, req.auth.id).catch((error) => { res.cc(error) })
    if (result.length !== 1) return res.cc('获取用户失败！')
    res.send({
        status: 0,
        message: '获取用户信息成功',
        data: result[0]
    })
}

// 更新用户信息
exports.updateUserInfo = async (req, res) => {
    if (req.auth.id !== req.body.id) {
        return res.cc('没有修改他人信息权限')
    }
    // 创建更新用户信息的sql语句
    const sqlStr = 'update ev_users set ? where id=?'
    let result = await query(sqlStr, [req.body, req.body.id]).catch((error) => { res.cc(error) })
    if (result.affectedRows !== 1) return res.cc('修改用户信息失败！')
    return res.cc('修改用户信息成功', 0)
}

// 修改密码
exports.updatePassword = async (req, res) => {
    const sqlStr = 'select * from ev_users where id=?'
    try {
        let results = await query(sqlStr, req.auth.id)
        if (results.length !== 1) return res.cc('用户不存在')
        // 判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误')
        const sql = 'update ev_users set password=? where id=?'
        // 加密新密码
        const newPwd = bcrypt.hashSync(req.body.newPwd)
        let result = await query(sql, [newPwd, req.auth.id])
        if (result.affectedRows !== 1) return res.cc('修改用户信息失败！')
        res.cc('修改密码成功', 0)
    } catch (error) {
        res.cc(error)
    }
}

// 修改头像
exports.updateAvatar = async (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?'
    try {
        let result = await query(sql, [req.body.avatar, req.auth.id])
        if (result.affectedRows !== 1) return res.cc('修改用户头像失败！')
        res.cc('修改头像成功', 0)
    } catch (error) {
        rec.cc(error)
    }


}