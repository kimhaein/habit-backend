const crypto = require("crypto");
const Users = require("./models/users");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;

const PAGE = 10;

/**
 * ObjectId 검증
 */
exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  console.log(id);

  // 검증 실패
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next(); // 필수
};

/**
 * 고객 등록
 * POST /api/users
 * { email, password, user_name }
 */
exports.write = async ctx => {
  // 객체가 지닌 값들을 검증
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    user_name: Joi.string().required()
  });

  // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
  const result = Joi.validate(ctx.request.body, schema);

  // 오류가 발생하면 오류 내용 응답
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password, user_name } = ctx.request.body;

  const users = new Users({
    email,
    password: crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(password)
      .digest("hex"),
    user_name
  });

  try {
    await users.save();
    ctx.body = users;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 고객 전체 목록 조회
 * GET /api/users
 */
exports.list = async ctx => {
  const page = parseInt(ctx.query.page || 1, PAGE);

  //잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  //데이터
  try {
    const users = await Users.find()
      // .where("end")
      // .equals(false)
      // .select("email user_name user_thumnail created_at end")
      .sort({ id: -1 }) // 최신순으로
      .limit(PAGE) // 데이터제한
      .skip((page - 1) * PAGE) // 다음 페이지 데이터
      .lean() // JSON 형태로 전환
      .exec();

    const userCount = await Users.count().exec();

    ctx.body = {
      contents: users,
      response: {
        code: ctx.status,
        message: ""
      }
    };

    // 마지막 페이지 알려 주기
    // ctx.set은 response header를 설정
    ctx.set("Last-Page", Math.ceil(userCount / PAGE));
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/**
 * 고객 상세 정보
 * GET /api/users/:id
 */
exports.read = async ctx => {
  const { id } = ctx.params;
  try {
    const user = await Users.findById(id)
      .select("email user_name user_thumnail created_at")
      .exec();

    // user가 존재하지 않을 때
    if (!user) {
      ctx.status = 404;
      return;
    }

    ctx.body = {
      contents: user,
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
 * 고객 정보 수정
 * PATCH /api/users/:id
 * { email, password, user_name, push, img, end_date}
 */
exports.update = async ctx => {
  const { id } = ctx.params;
  try {
    const user = await Users.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    }).exec();

    // user가 존재하지 않을 때
    if (!user) {
      ctx.status = 404;
      return;
    }
    ctx.body = user;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
