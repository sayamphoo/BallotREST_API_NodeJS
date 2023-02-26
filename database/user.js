const con = require('../database/config')
const encryption = require('../encryption/encryption')
const EXP = module.exports


//สำหรับ User  ระบบเข้าสู่ระบบ

EXP.loginMember = (user, pass) => {
    let state = true
    const sql = "SELECT * FROM member" + `WHERE user = '${con.escape(user)}'`
    con.query(sql, async (err, result) => {
        for (let i = 0; i < result.length; i++) {
            state = await encryption.decode(`${pass}`, result[i].pass)
            console.log("sa" + state)
        }
    })
}
