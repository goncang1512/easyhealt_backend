import { auth } from "@/lib/auth";
import { Hono } from "hono";

const betterAuth = new Hono();

betterAuth.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export default betterAuth;
