// WhatsApp integration utilities
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919075870747';

export function redirectToWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function generateContactWhatsAppURL(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const message = `
🔔 New Contact Form Submission

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone}

💬 Message:
${data.message}

---
Sent from Test Agency Website
  `.trim();

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function validateContactForm(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name ||data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export function canSubmitForm(formType: string): { canSubmit: boolean; message: string } {
  const lastSubmit = localStorage.getItem(`lastSubmit_${formType}`);
  if (lastSubmit) {
    const timeSince = Date.now() - parseInt(lastSubmit);
    const cooldown = 60000; // 1 minute
    if (timeSince < cooldown) {
      const remaining = Math.ceil((cooldown - timeSince) / 1000);
      return {
        canSubmit: false,
        message: `Please wait ${remaining} seconds before submitting again`,
      };
    }
  }
  return { canSubmit: true, message: '' };
}

export function recordFormSubmission(formType: string): void {
  localStorage.setItem(`lastSubmit_${formType}`, Date.now().toString());
}
