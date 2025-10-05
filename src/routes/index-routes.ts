import authApp from "@/controller/auth.controller";
import betterAuth from "@/controller/better.controller";
import hospitalApp from "@/controller/hospital.controller";
import userApp from "@/controller/user.controller";
import { Hono } from "hono";

const app = new Hono().basePath("/api");

const routes = app
  .route("/user", userApp)
  .route("/auth", betterAuth)
  .route("/sign", authApp)
  .route("/hospital", hospitalApp);

export default routes;
