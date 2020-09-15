const express = require('express');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Guestbook } = require('../models');

const router = express.Router();

// try {
//     fs.readFileSync('uploads');
// } catch (error) {
//     console.error('uploads 폴더가 없어 uploads폴더를 생성합니다.');
//     fs.mkdirSync('uploads');
// }

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/upload', isLoggedIn,  (req, res) => {
    console.log('ㅎㅇㅎㅇ');
    res.json({ url: `/image/${req.file.filename }`});
});

// const upload2 = multer();
// router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
//     try {
//         const profile_image = await
//     } catch (error) {
        
//     }
// })

router.use((req, res, next) => {
    res.locals.user = req.user; //유저의 정보를 넘겨주기
        
    next();
});

router.get('/', (req, res, next) => {
    try {
        res.render('diaryBase');
    } catch (error) {
        console.error(error);
        next(err);
    } 
});

router.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname))
})

module.exports = router;