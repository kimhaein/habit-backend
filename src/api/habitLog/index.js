const Router = require("koa-router");
const habitLogCtrl = require("./habitLog.ctrl");

const habitLog = new Router();

habitLog.post("/", habitLogCtrl.write); // 등록
habitLog.get("/", habitLogCtrl.total_list); // 전체 리스트
habitLog.get("/:habit_id", habitLogCtrl.list); //습관별 리스트
habitLog.delete(
  "/:habitLog_id",
  habitLogCtrl.checkObjectId,
  habitLogCtrl.remove
); //삭제
habitLog.patch(
  "/:habitLog_id",
  habitLogCtrl.checkObjectId,
  habitLogCtrl.update
); //수정

module.exports = habitLog;
