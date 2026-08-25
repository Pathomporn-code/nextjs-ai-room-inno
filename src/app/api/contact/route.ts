import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import * as z from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  subject: z
    .string()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(150, "หัวข้อต้องไม่เกิน 150 ตัวอักษร"),
  message: z
    .string()
    .min(10, "ข้อความต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(2000, "ข้อความต้องไม่เกิน 2000 ตัวอักษร"),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { ok: false, errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website } = result.data;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      return NextResponse.json(
        { ok: false, message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `ชื่อ: ${name}\nอีเมล: ${email}\nหัวข้อ: ${subject}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
