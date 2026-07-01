import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Sparkles, ShieldCheck, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { saveLead } from "@/lib/leads";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kohinoor Polytech" },
      { name: "description", content: "Talk to our sales and application engineering team. Quotes within one business day." },
      { property: "og:title", content: "Contact Kohinoor Polytech" },
      { property: "og:description", content: "Quotes, samples and consultations." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", topic: "Sales inquiry", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const PHONE = "+91 9033786017";
  const PHONE_DIGITS = "919033786017";
  const EMAIL = "sales@kohinoorpolytech.com";
  const ADDRESS = "Kim Station Road, Mota Borasara, Kim 394110, Surat, Gujarat, India";
  const WHATSAPP = `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent("Hello Kohinoor Polytech, I would like to enquire about your polymer products.")}`;
  const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
  const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
  const MAILTO = `mailto:${EMAIL}`;
  const TEL = `tel:${PHONE_DIGITS}`;

  const schema = z.object({
    name: z.string().trim().min(1, "Name required").max(100),
    email: z.string().trim().email("Valid email required").max(255),
    message: z.string().trim().min(1, "Message required").max(1000),
  });

  const topics = [
    { id: "Sales inquiry", name: "Sales Inquiry", desc: "Pricing, bulk pricing, and custom order timelines.", icon: Phone },
    { id: "Sample request", name: "Sample Request", desc: "Order free polymer granules for testing.", icon: Sparkles },
    { id: "Custom compounding", name: "Custom Compound", desc: "Bespoke color shade or MFI formulation.", icon: ShieldCheck },
    { id: "Sustainability partnership", name: "Green Partnerships", desc: "EPR credits and plastic waste sourcing.", icon: Heart },
  ];

  function makeWhatsAppUrl() {
    const messageLines = [
      "Hello Kohinoor Polytech, I would like to enquire about your polymer products.",
      "",
      `Name: ${form.name}`,
      `Company: ${form.company || "N/A"}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "N/A"}`,
      `Topic: ${form.topic}`,
      "",
      "Message:",
      form.message,
    ];
    const encoded = encodeURIComponent(messageLines.join("\n"));
    return `https://wa.me/${PHONE_DIGITS}?text=${encoded}`;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse({ name: form.name, email: form.email, message: form.message });
    if (!result.success) {
      const fe: Record<string, string> = {};
      for (const i of result.error.issues) fe[i.path[0] as string] = i.message;
      setErrors(fe);
      return;
    }
    saveLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: `[${form.topic}] ${form.message}`,
      source: "contact-page",
    });
    setErrors({});
    setIsSuccess(true);

    const whatsappUrl = makeWhatsAppUrl();
    window.open(whatsappUrl, "_blank");
    
    // Reset form after submit
    setForm({ name: "", company: "", email: "", phone: "", topic: "Sales inquiry", message: "" });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) {
      setErrors((err) => {
        const next = { ...err };
        delete next[k];
        return next;
      });
    }
  };

  const inputClasses = "w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm outline-none transition-all duration-300 focus:border-brand-cyan/40 focus:bg-white/10 focus:ring-2 focus:ring-brand-cyan/10 text-foreground placeholder-muted-foreground/50";

  return (
    <div className="relative min-h-screen">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-blue/10 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-brand-green/8 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 20, -20, 0],
            y: [0, 30, -40, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/4 h-[400px] w-[400px] rounded-full bg-brand-cyan/10 blur-[110px]"
        />
      </div>

      <PageHero
        eyebrow="Contact Us"
        title={<>Let's build <span className="text-gradient">together</span>.</>}
        sub="Connect with our polymer engineers for custom compounding development, samples or industrial contracts."
      />

      <Section className="relative z-10 pt-2 pb-24">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
          
          {/* Contact Form Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-16 px-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-brand-green mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
                    Thank you for contacting us. We have opened WhatsApp to connect you directly with our sales desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="btn-ghost px-6 py-2.5 text-xs font-semibold cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Send a Message</h3>
                    <p className="text-xs text-muted-foreground mb-6">Select a category and fill in your project details.</p>
                  </div>

                  {/* Topic selector row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      const isSelected = form.topic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, topic: t.id }))}
                          className={`text-left p-4 rounded-2xl glass transition-all border relative overflow-hidden flex flex-col justify-between h-28 cursor-pointer ${
                            isSelected 
                              ? "border-brand-cyan bg-brand-cyan/10 shadow-lg shadow-brand-cyan/5" 
                              : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-muted-foreground'}`}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div className="font-semibold text-xs tracking-wide">{t.name}</div>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal mt-2 line-clamp-2">{t.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Form inputs */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        value={form.name} 
                        onChange={set("name")} 
                        placeholder="Full name" 
                        className={`${inputClasses} ${errors.name ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                      />
                      {errors.name && <span className="text-[11px] text-red-400 px-3 mt-1 block">{errors.name}</span>}
                    </div>
                    <input 
                      value={form.company} 
                      onChange={set("company")} 
                      placeholder="Company / Organization" 
                      className={inputClasses} 
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        value={form.email} 
                        onChange={set("email")} 
                        type="email" 
                        placeholder="Work email" 
                        className={`${inputClasses} ${errors.email ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                      />
                      {errors.email && <span className="text-[11px] text-red-400 px-3 mt-1 block">{errors.email}</span>}
                    </div>
                    <input 
                      value={form.phone} 
                      onChange={set("phone")} 
                      placeholder="Phone (e.g. +91 ...)" 
                      className={inputClasses} 
                    />
                  </div>

                  <div>
                    <textarea 
                      value={form.message} 
                      onChange={set("message")} 
                      rows={4} 
                      placeholder="Tell us about your application requirement, volume, target MFI..." 
                      className={`w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-3.5 text-sm outline-none transition-all duration-300 focus:border-brand-cyan/40 focus:bg-white/10 focus:ring-2 focus:ring-brand-cyan/10 text-foreground placeholder-muted-foreground/50 resize-none ${errors.message ? 'border-red-500/50 focus:border-red-500/50' : ''}`} 
                    />
                    {errors.message && <span className="text-[11px] text-red-400 px-3 mt-1 block">{errors.message}</span>}
                  </div>

                  <motion.button 
                    type="submit" 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="btn-primary justify-center py-3.5 tracking-wider font-semibold cursor-pointer shadow-lg shadow-brand-blue/20"
                  >
                    Send to WhatsApp Desk <ArrowRight className="h-4 w-4 ml-1" />
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Details Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Address Widget */}
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-brand-cyan/5 blur-2xl pointer-events-none" />
              <div className="flex gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-brand-cyan h-fit border border-white/5">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Head Office & Plant</div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{ADDRESS}</p>
                  <a 
                    href={MAP_URL} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs text-brand-cyan mt-4 hover:underline transition-all group font-medium"
                  >
                    View location on maps <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Grid */}
            <div className="grid grid-cols-2 gap-4">
              <a href={TEL} className="glass rounded-2xl p-5 block border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.04] transition-all group">
                <div className="p-2.5 rounded-xl bg-white/5 text-brand-cyan w-fit group-hover:scale-105 transition-transform duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-xs tracking-wide">Call Sales</div>
                <div className="text-[10px] text-muted-foreground font-num mt-1 group-hover:text-brand-cyan transition-colors">{PHONE}</div>
              </a>

              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="glass rounded-2xl p-5 block border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.04] transition-all group">
                <div className="p-2.5 rounded-xl bg-white/5 text-brand-green w-fit group-hover:scale-105 transition-transform duration-300">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-xs tracking-wide">WhatsApp</div>
                <div className="text-[10px] text-muted-foreground font-num mt-1 group-hover:text-brand-green transition-colors">{PHONE}</div>
              </a>

              <a href={MAILTO} className="glass rounded-2xl p-5 block border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.04] transition-all group">
                <div className="p-2.5 rounded-xl bg-white/5 text-brand-cyan w-fit group-hover:scale-105 transition-transform duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-xs tracking-wide">Email Inbox</div>
                <div className="text-[10px] text-muted-foreground mt-1 group-hover:text-brand-cyan transition-colors truncate">{EMAIL}</div>
              </a>

              <div className="glass rounded-2xl p-5 border border-white/5 bg-white/[0.01]">
                <div className="p-2.5 rounded-xl bg-white/5 text-brand-cyan w-fit">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-xs tracking-wide">Working Hours</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-normal">Mon–Sat · 9:30–18:30 IST</div>
              </div>
            </div>

            {/* Dark Sleek Mockup Map */}
            <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group bg-black/40">
              <div className="h-10 bg-white/[0.03] border-b border-white/5 px-5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="text-[10px] text-muted-foreground/60 font-mono ml-4 select-none tracking-wider uppercase">Kohinoor Polytech Plant Map</span>
              </div>
              <iframe
                title="Kohinoor Polytech location"
                src={MAP_EMBED}
                className="w-full h-72 border-0 filter invert grayscale opacity-60 hover:opacity-100 hover:invert-0 hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </motion.div>
        </div>
      </Section>
    </div>
  );
}
