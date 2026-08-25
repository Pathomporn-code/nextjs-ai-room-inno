import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const instant = false;

export const metadata: Metadata = {
  title: "ระบบ E-Commerce COSCI",
  description: "เรียนรู้การเขียน Next.js",
};

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}
