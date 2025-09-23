import userApp from "@/controller/user.controller.js";
import { Hono } from "hono";

const app = new Hono().basePath("/api");

const routes = app.route("/user", userApp);

export default routes;
