const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


const router = express.Router();

router.use((req, res, next) => { //라우터용 미들웨어 생성

  //모두 같은 템플릿 엔진에서 사용할 것임
  res.locals.user = req.user; // 이로 인해 넌적스에서 user객체를 통해 사용자 정보 접근 가능해짐
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => { //로그인 상태
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => { //로그인 안한 상태
  res.render('join', { title: '회원가입 - NodeBird' });
});


router.get('/', async (req, res, next) => {
  try {
    // const posts = await Post.findAll({
    //   include: {
    //     model: User,
    //     attributes: ['id', 'nick'],
    //   },
    //   order: [['createdAt', 'DESC']],
    // });
     res.render('home', {
       title: 'NodeBird',
    //   twits: posts,
     });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;
