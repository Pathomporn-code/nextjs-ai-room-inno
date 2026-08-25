import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Camera,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import ContactForm from "./contact-form";

export const revalidate = 3600;

const contactInfo = [
  {
    icon: MapPin,
    title: "ที่อยู่",
    content: "123 ถนนตัวอย่าง แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500",
  },
  {
    icon: Phone,
    title: "โทรศัพท์",
    content: "02-123-4567",
  },
  {
    icon: Mail,
    title: "อีเมล",
    content: "contact@cosci.com",
  },
  {
    icon: Clock,
    title: "เวลาทำการ",
    content: "จันทร์ - ศุกร์ 09:00 - 18:00 น.",
  },
];

const socialLinks = [
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: MessageCircle, label: "Line", href: "#" },
];

const faqs = [
  {
    question: "สั่งซื้อสินค้าได้อย่างไร?",
    answer:
      "เลือกสินค้าที่ต้องการ หยิบลงตะกร้า และดำเนินการชำระเงินตามขั้นตอนที่ระบบแนะนำ",
  },
  {
    question: "มีนโยบายคืนสินค้าหรือไม่?",
    answer:
      "สามารถคืนสินค้าได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า หากสินค้ามีความเสียหายหรือไม่ตรงกับที่สั่ง",
  },
  {
    question: "ใช้เวลาจัดส่งนานแค่ไหน?",
    answer:
      "จัดส่งภายใน 3-5 วันทำการ สำหรับกรุงเทพฯ และปริมณฑล และ 5-7 วันทำการ สำหรับต่างจังหวัด",
  },
  {
    question: "สามารถชำระเงินแบบใดได้บ้าง?",
    answer:
      "รองรับการชำระเงินผ่านบัตรเครดิต/เดบิต, โอนผ่านธนาคาร, และ QR Code",
  },
];

// http://localhost:3000/contact
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-medium tracking-[-0.045em] sm:text-[2.75rem]/[1.2]">
          ติดต่อเรา
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground tracking-[-0.01em] sm:text-2xl">
          สอบถามข้อมูลเพิ่มเติมหรือติดต่อทีมงาน
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        {/* Left: Contact Info */}
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border p-4"
              >
                <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-medium text-lg">ช่องทางการติดตาม</h3>
            <div className="mt-3 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-medium text-lg">คำถามที่พบบ่อย</h3>
            <div className="mt-4 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border p-4">
                  <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
                    <HelpCircle className="size-4 shrink-0 text-primary" />
                    {faq.question}
                  </summary>
                  <p className="mt-2 ml-6 text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="rounded-xl border p-6 sm:p-8">
          <h2 className="font-heading text-xl font-medium">ส่งข้อความหาเรา</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            กรอกแบบฟอร์มด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
