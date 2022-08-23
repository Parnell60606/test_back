// import users from '../models/users.js';

//  // 密碼加密套件 (避免被駭看光光)
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import products from '../models/products.js'



// 0621版本
// 註冊  creat new user
/* export const register = async (req, res) => {
   try {
      let result = await users.create(req.body)
        // 將 mongoose 文件格式轉成一般 JSON 物件
      result = result.toObject()
      delete result.password
      res.status(200).json({ success: true, message: '', result })
   } catch (error) {
      if (error.name === 'ValidationError') {
         const key = Object.keys(error.errors)[0]
         const message = error.errors[key].message
         res.status(400).json({ success: false, message })
      } else if (error.name === 'MongoError' && error.code === 11000) {
         res.status(409).json({ success: false, message: '帳號已被使用' })
      } else {
         res.status(500).json({ success: false, message: '新增失敗' })
      }
   }
}
*/



// 0620版本   controller放在index
/*
export const register = async (req, res) => {
   try {
      if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 20) {
            res.status(400).json({ success: false, message: '密碼格式錯誤' })
            return
      }

      req.body.password = bcrypt.hashSync(req.body.password, 10)
      await users.create(req.body)
        // 設定回應狀態碼200，並把新增的資料回傳
        // res.status(200)
        // res.json(result)
      res.status(200).json({ success: true, message: '' })
   } catch (error) {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
   }
} */




/* copy */

import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' // passport-jwt套件中有，不用另外安裝

// 註冊 (O)
export const register = async (req, res) => {
    const password = req.body.password
    // 驗證密碼
    if (!password) {
        return res.status(400).send({ success: false, message: '缺少密碼欄位' })
    }
    if (password.length < 5) {
        return res.status(400).send({ success: false, message: '密碼必須 7 個字以上（不含七）' })
    }
    if (password.length > 16) {
        return res.status(400).send({ success: false, message: '密碼必須 16 個字以下' })
    }
    if (!password.match(/^\w[^\W]+$/)) {
        return res.status(400).send({ success: false, message: ' (controllers) 密碼格式錯誤' })
    }


    // bcrypt 密碼加密
    // 因為密碼會存成這樣："$2b$10$643StLWhLHl2dlcMjXsGWOgyUVLiSHdL..bTaqIozwS8GzFEzVP.G"  所以schema的密碼驗證不能放正則表達式(和其他字數限制)

    //                bcrypt . sync同步hash寫法 (password, 加鹽次數)
    req.body.password = bcrypt.hashSync(password, 10)






    try {
        // 創建帳號
        await users.create(req.body)
        res.status(200).send({ success: true, message: '' })

    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            const key = Object.keys(error.errors)[0]
            const message = error.errors[key].message
            return res.status(400).send({ success: false, message })
        } else if (error.name === 'MongoServerError' && error.code === 11000) {
            res.status(400).send({ success: false, message: '帳號已存在' })
        } else {
            res.status(500).send({ success: false, message: '伺服器錯誤' })
        }
    }
}




// 0627   登入
/* // 放_id就好，不要把重要的東西放裡面
export const login = async (req, res) => {
    try {
    // 簽入jwt
    // jwt.sign(資料, secret, 設定)
        const token = jwt.sign({ _id: req.user._id.toString() }, process.env.JWT_SECRET,
     {expiresIn: '7 days' } // 多久後過期
        )
        req.user.tokens.push(token)
        await req.user.save()
    //                   (登入成功的話回傳token)
        res.status(200).json({ success: true, message: '', token })
    } catch (error) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
}
// 登入成功後，使用者做任何操作都要帶token (才能知道是誰)
// jwt 功能類似 cookie，但是cookie比較麻煩，現在都用jwt了 */


