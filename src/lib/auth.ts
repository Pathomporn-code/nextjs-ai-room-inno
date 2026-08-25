import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
    database: createPool({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "Admin_1jj395qu",
        database: "ecommerce",
    }),
    user: {
        fields: {
            emailVerified: "emailVerified",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
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