const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');

dotenv.config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const diaryRouter = require('./routes/diary');
const morgan = require('morgan');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();

passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));


app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});


sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));
app.use('/views', express.static('views'));
app.use('/uploads', express.static('uploads'));
app.use('/photoAlbum', express.static('photoAlbum'));

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/diary', diaryRouter);

 app.use((req, res, next) => {
   const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
   error.status = 404;
   next(error);
 });

 app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  //res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});




