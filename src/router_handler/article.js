const query = require('@/db/index')
const path = require('path')

// 发布新文章的处理函数
exports.addArticle = async (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    const articleInfo = {
        // 标题、内容、发布状态、所属分类的Id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.auth.id,
    }
    const sqlStr = 'select * from ev_article_cate where id=?'
    const sql = `insert into ev_articles set ?`
    try {
        let results = await query(sqlStr, req.body.cate_id)
        if (!results.length) return res.cc('没有该文章分类')
        let result = await query(sql, articleInfo)
        if (result.affectedRows !== 1) return res.cc('发布新文章失败！')
        res.cc('发布文章成功！', 0)
    } catch (error) {
        res.cc(error)
    }

}

// 获取文章列表处理函数
exports.getArticleList = async (req, res) => {
    const sqlAllLen = 'select * from ev_articles where state=?'
    const sqlAll = 'select * from ev_articles where state=? limit ? offset ?'
    const sqlStr = 'select * from ev_articles where cate_id=? and state=?'
    const sql = 'select * from ev_articles where cate_id=? and state=? limit ? offset ?'
    if (req.body.cate_id == 0) {
        try {
            let results = await query(sqlAllLen, req.body.state)
            if (!results.length) return res.cc('获取文章列表失败，可能是当前状态没有文章')
            let start = req.body.pagesize * (req.body.pagenum - 1)
            let result = await query(sqlAll, [req.body.state, req.body.pagesize, start])
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: result,
                total: results.length
            })
        } catch (error) {
            res.cc(error)
        }
    } else {
        try {
            let results = await query(sqlStr, [req.body.cate_id, req.body.state])
            if (!results.length) return res.cc(`获取文章列表失败，可能是当前分类没有${req.body.state}文章`)
            let start = req.body.pagesize * (req.body.pagenum - 1)
            let result = await query(sql, [req.body.cate_id, req.body.state, req.body.pagesize, start])
            res.send({
                status: 0,
                message: '获取文章列表成功！',
                data: result,
                total: results.length
            })
        } catch (error) {
            res.cc(error)
        }
    }
}


// 根据id删除文章
exports.deleteArticle = async (req, res) => {
    const sql = 'update ev_articles set is_delete=1 where id=?'
    try {
        let result = await query(sql, req.params.id)
        if (result.affectedRows !== 1) return res.cc('删除失败')
        res.cc('删除成功', 0)
    } catch (error) {
        res.cc(error)
    }
}

// 根据id获取文章详情
exports.getArticleById = async (req, res) => {
    const sql = 'select * from ev_articles where id=?'
    try {
        let result = await query(sql, req.params.id)
        if (!result.length) return res.cc('获取文章详情失败')
        res.send({
            status: 0,
            message: "获取文章成功！",
            data: result
        })
    } catch (error) {
        res.cc(error)
    }
}

// 根据id更新文章详情
exports.updateArticleById = async (req, res) => {
    const sqlStr = 'update ev_articles set ? where id=?'
    try {
        let result = await query(sqlStr, [req.body, req.body.id])
        if (result.affectedRows !== 1) return res.cc('修改文章失败')
        res.cc('更新文章成功', 0)
    } catch (error) {
        res.cc(error)
    }
}