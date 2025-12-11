import { Hono } from "hono";
import { APIError } from "better-auth";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma-client.js";
import {
  loginSchema,
  registrasiSchema,
} from "../middleware/validator/auth.schema.js";
import { ErrorZod } from "../utils/error-zod.js";

const authApp = new Hono();

authApp.post("/login", async (c) => {
  const body = await c.req.json();

  try {
    const parse = loginSchema.parse(body);

    const session = await auth.api.signInEmail({
      body: {
        email: parse.email,
        password: parse.password,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success login",
        result: { ...session },
      },
      200
    );
  } catch (error) {
    if (error instanceof APIError) {
      return c.json(
        {
          status: false,
          statusCode: error.body?.code as ContentfulStatusCode | undefined,
          message: error.body?.message as string,
          result: null,
        },
        (error.body?.code as ContentfulStatusCode | undefined) ?? 500
      );
    }

    return ErrorZod(error, c);
  }
});

authApp.post("/register", async (c) => {
  const body = await c.req.json();

  try {
    const parsed = registrasiSchema.parse(body);

    if (parsed.password !== parsed.confirmPassword) {
      throw new APIError(422, {
        code: "422",
        message: "Invalid Password and Confirmation Password",
      });
    }

    const session = await auth.api.signUpEmail({
      body: {
        email: parsed.email,
        name: parsed.name,
        password: parsed.password,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 201,
        message: "Success login",
        result: { ...session },
      },
      201
    );
  } catch (error) {
    if (error instanceof APIError) {
      return c.json(
        {
          status: false,
          statusCode: error.body?.code as ContentfulStatusCode | undefined,
          message: error.body?.message as string,
          result: null,
        },
        (error.body?.code as ContentfulStatusCode | undefined) ?? 500
      );
    }

    return ErrorZod(error, c);
  }
});

authApp.get("/session", async (c) => {
  try {
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
            docter: {
              select: {
                id: true,
                specialits: true,
                photoUrl: true,
                status: true,
                hospital: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                  },
                },
              },
            },
            admin: {
              select: {
                id: true,
                hospital: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return c.json(
        {
          status: false,
          statusCode: 404,
          message: "Session not found",
        },
        404
      );
    }

    const { user, ...sessionData } = session;
    const { admin, docter, ...userData } = user;

    const hospitalDocter =
      docter?.status === "unverified" ? null : docter?.hospital;

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success get session",
        result: {
          session: sessionData,
          user: userData,
          docter: docter
            ? {
                id: docter?.id,
                specialits: docter?.specialits,
                photoUrl: docter?.photoUrl,
              }
            : null,
          hospital: admin?.hospital ?? hospitalDocter,
        },
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        result: error,
      },
      500
    );
  }
});

authApp.delete("/logout", async (c) => {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const result = await prisma.session.delete({
      where: {
        token: token,
      },
    });

    return c.json(
      {
        status: true,
        statusCode: 200,
        message: "Success logout",
        reuslt: result,
      },
      200
    );
  } catch (error) {
    return ErrorZod(error, c);
  }
});

export default authApp;
