const express = require('express')

const router = express.Router()

const routerHandler = require('@/router_handler/article')
// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// ​创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const { add_article_schema, get_article_schema, id_article_schema, update_article_schema } = require('@/schema/article')

router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), routerHandler.addArticle)

router.get('/list', expressJoi(get_article_schema), routerHandler.getArticleList)

router.delete('/delete/:id', expressJoi(id_article_schema), routerHandler.deleteArticle)

router.get('/:id', expressJoi(id_article_schema), routerHandler.getArticleById)

router.post('/edit', upload.single('cover_img'), expressJoi(update_article_schema), routerHandler.updateArticleById)

module.exports = router