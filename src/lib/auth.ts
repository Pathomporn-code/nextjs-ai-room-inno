import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

const dbUrl = new URL(process.env.DATABASE_URL!);

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    database: createPool({
        host: dbUrl.hostname,
        port: Number(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
    }),
    user: {
        fields: {
            emailVerified: "emailVerified",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },
    session: {
        fields: {
            userId: "userId",
            expiresAt: "expiresAt",
            ipAddress: "ipAddress",
            userAgent: "userAgent",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    account: {
        fields: {
            accountId: "accountId",
            providerId: "providerId",
            userId: "userId",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            idToken: "idToken",
            accessTokenExpiresAt: "accessTokenExpiresAt",
            refreshTokenExpiresAt: "refreshTokenExpiresAt",
            password: "password",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    verification: {
        fields: {
            expiresAt: "expiresAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false,
        minPasswordLength: 8
    }
});