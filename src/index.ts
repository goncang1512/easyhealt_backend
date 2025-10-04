import { serve } from "@hono/node-server";
import routes from "./routes/routes.js";

serve(
  {
    fetch: routes.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
