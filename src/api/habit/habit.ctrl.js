const Habit = require("models/habit");
const moment = require("moment");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;

const PAGE = 10;

/**
 * ObjectId 검증
 */
exports.checkObjectId = (ctx, next) => {
  const { user_id, habit_id } = ctx.params;

  // 검증 실패
  if (!ObjectId.isValid(user_id) || !ObjectId.isValid(habit_id)) {
    ctx.status = 400; // 400 Bad Request
    return null;
  }

  return next(); // next를 리턴해야 ctx.body가 제대로 설정됩니다.
};

/**
 * 습관 등록
 * POST /api/habit
 * {user_id, title, color, start_at, end_at, push_time, reward_img, reward_text, memo}
 */
exports.write = async ctx => {
  // 객체가 지닌 값들을 검증
  const schema = Joi.object().keys({
    user_id: Joi.string().required(), // 뒤에 required를 붙여 주면 필수 항목이라는 의미
    title: Joi.string().required(),
    color: Joi.string().required(),
    start_at: Joi.string().required(),
    end_at: Joi.string().required(),
    push_time: Joi.string(),
    reward_img: Joi.string(),
    reward_text: Joi.string(),
    memo: Joi.string()
  });

  // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
  const result = Joi.validate(ctx.request.body, schema);

  // 오류가 발생하면 오류 내용 응답
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const {
    user_id,
    title,
    color,
    start_at,
    end_at,
    push_time,
    reward_img,
    reward_text,
    memo
  } = ctx.request.body;

  const habit = new Habit({
    user_id,
    title,
    color,
    start_at,
    end_at,
    push_time,
    reward_img,
    reward_text,
    memo
  });

  try {
    await habit.save();
    ctx.body = habit;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 습관 목록 조회
 * GET /api/habit/:user_id?page=1
 */
exports.list = async ctx => {
  const page = parseInt(ctx.query.page || 1, PAGE);
  const user_id = ctx.params.user_id;

  //잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  //데이터
  try {
    const habits = await Habit.aggregate([
      { $match: { user_id: ObjectId(user_id) } },
      { $project: { _id: 1, color: 1, title: 1, created_at: 1 } },
      { $sort: { _id: -1 } },
      { $limit: PAGE },
      { $skip: (page - 1) * PAGE },
      {
        $lookup: {
          from: "habitlogs",
          localField: "_id",
          foreignField: "habit_id",
          as: "habit_log"
        }
      }
    ]);

    const habitCount = await Habit.count().exec();

    ctx.body = {
      contents: habits,
      response: {
        code: ctx.status,
        message: ""
      }
    };

    // 마지막 페이지 알려 주기
    // ctx.set은 response header를 설정
    ctx.set("Last-Page", Math.ceil(habitCount / PAGE));
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 습관 상세 정보
 * GET /api/habit/:user_id/:habit_id
 */
exports.read = async ctx => {
  const { habit_id } = ctx.params;
  try {
    const habit = await Habit.findById(habit_id).exec();

    // user가 존재하지 않을 때
    if (!habit) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      contents: habit,
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
 * DELETE /api/habit/:user_id/:habit_id
 */

exports.remove = async ctx => {
  const { habit_id } = ctx.params;
  try {
    await Habit.findByIdAndRemove(habit_id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 습관 정보 수정
 * PATCH /api/habit/:user_id/:habit_id
 * {user_id, title, color, start_at, end_at, push_time, reward_img, reward_text, memo}
 */
exports.update = async ctx => {
  const { habit_id } = ctx.params;
  try {
    const habit = await Habit.findByIdAndUpdate(habit_id, ctx.request.body, {
      new: true
    }).exec();

    // user가 존재하지 않을 때
    if (!habit) {
      ctx.status = 404;
      return;
    }
    ctx.body = habit;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
