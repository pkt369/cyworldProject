
const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');


dotenv.config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

const app = express();

//passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);

//app.use(express.static('views'));
// app.use(express.static('images'));

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

//app.get('/',function(req,res){
//  res.send('<img src="a.jpg" alt="no image" width="250" height="180" >');
//});

// app.get('/', function(req, res){
//   fs.readFile('./views/home.html', function(error, data){
//     res.writeHead(200, { 'Content-Type': 'text/html' } );
//   } );
// } );


//app.get('/login',function(req,res){
  //res.send("로그인 성공!");
//}); 


app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});



app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/', pageRouter);
app.use('/auth', authRouter);
//app.use('/auth', authRouter);

// app.use((req, res, next) => {
//   const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//   error.status = 404;
//   next(error);
// });

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});




