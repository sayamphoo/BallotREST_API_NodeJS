const express = require("express")
const app = express()
const router_admin = require("./router/router_admin")
const router_user = require('./router/router_user')
const database = require("./database/config")

database.connect()

app.use('/', router_user)
app.use('/admin', router_admin)

app.listen(process.env.PORT || 3000, () => {
    console.log("Connect port")
})


