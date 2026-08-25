"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  website: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages)) {
              form.setError(field as keyof ContactFormValues, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      {status === "success" && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
        >
          ส่งข้อความสำเร็จแล้ว เราจะติดต่อกลับโดยเร็วที่สุด
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive"
        >
          เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง
        </div>
      )}

      <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="สมชาย ใจดี"
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-email">อีเมล</FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-subject">หัวข้อ</FieldLabel>
                <Input
                  {...field}
                  id="contact-subject"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  placeholder="สอบถามข้อมูลสินค้า"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
                <Textarea
                  {...field}
                  id="contact-message"
                  aria-invalid={fieldState.invalid}
                  placeholder="พิมพ์ข้อความของคุณที่นี่..."
                  rows={6}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="website"
            control={form.control}
            render={({ field }) => (
              <Field className="hidden" aria-hidden="true">
                <FieldLabel htmlFor="contact-website">เว็บไซต์</FieldLabel>
                <Input
                  {...field}
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="mt-6">
        <Button
          type="submit"
          form="contact-form"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
        </Button>
      </div>
    </div>
  );
}
