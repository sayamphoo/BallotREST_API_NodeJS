const express = require('express')
const router = express.Router()
const database = require("../database/admin")
const multer = require('multer')

const upload = multer({ dest: `${process.cwd()}/database/files/temp` })

router.get('/', (req, res) => {
    res.send('GET route on things.');
});

//-----------อัปโหลดข้อมูลของผู้มีสิทธิ์เลือก
router.post('/uploadMember', upload.single('file'), async (req, res) => {
    res.send(await database.uploadMember(req))
})


//-----------อัปโหลดข้อมูลของของผู้ลงสมัคร
router.post('/uploadPolitical',
    upload.fields([{ name: 'img', maxCount: 1 }, { name: 'excel', maxCount: 1 }]),
    async (req, res) => {
        res.send(database.uploadPolitical(req))
    })

router.get('/update', async (req, res) => {
    database.getPolitical()
})

router.post('/login', async (req, res) => {
    let c = await database.login(req.body.user, req.body.pass)
    res.send(c)
})

module.exports = router