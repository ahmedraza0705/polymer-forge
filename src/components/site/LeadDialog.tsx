import { useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { OPEN_LEAD_DIALOG_EVENT, saveLead, type LeadDialogPrefill } from "@/lib/leads";

const PHONE_DIGITS = "919033786017";
const PHONE = "+91 9033786017";

function makeWhatsAppUrl(form: z.infer<typeof schema>, source: string) {
  const messageLines = [
    "Hello Kohinoor Polytech, I would like to enquire about your polymer products.",
    "",
    `Source: ${source}`,
    `Name: ${form.name}`,
    `Company: ${form.company || "N/A"}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone || "N/A"}`,
    `Product: ${form.productName || "N/A"}`,
    `Grade: ${form.grade || "N/A"}`,
    `Quantity: ${form.quantity || "N/A"}`,
    "",
    "Message:",
    form.message || "N/A",
  ];
  return `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(messageLines.join("\n"))}`;
}

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  productName: z.string().trim().max(120).optional().or(z.literal("")),
  grade: z.string().trim().max(60).optional().or(z.literal("")),
  quantity: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const empty = { name: "", email: "", phone: "", company: "", productName: "", grade: "", quantity: "", message: "" };

export function LeadDialog() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("manual");
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LeadDialogPrefill>).detail ?? {};
      setForm((f) => ({
        ...empty,
        ...f,
        productName: detail.productName ?? "",
        grade: detail.grade ?? "",
        quantity: detail.quantity ?? "",
      }));
      setSource(detail.source ?? "manual");
      setErrors({});
      setOpen(true);
    };
    window.addEventListener(OPEN_LEAD_DIALOG_EVENT, handler);
    return () => window.removeEventListener(OPEN_LEAD_DIALOG_EVENT, handler);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as string] = issue.message;
      setErrors(fe);
      return;
    }
    saveLead({ ...parsed.data, source });
    const whatsappUrl = makeWhatsAppUrl(parsed.data, source);
    window.open(whatsappUrl, "_blank");
    setOpen(false);
    setForm(empty);
  }

  const field = (k: keyof typeof empty) => ({
    value: form[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium tracking-tight">Request a quote</DialogTitle>
          <DialogDescription>
            Tell us about your application. Our engineers respond within one business day.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 mt-2">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Full name *" error={errors.name}><Input {...field("name")} placeholder="Your name" /></Field>
            <Field label="Work email *" error={errors.email}><Input {...field("email")} type="email" placeholder="you@company.com" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Phone"><Input {...field("phone")} placeholder="+91 …" /></Field>
            <Field label="Company"><Input {...field("company")} placeholder="Company name" /></Field>
          </div>
          <div className="grid md:grid-cols-[1.4fr,1fr,1fr] gap-3">
            <Field label="Product"><Input {...field("productName")} placeholder="e.g. PP Black (R)" /></Field>
            <Field label="Grade"><Input {...field("grade")} placeholder="PPHP / PPCP" /></Field>
            <Field label="Quantity"><Input {...field("quantity")} placeholder="MT / month" /></Field>
          </div>
          <Field label="Message"><Textarea {...field("message")} rows={4} placeholder="Application, target MFI, timeline…" /></Field>
          <button type="submit" className="btn-primary justify-self-start mt-1">
            <Send className="h-4 w-4" /> Send inquiry
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}