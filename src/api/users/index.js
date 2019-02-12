const Router = require("koa-router");
const users = new Router();

const printInfo = ctx => {
  ctx.body = {
    method: ctx.method,
    path: ctx.path,
    params: ctx.params
  };
};

users.get("/", printInfo);
users.post("/", printInfo);
users.get("/:id", printInfo);
users.delete("/:id", printInfo);
users.put("/:id", printInfo);
users.patch("/:id", printInfo);

module.exports = users;
