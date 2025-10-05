import { auth } from "../lib/auth.js";
import prisma from "../lib/prisma-client.js";
import { APIError } from "better-auth";
import { Hono } from "hono";
const authApp = new Hono();
authApp.post("/provider", async (c) => {
    const body = await c.req.json();
    try {
        const session = await auth.api.signInSocial({
            body: {
                provider: "google",
            },
        });
        return c.json({
            status: true,
            statusCode: 200,
            message: "Success login provider",
            result: "session",
        });
    }
    catch (error) {
        if (error instanceof APIError) {
            return c.json({
                status: false,
                statusCode: error.body?.code,
                message: error.message,
                result: null,
            }, error.body?.code ?? 401);
        }
        return c.json({
            status: false,
            statusCode: 500,
            message: "Internal Server Error",
            result: error,
        }, 500);
    }
});
authApp.post("/login", async (c) => {
    const body = await c.req.json();
    try {
        const session = await auth.api.signInEmail({
            body: {
                email: body.email,
                password: body.password,
            },
        });
        return c.json({
            status: true,
            statusCode: 200,
            message: "Success login",
            result: { ...session },
        }, 200);
    }
    catch (error) {
        if (error instanceof APIError) {
            return c.json({
                status: false,
                statusCode: error.body?.code,
                message: error.message,
                result: null,
            }, error.body?.code ?? 401);
        }
        return c.json({
            status: false,
            statusCode: 500,
            message: "Internal Server Error",
            result: error,
        }, 500);
    }
});
authApp.post("/register", async (c) => {
    const body = await c.req.json();
    try {
        if (body.password !== body.confirmPassword) {
            throw new APIError(422, {
                code: "422",
                message: "Invalid Password and Confirmation Password",
            });
        }
        const session = await auth.api.signUpEmail({
            body: {
                email: body.email,
                name: body.name,
                password: body.password,
            },
        });
        return c.json({
            status: true,
            statusCode: 200,
            message: "Success login",
            result: { ...session },
        }, 200);
    }
    catch (error) {
        if (error instanceof APIError) {
            return c.json({
                status: false,
                statusCode: error.body?.code,
                message: error.message,
                result: null,
            }, error.body?.code ?? 401);
        }
        return c.json({
            status: false,
            statusCode: 500,
            message: "Internal Server Error",
            result: error,
        }, 500);
    }
});
authApp.get("/session", async (c) => {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const session = await prisma.session.findFirst({
        where: {
            token: token,
        },
        select: {
            id: true,
            expiresAt: true,
            token: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                },
            },
        },
    });
    if (!session) {
        return c.json({
            status: false,
            statusCode: 404,
            message: "Session not found",
        }, 404);
    }
    const { user, ...sessionData } = session;
    return c.json({
        status: true,
        statusCode: 200,
        message: "Success get session",
        result: { session: sessionData, user },
    }, 200);
});
export default authApp;
