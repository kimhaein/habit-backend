const Router = require("koa-router");
const users = require("./users");
const habit = require("./habit");
const habitLog = require("./habitLog");
const auth = require("./auth");

const api = new Router();

//사용자
api.use("/users", users.routes());
//습관
api.use("/habit", habit.routes());
//습관 로그
api.use("/habitLog", habitLog.routes());
//로그인&로그아웃
api.use("/auth", auth.routes());

// 라우터를 내보냅니다.
module.exports = api;
