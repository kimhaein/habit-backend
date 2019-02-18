const Router = require("koa-router");
const habitLogCtrl = require("./habitLog.ctrl");

const habitLog = new Router();

habitLog.get("/", habitLogCtrl.list); // 리스트
habitLog.post("/", habitLogCtrl.write); // 등록
habitLog.get("/:user_id", habitLogCtrl.read); //고객별 상세
// habitLog.delete("/:id", habitLogCtrl.checkObjectId, habitCtrl.remove); //삭제
// habitLog.patch("/:id", habitLogCtrl.checkObjectId, habitCtrl.update); //수정

module.exports = habitLog;
