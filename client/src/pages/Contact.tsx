import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Button, Input, TextArea } from "../components/ui";

interface FormData {
  name: string;
  email: string;
  phone: string;
  suggestion: string;
}

const EMPTY_FORM: FormData = { name: "", email: "", phone: "", suggestion: "" };

const Contact = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData(EMPTY_FORM);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grain relative min-h-screen overflow-hidden bg-ink px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-sway absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2"
          style={{
            background: "conic-gradient(from 180deg at 50% 0%, transparent, rgba(179,73,95,0.22), transparent 50%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl font-bold text-ivory sm:text-5xl">
          We'd Love to <span className="text-gradient-gold">Hear From You</span>
        </h1>
        <p className="mt-4 text-sm text-ivory/50 sm:text-base">
          Feedback, bug reports, or a title we should add — tell us what's on your mind.
        </p>
      </div>

      <div className="glass relative z-10 mx-auto mt-10 max-w-xl rounded-3xl p-8 sm:p-10">
        {status === "success" && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <FaCheckCircle /> Thanks — your suggestion has been sent.
          </div>
        )}
        {status === "error" && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
            <FaExclamationCircle /> We couldn't send that. Check your connection and try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
          <TextArea
            label="Your Suggestion"
            name="suggestion"
            rows={4}
            value={formData.suggestion}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending..." : "Send Suggestion"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;