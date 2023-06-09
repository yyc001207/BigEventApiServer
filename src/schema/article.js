const joi = require('joi')

// 分别定义 标题、分类Id、内容、发布状态的校验规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(0).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    },
}

const id = joi.number().integer().min(1).required()
const pagenum = joi.number().min(1).required()
const pagesize = joi.number().min(1).required()
exports.get_article_schema = {
    body: {
        cate_id,
        state,
        pagenum,
        pagesize
    }
}

exports.update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        state,
    }
}


exports.id_article_schema = {
    params: {
        id
    }
}