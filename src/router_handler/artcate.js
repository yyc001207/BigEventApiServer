const query = require('@/db/index')

// 获取分类列表
exports.getArtCateList = async (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    try {
        let result = await query(sql)
        if (result.length == 0) return res.cc('获取文章分类列表失败！')
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: result
        })
    } catch (error) {
        res.cc(error)
    }
}

// 新增分类
exports.addCates = async (req, res) => {
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    const sqlStr = 'insert into ev_article_cate set ?'
    const resetSql = 'update ev_article_cate set is_delete=0 where id=?'
    try {
        let result = await query(sql, [req.body.name, req.body.alias])
        if (result.length) {
            // 添加新文章时，可能查找到的之前删除的文章，将他恢复即可
            if (result[0].is_delete == 1) {
                let response = await query(resetSql, result[0].id)
                if (response.affectedRows !== 1) return res.cc('新增文章分类失败！')
                return res.cc('新增文章分类成功！', 0)
            }
            return res.cc('分类名称或别名被占用，请更换后重试！')
        }
        let results = await query(sqlStr, req.body)
        if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
        res.cc('新增文章分类成功！', 0)
    } catch (error) {
        res.cc(error)
    }
}

exports.deleteCateById = async (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    try {
        let result = await query(sql, req.params.id)
        if (result.affectedRows !== 1) return res.cc('删除文章分类失败')
        res.cc('删除文章分类成功！', 0)
    } catch (error) {
        res.cc(error)
    }
}

exports.getArtCateById = async (req, res) => {
    const sql = 'select * from ev_article_cate where id=?'
    try {
        let result = await query(sql, req.params.id)
        if (!result.length) return res.cc('查询失败')
        res.send({
            status: 0,
            message: '查询成功！',
            data: result[0]
        })
    } catch (error) {
        res.cc(error)
    }
}

exports.updateCateById = async (req, res) => {
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
    const sqlStr = 'update ev_article_cate set ? where id=?'
    try {
        let result = await query(sql, [req.body.id, req.body.name, req.body.alias])
        if (result.length) return res.cc('分类名或分类别名被占用')
        let results = await query(sqlStr, [req.body, req.body.id])
        if (results.affectedRows !== 1) return res.cc('修改分类失败')
        res.cc('更新文章分类成功', 0)
    } catch (error) {
        res.cc(error)
    }
}