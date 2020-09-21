const express = require('express');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Guestbook, Post } = require('../models');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

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

router.post('/:id/image', upload.single('image'), (req, res) => {
    console.log('ㅎㅇㅎㅇ');
    console.log(req.file, req.body);
    res.send('ok');
    res.json({ url: `/image/${req.file.filename }`});
    
});

// const upload2 = multer();
// router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
//     try {
//         const profile_image = await
//     } catch (error) {
        
//     }
// })

router.post('/:id/guestbookCreate', isLoggedIn, async (req, res, next) => { 
  //여기서는 보내는 사람의 정보가 필요함.. req.user에 정보가 들어가 있음.
  try {
    console.log(req.user.email);
    console.log(req.params.id);
    const guestbook = await Guestbook.create({
      content: req.body.content,
      host_email: req.params.id, //주인
      writer_email: req.user.email, //적은 사람
      UserId: req.user.id, //적은사람
    });
    res.redirect(`/diary/${req.params.id}/guestbook`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/diarypost', isLoggedIn, async (req, res, next) => { 
  try {
    console.log(req.user.email);
    console.log(req.params.id);
    const post = await Post.create({
      content: req.body.content,
       nick: req.params.id,
      title: req.body.title,
    });
    res.redirect(`/diary/${req.params.id}/diary`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.use((req, res, next) => {
    //res.locals.user = req.user; //유저의 정보를 넘겨주기
    next();
});

router.get('/:id', async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { email: req.params.id } });
    if (user) {
      await res.render('diary_home', { user : user }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
    } else {
      res.status(404).send('no user');
    }
        
    } catch (error) {
        console.error(error);
        next(err);
    } 
});

router.get('/:id/diary', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } });
    const post = await Post.findAll({
      include: [{
        model: User,
      }],
      where: { nick: req.params.id },
      order: [['createdAt', 'DESC']], //맨위가 최근
    });
  if (user) {
    await res.render('diary_diary', { user : user, post: post }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});


router.get('/:id/guestbook', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //주인의 이메일
    // const guestbook = await Guestbook.findAll({ where: { host_email: req.params.id }}); //주인의 이메일
    const guestbook = await Guestbook.findAll({
      include: [{
        model: User,
      }],
      where: { host_email: req.params.id }, //주인의 홈피에 글이 적힌 유저의 정보를 같이 가져와달라..
      order: [['createdAt', 'DESC']], //맨위가 최근
    });
  if (user) {
    await res.render('diary_guestbook', { user : user, guestbook: guestbook }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});

router.get('/:id/images', async (req, res, next) => {
  try {
    alert('들어옴');
    const user = await User.findOne({ where: { email: req.params.id } });
  if (user) {
    await res.render('diary_images', { user : user }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});



// router.get('/upload', (req, res) => {
//     res.sendFile(path.join(__dirname))
// })

module.exports = router;