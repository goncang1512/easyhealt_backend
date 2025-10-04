import { serve } from "@hono/node-server";
import routes from "./routes/routes.js";
import { Hono } from "hono";
const app = new Hono();
app.route("/", routes);
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
