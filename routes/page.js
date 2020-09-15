const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { User } = require('../models');

const router = express.Router();

router.use((req, res, next) => { //라우터용 미들웨어 생성

  //모두 같은 템플릿 엔진에서 사용할 것임
  res.locals.user = req.user; // 이로 인해 넌적스에서 user객체를 통해 사용자 정보 접근 가능해짐
  next();
});

router.get('/login_home', isLoggedIn, (req, res) => { //로그인 상태
  res.render('login_home');
});

router.get('/join', isNotLoggedIn, (req, res) => { //로그인 안한 상태
  res.render('join');
});


router.get('/', async (req, res, next) => {
  
    res.render('home') } );

module.exports = router;
