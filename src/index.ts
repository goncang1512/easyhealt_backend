import { serve } from "@hono/node-server";
import routes from "./config/routes.js";
import { Hono } from "hono";
import { initializeFirebaseApp } from "./lib/firebase.js";

const app = new Hono();

initializeFirebaseApp();

app.route("/", routes);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
