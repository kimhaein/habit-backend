const Router = require("koa-router");
const habitCtrl = require("./habit.ctrl");

const habit = new Router();

habit.get("/", habitCtrl.total_list); //전체 리스트
habit.get("/:user_id", habitCtrl.list); // 고객별 리스트
habit.post("/", habitCtrl.write); // 등록
habit.get("/info/:habit_id", habitCtrl.read); //상세
habit.delete("/info/:habit_id", habitCtrl.checkObjectId, habitCtrl.remove); //삭제
habit.patch("/info/:habit_id", habitCtrl.checkObjectId, habitCtrl.update); //수정

module.exports = habit;
