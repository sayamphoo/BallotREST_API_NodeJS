const encryption = require('../encryption/encryption')
const xlsx = require('../excel/xlsx')
const date = require('./date/date')
const fs = require('fs')
const con = require('./config')
const createObject = require('../createobject/createobject')
const { resolve } = require('path')

const EXP = module.exports

//------------------------------------อัปโหลดข้อมูลที่ได้จาก excel to Database
EXP.uploadMember = async (info) => {
     let file = info.file
     let data = xlsx.readFile(file.path);
     let affiliation = info.body.affiliation;
     (async () => {
          //------------------------------------อัพข้อมูลที่ได้จาก excel
          let values_sql_member = []
          for (let x in data) {
               let hash = await encryption.encrypt(`${con.escape(data[x].pass)}`)
               values_sql_member.push([
                    `${con.escape(affiliation)}`,
                    `${con.escape(data[x].name)}`,
                    `${con.escape(data[x].username)}`,
                    `${con.escape(hash)}`,
                    `false`
               ])
          }
          let sql_member = `INSERT INTO member (affiliation,name,user,pass,state) VALUES ?`
          con.query(sql_member, [values_sql_member])

          //------------------------------------บันทึกไฟล์ข้อมูลที่ได้รับมา
          let oldpath = file.path
          let newpath = `${process.cwd()}/database/files/${Date.now()}.xlsx`;
          fs.rename(oldpath, newpath, function (err) {
               if (err) throw err;
               //------------------------------------อัปเดทข้อมูล Log
               let sql = `INSERT INTO upload_log (date,path,changer) VALUES ?`
               let values_upload_log = [[
                    `${date.getDateNow()}`,
                    `${newpath}`,
                    `Sayamphoo`
               ]]
               con.query(sql, [values_upload_log])
          })
     })()
     return data
}

//----------------------------------อัปโหลดข้อมูลของผู้ลงสมัคร----------------
EXP.uploadPolitical = (info) => {
     let { files, body } = info
     let img = files['img'][0]
     let excel = files['excel'][0]

     //////////---------เพื่อให้โปรแกรมทำงานแบบต่อคิว
     /////////----------บันทึกไฟล์ -----> บันทึกตำแหน่งไฟล์ลงฐานข้อมูล ---> บันทึกข้อมูลผู้ลงสมัคร

     new Promise((resolve) => {
          /////////----------บันทึกไฟล์
          let oldpath = img.path
          let newpath = `${process.cwd()}/database/img/${Date.now()}.png`;
          fs.rename(oldpath, newpath, function (err) {
               if (err) throw err;
               resolve(newpath) //path img
          })
     }).then((path) => {
          /////////----------บันทึกตำแหน่งไฟล์ลงฐานข้อมูล
          new Promise((resolve) => {
               let sql = `INSERT INTO political (affiliation,img,number) VALUES ?`
               let values = [[
                    `${con.escape(body.affiliation)}`,
                    `${con.escape(path)}`, //path img
                    `${con.escape(body.number)}`
               ]]
               con.query(sql, [values], (err, result) => {
                    if (err) throw err
                    resolve(result.insertId)
               })
          }).then((political_id) => {

               /////////---> บันทึกข้อมูลผู้ลงสมัครลงงฐานข้อมูล โดยมี id

               let sql = `INSERT INTO party_member (political,name,seat) VALUES ?`
               let values = []
               xlsx.readFile(excel.path).forEach((item) => {
                    values.push(
                         [`${con.escape(political_id)}`,
                         `${con.escape(item.name)}`,
                         `${con.escape(item.seat)}`]
                    )
               })
               con.query(sql, [values])
               console.log(values)
          })
     })

     return { "sas": "sas" }
}

EXP.getPolitical = async () => {
     sql = 'SELECT * FROM political INNER JOIN party_member ON political.id = party_member.political'
     con.query(sql, (err, result) => {
          if (err) throw err
          console.log(result)
     })
}

//--------------------login--------------
EXP.login = async (user, pass) => {
     let sql = `SELECT * FROM member WHERE user = ${con.escape(user)} `

     return new Promise((resolve, reject) => {
          con.query(sql, async (err, result) => {
               if (err) throw err
               let len = result.length
               if (len == 1) {
                    let hash = result[len - 1].pass
                    let state = await encryption.decode(pass, hash)
                    resolve(createObject.login(state))
               } else {
                    resolve(createObject.login())
               }
          })
     })
}