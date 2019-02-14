const Router = require("koa-router");
const habitCtrl = require("./habit.ctrl");

const habit = new Router();

habit.get("/:user_id", habitCtrl.list); // 리스트
habit.post("/", habitCtrl.write); // 등록
habit.get("/:user_id/:habit_id", habitCtrl.read); //상세
habit.delete("/:user_id/:habit_id", habitCtrl.checkObjectId, habitCtrl.remove); //삭제
habit.patch("/:user_id/:habit_id", habitCtrl.checkObjectId, habitCtrl.update); //수정

module.exports = habit;
