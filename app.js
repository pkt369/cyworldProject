const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const express = require('express');

const nunjucks = require('nunjucks');

const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

const app = express();

//passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);

//app.use(express.static('views'));

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
//app.listen(3000,function(){
//  console.log("포트 3000에서 응답함");
//  //포트 3000에 연결이 된 경우 실행하는 콜백함수.
//});
 




//  http.createServer(async (req, res) => {
//    try {
//      const data = await fs.readFile('views/home.html');
//      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//      res.end(data);
//    } catch (err) {
//      console.error(err);
//      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
//      res.end(err.message);
//    }
//  })
//    .listen(8081, () => {
//      console.log('8081번 포트에서 서버 대기 중입니다!');
//    });

