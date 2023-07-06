const controller = require("../controllers/section.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/section/create", controller.create);
  app.post("/api/section/update/:id", controller.update);
  app.post("/api/section/delete/:id", controller.delete);
  app.get("/api/section/get/:user_id", controller.get);
};
