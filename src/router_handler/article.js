const query = require('@/db/index')
const path = require('path')
const { getArtCateById } = require('./artcate')

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

const getArticleListBysql = async (req, res, sql, total) => {
    const sqlStr = 'select * from ev_article_cate where id=? and is_delete=0'// 获取对应cate_id的分类名
    const sqlAll = 'select * from ev_article_cate where id<>?'// 获取所有分类名
    let start = req.body.pagesize * (req.body.pagenum - 1)// 计算分页开始值
    let result// 保存查找文章表的返回值
    let cate_name_list// 保存查找文章分类表的返回值
    if (req.body.cate_id == 0) {
        result = await query(sql, [req.body.state, req.body.pagesize, start])
        cate_name_list = await query(sqlAll, req.body.cate_id)
    } else {
        result = await query(sql, [req.body.cate_id, req.body.state, req.body.pagesize, start])
        cate_name_list = await query(sqlStr, req.body.cate_id)
    }
    const data = []// 保存发送的数据
    let cateName// 分类名
    result.forEach(item => {
        req.body.cate_id == 0 ? cate_name_list.forEach(item2 => {
            if (item.cate_id == item2.id) {// 匹配cate_id与分类表中的id获取分类名
                cateName = item2.name
            }
        }) : cateName = cate_name_list[0].name
        data.push({
            id: item.id, title: item.title, state: item.state, pub_date: item.pub_date, cate_name: cateName
        })
    });
    res.send({
        status: 0,
        message: '获取文章列表成功！',
        data,
        total
    })
}

// 获取文章列表处理函数
exports.getArticleList = async (req, res) => {
    /* 
        当前端返回cate_id = 0时，表示查找所有分类文章
    */
    const sqlAllLen = 'select * from ev_articles where state=? and is_delete=0'// 查找所有分类文章
    const sqlAll = 'select * from ev_articles where is_delete=0 and state=? limit ? offset ?'// 分页查找所有分类文章
    const sqlStr = 'select * from ev_articles where cate_id=? and state=? and is_delete=0'// 查找指定分类文章
    const sql = 'select * from ev_articles where is_delete=0 and cate_id=? and state=? limit ? offset ?'// 分页查找分类文章
    try {
        if (req.body.cate_id == 0) { // 查找所有分类文章获取数组长度，为0返回失败
            let results = await query(sqlAllLen, req.body.state)
            if (!results.length) return res.cc('获取文章列表失败，可能是当前状态没有文章')
            getArticleListBysql(req, res, sqlAll, results.length)
        } else {// 查找指定分类文章获取数组长度，为0返回失败
            let results = await query(sqlStr, [req.body.cate_id, req.body.state])
            if (!results.length) return res.cc(`获取文章列表失败，可能是当前分类没有${req.body.state}文章`)
            getArticleListBysql(req, res, sql, results.length)
        }
    } catch (error) {
        res.cc(error)
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