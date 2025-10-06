import bookApp from "../controller/pacient.controller.js";
import authApp from "../controller/auth.controller.js";
import betterAuth from "../controller/better.controller.js";
import hospitalApp from "../controller/hospital.controller.js";
import userApp from "../controller/user.controller.js";
import { Hono } from "hono";
import adminApp from "../controller/admin.controller.js";

const app = new Hono().basePath("/api");

const routes = app
  .route("/user", userApp)
  .route("/auth", betterAuth)
  .route("/sign", authApp)
  .route("/hospital", hospitalApp)
  .route("/booking", bookApp)
  .route("/admin", adminApp);

export default routes;
