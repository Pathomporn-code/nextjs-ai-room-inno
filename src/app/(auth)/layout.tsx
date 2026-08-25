import type { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "ระบบ ล็อกอิน",
  description: "เรียนรู้การเขียน Next.js",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
