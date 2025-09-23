import { auth } from "@/lib/auth.js";
import prisma from "@/lib/prisma-client.js";
import { Hono } from "hono";

const authApp = new Hono();

authApp.post("/login", async (c) => {
  const body = await c.req.json();

  const session = await auth.api.signInEmail({
    body: {
      email: body.email,
      password: body.email,
    },
  });

  return c.json(
    {
      status: true,
      statusCode: 200,
      message: "Success login",
      result: session,
    },
    200
  );
});

authApp.post("/register", async (c) => {
  const body = await c.req.json();

  const session = await auth.api.signUpEmail({
    body: {
      email: body.email,
      name: body.email,
      password: body.password,
    },
  });

  return c.json(
    {
      status: true,
      statusCode: 201,
      message: "Success register user",
      result: session,
    },
    201
  );
});

authApp.get("/session", async (c) => {
  const cookieHeader = c.req.header("cookie") || "";

  const session = await prisma.session.findFirst({
    where: {
      token: cookieHeader,
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

  return c.json(
    {
      status: true,
      statusCode: 200,
      message: "Success get session",
      result: { session: sessionData, user },
    },
    200
  );
});

export default authApp;
