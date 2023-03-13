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
    const sql = `insert into ev_articles set ?`
    let result = await query(sql, articleInfo).catch((error) => { res.cc(error) })
    if (result.affectedRows !== 1) return res.cc('发布新文章失败！')
    res.cc('发布文章成功！', 0)
}

// 获取文章列表处理函数
exports.getArticleList = async (req, res) => {
    try {
        const sqlStr = 'select * from ev_articles where cate_id=? and state=?'
        let results = await query(sqlStr, [req.body.cate_id, req.body.state])
        if (!results.length) return res.cc('获取文章列表失败')
        let total = results.length
        const sql = 'select * from ev_articles where cate_id=? and state=? limit ? offset ?'
        let start = req.body.pagesize * (req.body.pagenum - 1)
        let result = await query(sql, [req.body.cate_id, req.body.state, req.body.pagesize, start])
        res.send({
            status: 0,
            message: '获取文章列表成功！',
            data: result,
            total
        })
    } catch (error) {
        res.cc(error)
    }
}