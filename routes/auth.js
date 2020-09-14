const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
//const { Model } = require('sequelize/types');

const router = express.Router();


router.post('/join', isNotLoggedIn, async (req, res, next) => { //회원가입
    const { email, nick, password } = req.body;
    try {
      const exUser = await User.findOne({ where: { email } });
      if (exUser) { // 이메일로 가입한 사용자 존재하면
        return res.redirect('/join?error=exist');
      }
      const hash = await bcrypt.hash(password, 12); //암호화
      await User.create({
        email,
        nick,
        password: hash,
        gender,
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  
  router.post('/login', isNotLoggedIn, (req, res, next) => { //로그인
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어
  });
  
  router.get('/logout', isLoggedIn, (req, res) => { //로그아웃
    req.logout();
    req.session.destroy(); //req.session의 정보 제거
    res.redirect('/');
  });
  
  module.exports = router;