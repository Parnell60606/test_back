import express from 'express'
// import admin from '../middleware/admin.js'   // admin權限
// import * as auth from '../middleware/auth.js'  // jwt抓前台資料

// try
import content from '../middleware/content.js'


import {
    createOrder
} from '../controllers/orders.js'

// 建立路由
const router = express.Router()


// 還沒有jwt
// router.post('/', auth.jwt, createOrder)

// router.post('/order', createOrder)
router.post('/order', createOrder)