// 0704 登入
// 放_id就好，不要把重要的東西放裡面
export const login = async (req, res) => {
    try {
        // 簽入jwt
        // jwt.sign(資料, secret, 設定)
        const token = jwt.sign({ _id: req.user._id.toString() }, process.env.JWT_SECRET,
            { expiresIn: '7 days' } // 多久後過期
        )
        req.user.tokens.push(token)
        await req.user.save()


        // 登入成功的話回傳前台要用的資料(含token)
        res.status(200).send({
            success: true,
            message: '',
            result: {
                token,
                account: req.user.account,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
}
// 登入成功後，使用者做任何操作都要帶token (才能知道是誰)
// jwt 功能類似 cookie，但是cookie比較麻煩，現在都用jwt了






// 0627 登出　最後一版

export const logout = async (req, res) => {
    try {
        // 把jwt從資料庫撤銷
        //                                   (token跟回傳的token一樣就踢掉，不一樣就留著)
        req.user.tokens = req.user.tokens.filter(token => token !== req.token)
        await req.user.save()
        res.status(200).json({ success: true, message: '' })
    } catch (error) {
        res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
}

// 0704  token過期  舊換新   (最後一版)

export const extend = async (req, res) => {
    try {
        // idx = 舊 token 的 index
        const idx = req.user.tokens.findIndex(token => token === req.token)
        // 簽新的 token
        const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
        // 把舊token換成新token
        req.user.tokens[idx] = token
        // 儲存
        await req.user.save()
        // 把新的token傳出去
        res.status(200).send({ success: true, message: '', result: token })
    } catch (error) {
        res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
}



// get
// get跟 delete不能放body
// get不能用  req.body  (因為用postman傳進去的資料不是用body是用路由傳的)
// 所以是 req.params

export const getUserId = async (req, res) => {
    try {
        // 傳該會員的所有資料(除了password)
        const result = await users.findById(req.params.id)
        if (!result) {
            res.status(404).json({ success: false, message: '找不到資料' })
        } else {
            res.status(200).json({ success: true, message: '', result })
        }
    } catch (error) {
        console.log(error)
        if (error.name === 'CastError') {
            res.status(404).json({ success: false, message: '找ㄅ到資料 (CastError)' })
        } else {
            res.status(500).json({ success: false, message: '查詢失敗' })
        }
    }
}


// json
// 用token抓
export const getData = (req, res) => {
    res.status(200).json({
        success: true,
        message: '',
        // 資料已經在 驗證(passport.js) 時被存進 req.user 了，所以直接用就好
        result: {
            _id: req.user._id,
            account: req.user.account,
            avatar: req.user.avatar
        }
    })
}





// send
// 抓會員  0718版
export const getUser = (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: '',
            result: {
                account: req.user.account,
                email: req.user.email,
                role: req.user.role,
                pastOrders: req.user.pastOrders
            }
        })
    } catch (error) {
        res.status(500).send({ success: false, message: '伺服器錯誤(getUser)' })
    }
}




// 用會員id查會員  0621   (O)
// 0621 的user schema : account, email, password, cart 四個欄位
/* export const getUser = async (req, res) => {
    try {
        // 傳該會員的所有資料(除了password)
        const result = await users.findById(req.params.id, ' userName email phone ')
        if (!result) {
            res.status(404).json({ success: false, message: '找不到資料' })
        } else {
            res.status(200).json({ success: true, message: '', result })
        }
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(404).json({ success: false, message: '找ㄅ到資料 (CastError)' })
        } else {
            res.status(500).json({ success: false, message: '查詢失敗' })
        }

    }
} */

// NEW
/* export const getUser = (req, res) => {
    res.status(200).json({
        success: true,
        message: '',
        result: {
            _id: req.user._id,
            account: req.user.account,
            avatar: req.user.avatar
        }
    })
} */

// 加訂單 0621版

/* export const addCart = async (req, res) => {
    try {
        // let result = await users.findByIdAndUpdate(req.params.id, {
        //   $push: { cart: req.body }
        // }, { new: true, runValidators: true })
        // if (!result) {
        //   res.status(404).json({ success: false, message: '找不到資料' })
        // } else {
        //   result = result.toObject()
        //   delete result.password
        //   res.status(200).json({ success: true, message: '', result })
        // }

        // 檢查有沒有指定商品
        const product = await products.findById(req.body.p_id)
        if (!product) {
            res.status(404).json({ success: false, message: '找不到商品' })
            return
        }
        // 用 ID 找使用者
        const result = await users.findById(req.params.id, '-password')
        if (!result) {
            res.status(404).json({ success: false, message: '找不到使用者' })
            return
        }
        // 尋找使用者的購物車有沒有這個商品
        const idx = result.cart.findIndex(item => item.p_id.toString() === req.body.p_id)
        if (idx === -1) {
            // 沒有就 push 進去
            result.cart.push(req.body)
        } else {
            // 有的話，增加數量
            result.cart[idx].quantity += req.body.quantity
        }
        // 保存
        await result.save()
        res.status(200).json({ success: true, message: '', result })
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            const key = Object.keys(error.errors)[0]
            const message = error.errors[key].message.replace('Validation failed: ', '').split(':').slice(1).join().trim()
            console.log(message)
            res.status(400).json({ success: false, message })
        } else if (error.name === 'CastError') {
            res.status(404).json({ success: false, message: '找不到資料' })
        } else {
            res.status(500).json({ success: false, message: '查詢失敗' })
        }
    }
}
 */
