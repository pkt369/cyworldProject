const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => { //serializeUser: 로그인 시 실행, req.session 객체에 어떤 데이터 저장할지 정하는 메서드
    done(null, user.id);
  });

   passport.deserializeUser((id, done) => { //deserializeUser: 매 요청 시 실행
    User.findOne({where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  }); 
  local(); 
};
