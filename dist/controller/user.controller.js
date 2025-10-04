import { Hono } from "hono";
const userApp = new Hono();
userApp.get("/", (c) => {
    return c.json({
        status: true,
        message: "Success create API",
    });
});
export default userApp;
