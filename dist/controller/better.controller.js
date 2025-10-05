import { auth } from "../lib/auth.js";
import { Hono } from "hono";
const betterAuth = new Hono();
betterAuth.on(["POST", "GET"], "/*", (c) => {
    return auth.handler(c.req.raw);
});
export default betterAuth;
