const express = require('express')

const router = express.Router()

const routerHandler = require('@/router_handler/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

router.get('/cates', routerHandler.getArtCateList)

router.post('/addcates', expressJoi(add_cate_schema), routerHandler.addCates)

router.delete('/deletecate/:id', expressJoi(delete_cate_schema), routerHandler.deleteCateById)

router.get('/cates/:id', expressJoi(get_cate_schema), routerHandler.getArtCateById)

router.post('/updatecate', expressJoi(update_cate_schema), routerHandler.updateCateById)

module.exports = router