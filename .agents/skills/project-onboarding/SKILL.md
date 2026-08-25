---
name: project-onboarding
description: Use this skill when a developer asks how to set up, run, or understand this Next.js project. Use for onboarding questions such as "โปรเจกต์์นี้ตั้งค่าอย่างไร", "เริ่มรันยังไง", "ใช้ stack อะไร" from somone new to the codebase.
compatibility: Node.js 22+, npm, Git, MariaDB
license: MIT,
metadata: 
  author: Room Innovation
  version: "1.0.0"
---

#Project Onboarding Skill

ช่วย Developer เข้าใจโปรเจกต์จากตั้งแต่ clone ไปจนถึงรัน local ได้

# Setup Step

```bash
npm install
cp .env.example .env
npx prisma generate
npm run lint
npm run dev
```

# Output format

- ภาพรวมสั้นๆ
- ตารางขั้นตอนการตั้งค่า
- คำสั่งที่ต้องรัน
- ข้อควรระวังหรือปัญหาที่อาจเกิดขึ้น


# Stack

- Next.js App Router, React, Typescript
- Tailwind CSS + shadcn/u
- Prisma ORM + MariaDB
- better-auth สำหรับ authorization
- Zustand สำหรับ state management ฝั่ง client


# Gotchas

- หลัง npm install ควรรัน npx prisma generate