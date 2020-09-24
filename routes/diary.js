const express = require('express');
const { isLoggedIn } = require('./middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { User, Guestbook, PhotoFolder, Post } = require('../models');


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

router.post('/:id/image', upload.single('profile_picture'), (req, res) => {
    
    console.log(req.file);
    const image = User.findOne({ where: req.params.id }).image;
    if(req.file === undefined){
      const profile = User.update({
        image: image,
        message: req.body.message,
      }, {
        where: { email: req.params.id },
      });  
    }else{
      const profile = User.update({  
        image: '/uploads/' + req.file.filename,
        message: req.body.message,
      }, {
        where: { email: req.params.id },
      });
    }
    
    res.redirect(`/diary/${req.params.id}/`);
});


router.post('/:id/guestbookCreate', isLoggedIn, async (req, res, next) => { 
  //여기서는 보내는 사람의 정보가 필요함.. req.user에 정보가 들어가 있음.
  try {
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


router.post('/:id/createFolder', isLoggedIn, async (req, res, next) => { 
  try {
    console.log('폴더');
    const user = await User.findOne({ where: { email: req.params.id }});
    const folder = await PhotoFolder.create({
        folder: req.body.folder_text,
        UserId: user.id,
    });
    console.log('폴더 생성 완료');
    res.redirect('/diary/'+user.email+'/success');
    
    

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


router.post('/:id/update_folder/:folder', isLoggedIn, async (req, res, next) => { 
  try {
    const user = await User.findOne({ where: { email: req.params.id }});
    const folder = await PhotoFolder.update({
      folder: req.body.folder_text,
    }, {
      where: { Userid: user.id, folder: req.params.folder },
    });
    res.redirect('/diary/'+user.email+'/success');
      
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.post('/:id/delete_folder/:folder', isLoggedIn, async (req, res, next) => { 
  try {
    const user = await User.findOne({ where: { email: req.params.id }});
    const folder = await PhotoFolder.destroy({
      where: { Userid: user.id, folder: req.params.folder },
    });
    res.redirect('/diary/'+user.email+'/change_photoFolder');
    
    
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
      const user = await User.findOne({ where: { email: req.params.id } }); //호스트의 주인
    if (user) {
      await res.render('diary_home', { user : user, enter: req.user }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
    } else {
      res.status(404).send('no user');
    }
        
    } catch (error) {
        console.error(error);
        next(err);
    } 
});

router.get('/:id/change_profile', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //호스트의 주인
  if (user) {
    await res.render('change_profile', { user : user, enter: req.user }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
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

router.get('/:id/photoAlbum', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //블로그주인
    const folders = await PhotoFolder.findAll({ where: { UserId: user.id }});
  if (user) {
    await res.render('diary_photoAlbum', { user : user, folders: folders }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});

router.get('/:id/change_photoFolder', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //블로그주인
    const folders = await PhotoFolder.findAll({ where: { UserId: user.id }});
  if (user) {
    await res.render('change_photoFolder', { user : user, folders: folders }); 
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});

router.get('/:id/create_folder', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //블로그주인
  if (user) {
    await res.render('create_folder', { user : user}); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});

router.get('/:id/update_folder/:folder', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //블로그주인
    const folders = await PhotoFolder.findOne({ where: { UserId: user.id, folder: req.params.folder }});
  if (user) {
    await res.render('update_folder', { user : user, folders: folders }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});

router.get('/:id/photo_upload', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.params.id } }); //블로그주인
    const folders = await PhotoFolder.findOne({ where: { UserId: user.id, folder: req.params.folder }});
  if (user) {
    await res.render('photo_upload', { user : user, folders: folders }); //넘겨줄때 데이터가 존재하면 여기로 들어오고 들어온다면 그정보를 넘겨주기.
  } else {
    res.status(404).send('no user');
  }
      
  } catch (error) {
      console.error(error);
      next(err);
  } 
});



router.get('/:id/success', async (req, res) => {
  res.render('success');
});





// router.get('/upload', (req, res) => {
//     res.sendFile(path.join(__dirname))
// })

module.exports = router;