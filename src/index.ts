import { serve } from "@hono/node-server";
import routes from "./config/routes.js";
import { Hono } from "hono";

const app = new Hono();

app.use("/*", async (c, next) => {
  const apiKey = c.req.header("x-api-key"); // ambil dari header

  if (!apiKey) {
    return c.json(
      {
        status: false,
        statusCode: 401,
        message: "API Key is missing",
        result: null,
      },
      401
    );
  }

  // validasi API key dengan yang ada di environment
  if (apiKey !== process.env.API_KEY) {
    return c.json(
      {
        status: false,
        statusCode: 403,
        message: "Invalid API Key",
        result: null,
      },
      403
    );
  }

  await next(); // lanjut ke route berikutnya
});

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
