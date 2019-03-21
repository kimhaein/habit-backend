const crypto = require("crypto");
const Users = require("models/users");
/**
 * 로그인
 * POST /api/auth/login
 * { email, password , autoLogin}
 */

exports.login = async ctx => {
  let { email, password } = ctx.request.body;
  password = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
  try {
    const users = await Users.find()
      .where("email")
      .equals(email)
      .where("password")
      .equals(password);

    if (users.length > 0) {
      ctx.body = {
        success: true
      };
      ctx.session.logged = true;
    } else {
      ctx.body = {
        success: false
      };
      ctx.status = 401;
    }
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.check = async ctx => {
  ctx.body = {
    logged: !!ctx.session.logged
  };
};

exports.logout = async ctx => {
  ctx.session = null;
  ctx.status = 204;
};
