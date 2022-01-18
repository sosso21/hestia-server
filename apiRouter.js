const express = require("express");
const agency = require("./models/agency");
const scpi = require("./models/scpi");
const admin = require("./models/admin")

// Router
exports.router = (() => {
  const apiRouter = express.Router();


// admin 
  apiRouter.route("/admin/login").post(admin.login);
  apiRouter.route("/admin/auth").post(admin.auth);


  // ---agency
  apiRouter.route("/agency/find/").get(agency.find);
  apiRouter.route("/agency/find/:limit").get(agency.findLimit);
  apiRouter.route("/agency/findOne/:slug").get(agency.findOne);
  apiRouter.route("/agency/search/:q").get(agency.search);
  apiRouter.route("/agency/update").post(agency.update);
  apiRouter.route("/agency/create").post(agency.create);
  apiRouter.route("/agency/delete").post(agency.delete);

  // ---scpi
  apiRouter.route("/scpi/find/").get(scpi.find);
  apiRouter.route("/scpi/find/:limit").get(scpi.findLimit);
  apiRouter.route("/scpi/findOne/:slug").get(scpi.findOne);
  apiRouter.route("/scpi/search/:q").get(scpi.search);
  apiRouter.route("/scpi/filter/:limit").get(scpi.filter);
  apiRouter.route("/scpi/update").post(scpi.update);
  apiRouter.route("/scpi/create").post(scpi.create);
  apiRouter.route("/scpi/delete").post(scpi.delete);



  return apiRouter;
})();
