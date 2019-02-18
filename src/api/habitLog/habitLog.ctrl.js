const HabitLog = require("models/habitLog");
const moment = require("moment");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;

const PAGE = 10;

/**
 * ObjectId 검증
 */
exports.checkObjectId = (ctx, next) => {
  const { habitLog_id, habit_id } = ctx.params;

  // 검증 실패
  if (!ObjectId.isValid(habitLog_id) && !ObjectId.isValid(habit_id)) {
    ctx.status = 400; // 400 Bad Request
    return null;
  }

  return next(); // next를 리턴해야 ctx.body가 제대로 설정됩니다.
};

/**
 * 습관로그 등록
 * POST /api/habitLog
 * { habit_id }
 */
exports.write = async ctx => {
  const start_at = moment(ctx.query.start_at);
  const end_at = moment(ctx.query.end_at);

  const duration = moment.duration(end_at.diff(start_at));
  const days = duration.asDays();

  //질문!!!!
  for (let i = 0; i <= days; i++) {
    // 객체가 지닌 값들을 검증
    const schema = Joi.object().keys({
      habit_id: Joi.string().required() // 뒤에 required를 붙여 주면 필수 항목이라는 의미
    });

    // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
    const result = Joi.validate(ctx.request.body, schema);

    // 오류가 발생하면 오류 내용 응답
    if (result.error) {
      ctx.status = 400;
      ctx.body = result.error;
      return;
    }

    const { habit_id } = ctx.request.body;

    const habit_log = new HabitLog({
      habit_id,
      habit_date: start_at.add(1, "days")
    });

    try {
      await habit_log.save();
      ctx.body = habit_log;
    } catch (e) {
      ctx.throw(e, 500);
    }
  }
};

/**
 * 전체 습관로그 목록 조회
 * GET /api/habitLog?page=1
 */
exports.total_list = async ctx => {
  const page = parseInt(ctx.query.page || 1, PAGE);

  //잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  //데이터
  try {
    const habit_log = await HabitLog.find()
      .sort({ _id: -1 }) // 최신순으로
      .limit(PAGE) // 데이터제한
      .skip((page - 1) * PAGE) // 다음 페이지 데이터
      .lean() // JSON 형태로 전환
      .exec();

    ctx.body = {
      contents: habit_log,
      response: {
        code: ctx.status,
        message: ""
      }
    };
    //페이지 설정
    const count = await HabitLog.count().exec();
    ctx.set("Last-Page", Math.ceil(count / PAGE));
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 습관별 습관로그 목록 조회
 * GET /api/habitLog/:habit_id?page=1
 */
exports.list = async ctx => {
  const { habit_id } = ctx.params;
  const page = parseInt(ctx.query.page || 1, PAGE);

  //잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const habit_log = await HabitLog.find()
      .where("habit_id")
      .equals(habit_id)
      .limit(PAGE) // 데이터제한
      .skip((page - 1) * PAGE) // 다음 페이지 데이터
      .lean() // JSON 형태로 전환
      .exec();

    // user가 존재하지 않을 때
    if (!habit_log) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      contents: habit_log,
      response: {
        code: ctx.status,
        message: ""
      }
    };
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 특정 습관 제거
 * DELETE /api/habitLog/:habitLog_id
 */

exports.remove = async ctx => {
  const { habitLog_id } = ctx.params;
  try {
    await HabitLog.findByIdAndRemove(habitLog_id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 습관 정보 수정
 * PATCH /api/habitLog/:habitLog_id
 * {habit_id,habit_yn,habit_date}
 */
exports.update = async ctx => {
  const { habitLog_id } = ctx.params;
  try {
    const habit_log = await HabitLog.findByIdAndUpdate(
      habitLog_id,
      ctx.request.body,
      {
        new: true
      }
    ).exec();

    // user가 존재하지 않을 때
    if (!habit_log) {
      ctx.status = 404;
      return;
    }
    ctx.body = habit_log;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
