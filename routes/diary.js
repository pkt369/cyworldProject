const express = require('express');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

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


module.exports = router;