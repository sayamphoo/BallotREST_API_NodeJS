const mysql = require('mysql')
const EXP = module.exports

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1911669199",
    database: "vote"
})

EXP.connect = () => {
    con.connect((err) => {
         if (err) throw err
         console.log("Connect database complete")
    })
}

module.exports = con