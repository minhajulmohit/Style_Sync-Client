import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin, jwt } from "better-auth/plugins";

import { MongoClient, ObjectId } from "mongodb";

import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);

const db = client.db("StyleSync");
const blockedAccountMessage =
  "Your account has been blocked by an administrator.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60,
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          if (!ObjectId.isValid(session.userId)) {
            return;
          }

          const user = await db
            .collection("user")
            .findOne(
              { _id: new ObjectId(session.userId) },
              { projection: { isBlocked: 1 } },
            );

          if (user?.isBlocked === true) {
            throw new APIError("FORBIDDEN", {
              message: blockedAccountMessage,
            });
          }
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email" && isRecord(ctx.body)) {
        const email = ctx.body.email;
        if (typeof email === "string") {
          const user = await db
            .collection("user")
            .findOne(
              { email: email.toLowerCase() },
              { projection: { isBlocked: 1 } },
            );

          if (user?.isBlocked === true) {
            throw new APIError("FORBIDDEN", {
              message: blockedAccountMessage,
            });
          }
        }
      }

      if (ctx.path === "/update-user" && isRecord(ctx.body)) {
        if (
          "role" in ctx.body ||
          "banned" in ctx.body ||
          "isBlocked" in ctx.body ||
          "banExpires" in ctx.body
        ) {
          throw new APIError("FORBIDDEN", {
            message: "You cannot change your role or block status in your profile.",
          });
        }
      }

      if (ctx.path === "/sign-up/email" && isRecord(ctx.body)) {
        const password = ctx.body.password;
        if (
          typeof password !== "string" ||
          password.length < 6 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 6 characters and include an uppercase and lowercase letter.",
          });
        }
      }

      const body = isRecord(ctx.body) ? ctx.body : null;
      const adminMutationPaths = new Set([
        "/admin/set-role",
        "/admin/update-user",
        "/admin/unban-user",
      ]);
      if (body && adminMutationPaths.has(ctx.path)) {
        const updates = isRecord(body.data) ? body.data : body;
        if (ctx.path === "/admin/update-user" && "isBlocked" in updates) {
          throw new APIError("FORBIDDEN", {
            message: "Use the administrator block endpoint to change block status.",
          });
        }

        if (!ctx.headers) {
          return;
        }

        const currentSession = await auth.api.getSession({
          headers: ctx.headers,
        });
        const targetUserId = body.userId;
        const changesRole =
          ctx.path === "/admin/set-role" || "role" in updates;
        const unblocksUser =
          ctx.path === "/admin/unban-user" ||
          updates.banned === false ||
          updates.isBlocked === false;

        if (
          currentSession &&
          targetUserId === currentSession.user.id &&
          (changesRole || unblocksUser)
        ) {
          throw new APIError("FORBIDDEN", {
            message: "You cannot change your own role or unblock your own account.",
          });
        }
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [admin({ defaultRole: "customer" }), jwt()],
});
