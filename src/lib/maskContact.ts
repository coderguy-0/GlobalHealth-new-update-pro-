// Contact masking — never reveal a full phone number or email in
// verification screens ("Enter the OTP sent to +91 XXXXXXX123").

export function maskPhone(input: string): string {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length === 0) return String(input || '');
  // Keep country code (up to 2 digits) + last 3 digits; mask the middle.
  const country = digits.length > 10 ? digits.slice(0, digits.length - 10) : '';
  const local = digits.slice(country.length);
  const last3 = local.slice(-3);
  const maskedLocal = local.length > 3 ? `${'•'.repeat(Math.min(local.length - 3, 6))}${last3}` : last3;
  const prefix = country ? `+${country} ` : '';
  return `${prefix}${maskedLocal}`;
}

export function maskEmail(input: string): string {
  const email = String(input || '').trim();
  if (!email.includes('@')) return email;
  const [local, domain] = email.split('@');
  const visible = local.slice(0, 2);
  const masked = local.length > 2 ? `${visible}${'•'.repeat(Math.min(local.length - 2, 6))}` : visible;
  return `${masked}@${domain}`;
}
