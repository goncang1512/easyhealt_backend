import { serve } from "@hono/node-server";
import routes from "@/routes/routes";
import { Hono } from "hono";
import * as dotenv from "dotenv";

dotenv.config();

const app = new Hono();
app.route("/", routes);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export default app;
