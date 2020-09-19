exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 로그인 상태면 true, 아니면 false
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      //res.redirect(`/?error=${message}`);
      res.redirect(`/login_home`);
    }
  };