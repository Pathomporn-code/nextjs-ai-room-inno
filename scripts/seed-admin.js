#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Seed admin user ผ่าน better-auth API
// Usage: node scripts/seed-admin.js
require("dotenv").config();

const { createPool } = require("mysql2/promise");

const BASE = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const EMAIL = "admin@example.com";
const PASSWORD = "Admin@12345";
const NAME = "Admin";

async function seed() {
  const res = await fetch(`${BASE}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": BASE,
    },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: NAME }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Failed (${res.status}):`, body);
    process.exit(1);
  }

  const data = await res.json();
  console.log("Admin user created:", data.user?.email);

  const dbUrl = new URL(process.env.DATABASE_URL);
  const pool = await createPool({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
  });

  await pool.execute("UPDATE `user` SET `role` = ? WHERE `email` = ?", ["admin", EMAIL]);
  await pool.end();

  console.log(`Role updated to admin for ${EMAIL}`);
}

seed();
