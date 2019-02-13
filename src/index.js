// 미들웨어
require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const api = require("./api");

const app = new Koa();
const router = new Router();

const {
  PORT: port = 4000, // 값이 존재하지 않는다면 4000을 기본값으로 사용
  MONGO_URI: mongoURI
} = process.env;

mongoose.Promise = global.Promise; // Node의 Promise를 사용하도록 설정
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(e => {
    console.error(e);
  });

// 라우터 설정
router.use("/api", api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log("listening to port", port);
});

// 미들웨어 연습
// app.use(async (ctx, next) => {
//   // 미들웨어 : app.use로 등록하는 순서대로 처리
//   //ctx는 웹 요청과 응답 정보, next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수(프로미스)
//   console.log(1);
//   await next();
//   console.log("bye");
// });

// router.get("/about/:name?", ctx => {
//   // /파라미터가 있을 수도 있고 없을 수도 있다면 ?추가
//   const { name } = ctx.params;
//   // name의 존재 유무에 따라 다른 결과 출력
//   ctx.body = name ? `${name}의 소개` : "소개";
// });

// router.get("/posts", ctx => {
//   const { id } = ctx.query; // /posts/?id=10 같은 형식일 경우
//   // id의 존재 유무에 따라 다른 결과 출력
//   ctx.body = id ? `포스트 #${id}` : "포스트 아이디가 없습니다.";
// });
// // app 인스턴스에 라우터 적용
// app.use(router.routes()).use(router.allowedMethods());
