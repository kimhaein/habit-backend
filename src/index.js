const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

// app.use(async (ctx, next) => {
//   // 미들웨어 : app.use로 등록하는 순서대로 처리
//   //ctx는 웹 요청과 응답 정보, next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수(프로미스)
//   console.log(1);
//   await next();
//   console.log("bye");
// });

// 라우터 설정
router.get("/", ctx => {
  ctx.body = "홈";
});

router.get("/about/:name?", ctx => {
  // /파라미터가 있을 수도 있고 없을 수도 있다면 ?추가
  const { name } = ctx.params;
  // name의 존재 유무에 따라 다른 결과 출력
  ctx.body = name ? `${name}의 소개` : "소개";
});

router.get("/posts", ctx => {
  const { id } = ctx.query; // /posts/?id=10 같은 형식일 경우
  // id의 존재 유무에 따라 다른 결과 출력
  ctx.body = id ? `포스트 #${id}` : "포스트 아이디가 없습니다.";
});
// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log("listening to port 4000");
});
