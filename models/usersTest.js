import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    // 欄位名稱
    account: {
        // 資料型態
        type: String,
        // 必填和錯誤訊息
        required: [true, '請輸入帳號'],
        // 長度限制
        maxlength: [20, '帳號長度不得超過20個字'],
        minlength: [4, '帳號長度不得少於4個字'],
        // 唯一性驗證
        unique: true,
        // 正則表達式驗證
        match: [/^[a-zA-Z0-9]+$/, '帳號只能包含英文、數字']
    },
    email: {
        type: String,
        required: [true, '請輸入信箱'],
        maxlength: [50, '信箱長度不得超過50個字'],
        minlength: [4, '信箱長度不得少於4個字'],
        unique: true,
        // 自訂驗證function
        validate: {
            validator (value) {
                return validator.isEmail(value)
            },
            message: '信箱格式錯誤'
        }
    }
}, {
    // 停用資料修改數
    versionKey: false
})

// mongoose.model(collection 名稱, Schema)
const users = mongoose.model('users', userSchema)

export default users
