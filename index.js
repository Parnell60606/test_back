import 'dotenv/config'
// 開網站即可接收資料
import express from 'express'
// mongoDB操作工具
import mongoose from 'mongoose'
// 跨域套件

import cors from 'cors'

import usersRouter from './routes/users.js'
// import ordersRouter from './routes/users.js'

import './passport/passport.js'




// 用INDEX測試controll
// import users from './models/users.js'



// 連接mondoDB (網址放在.env)
// DB_URL是環境變數可以自己設
mongoose.connect(process.env.DB_URL)

const app = express()


// 跨域請求 (放第一關)
app.use(cors({
    origin(origin, callback) {
        if (origin === undefined || origin.includes('github') || origin.includes('localhost') || origin.includes('localhost')) {
            callback(null, true)
        } else {
            callback(new Error('Not Allowed'), false)
        }
    }
}))

// 讀取 req.body 的 json (抓post資料)
app.use(express.json())

app.use((_, req, res, next) => {
    res.status(400).send({ success: false, message: '請求格式錯誤' })
})

// http://localhost:4000/users   這個網址後面可以對user資料庫做動作 
app.use('/users', usersRouter)
// app.use('/orders', ordersRouter)



// 上面不符合的所有請求方式及所有路徑顯示 404
app.all('*', (req, res) => {
    res.status(404).send({ success: false, message: '找不到 404 (index)' })
})


// 請求方法 (post進 根目錄 的請求會引用這個function)
// app.post('/')



/* app.post('/', async (req, res) => {
    try {
        const result = await users.create({
            account: req.body.account,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone
        })
        // 設定回應狀態碼200，並把新增的資料回傳
        // res.status(200)
        // res.json(result)
        res.status(200).json({ success: true, message: '', result })
    } catch (error) {
        if (error.name === 'ValidationError') {
            // 取出第一個驗證失敗的欄位名稱
            const key = Object.keys(error.errors)[0]
            // 用取出的欄位名稱取出錯誤訊息
            const message = error.errors[key].message
            res.status(400).json({ success: false, message })
        } else if (error.name === 'MongoServerError' && error.code === 11000) {
            res.status(409).json({ success: false, message: '帳號已存在' })
        } else {
            res.status(500).json({ success: false, message: '伺服器錯誤(index)' })
        }
    }
}) */



/* 
app.get('/', async (req, res) => {
    // find (查詢條件)
    try {
        const result = await users.find()
        res.status(200).json({ success: true, message: '', result })
    } catch (error) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
}) */





// app.get('/', async (req, res) => {
//     // find (查詢條件)
//     try {
//         const result = await users.find(req.params.id, '-password').populate('cart.p_id')
//         if (!result) {
//             res.status(404).json({ success: false, message: '找不到資料' })
//         } else {
//             res.status(200).json({ success: true, message: '', result })
//         }
//     } catch (error) {
//         if (error.name === 'CastError') {
//             res.status(404).json({ success: false, message: '找不到資料' })
//         } else {
//             res.status(500).json({ success: false, message: '查詢失敗' })
//         }
//     }
// })



/* app.delete('/:id', async (req, res) => {
    try {
        // params 路由參數   http://localhost:4000/asdasd    <<asdasd就會是路由參數
        const result = await users.findByIdAndDelete(req.params.id)
        if (result) {
            res.status(200).json({ success: true, message: '' })
        } else {
            res.status(404).json({ success: false, message: '找不到資料' })
        }
    } catch (error) {
        // id 格式錯誤
        if (error.name === 'CastError') {
            res.status(400).json({ success: false, message: '資料格式錯誤' })
        } else {
            res.status(500).json({ success: false, message: '伺服器錯誤' })
        }
    }
})
 */




// 監聽 (跟line機器人一樣)
app.listen(process.env.PORT || 4000, () => {
    console.log('Server States')
})
