const Router = require("koa-router");
const posts = require("./posts");
const users = require("./users");
const habit = require("./habit");
const habitLog = require("./habitLog");
// const rewords = require("./rewords");

const api = new Router();

//test
api.use("/posts", posts.routes());
//사용자
api.use("/users", users.routes());
//습관
api.use("/habit", habit.routes());
//습관 로그
api.use("/habitLog", habitLog.routes());

// 라우터를 내보냅니다.
module.exports = api;
