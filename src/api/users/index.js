const Router = require("koa-router");
const usersCtrl = require("./users.ctrl");

const users = new Router();

users.get("/", usersCtrl.list);
users.post("/", usersCtrl.write);
users.get("/:id", usersCtrl.checkObjectId, usersCtrl.read);
users.patch("/:id", usersCtrl.checkObjectId, usersCtrl.update);

module.exports = users;
