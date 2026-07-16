const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SHOP_OWNER_EMAIL = process.env.SHOP_OWNER_NOTIFICATION_EMAIL;
// Resend's shared sender works without a verified domain, but only when the
// recipient is the Resend account's own (sandbox-verified) email address.
const RESEND_FROM = 'Imam Marble & Tiles <onboarding@resend.dev>';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendResendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('RESEND_API_KEY not configured; email not sent', { to, subject });
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    // eslint-disable-next-line no-console
    console.error('Resend email failed', response.status, body);
  }
}

// Notifies the shop owner whenever a customer submits a new enquiry.
// Works today without a verified domain, since SHOP_OWNER_NOTIFICATION_EMAIL
// is the same address the Resend account itself is registered under.
export async function notifyShopOwnerOfNewEnquiry(enquiry: {
  name: string | null;
  email: string | null;
  phone: string | null;
  type: string | null;
  message: string | null;
  imageUrls: string[];
  productName?: string | null;
}) {
  if (!SHOP_OWNER_EMAIL) {
    // eslint-disable-next-line no-console
    console.warn('SHOP_OWNER_NOTIFICATION_EMAIL not configured; skipping shop owner notification');
    return;
  }

  const safe = {
    name: escapeHtml(enquiry.name ?? 'N/A'),
    email: escapeHtml(enquiry.email ?? 'N/A'),
    phone: escapeHtml(enquiry.phone ?? 'N/A'),
    type: escapeHtml(enquiry.type ?? 'N/A'),
    message: escapeHtml(enquiry.message ?? 'N/A'),
  };

  const imagesHtml = enquiry.imageUrls.length
    ? `<p><strong>Uploaded Images:</strong></p><ul>${enquiry.imageUrls
        .map((url) => `<li><a href="${url}">${escapeHtml(url)}</a></li>`)
        .join('')}</ul>`
    : '<p><strong>Uploaded Images:</strong> None</p>';

  const productHtml = enquiry.productName
    ? `<p><strong>Product:</strong> ${escapeHtml(enquiry.productName)}</p>`
    : '';

  const html = `
    <h2>New enquiry received</h2>
    <p><strong>Customer Name:</strong> ${safe.name}</p>
    <p><strong>Phone:</strong> ${safe.phone}</p>
    <p><strong>Email:</strong> ${safe.email}</p>
    <p><strong>Product Type:</strong> ${safe.type}</p>
    ${productHtml}
    <p><strong>Requirement:</strong> ${safe.message}</p>
    ${imagesHtml}
    <p><strong>Date &amp; Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
  `;

  await sendResendEmail({
    to: SHOP_OWNER_EMAIL,
    subject: `New enquiry from ${enquiry.name ?? 'a customer'}`,
    html,
  });
}

export async function notifyCustomerByEmail(email: string, subject: string, htmlMessage: string) {
  // Placeholder until a verified sending domain exists: Resend's sandbox
  // mode can only deliver to the account's own email, not arbitrary
  // customer addresses, so wiring this to Resend now would silently fail.
  // eslint-disable-next-line no-console
  console.info('Email notification placeholder', { email, subject, htmlMessage });
}

export async function notifyCustomerByWhatsApp(phone: string, message: string) {
  // Placeholder for future WhatsApp notification integration.
  // Integrate Twilio, WhatsApp Business API, or a webhook here when ready.
  // eslint-disable-next-line no-console
  console.info('WhatsApp notification placeholder', { phone, message });
}

export async function sendEnquiryUpdateNotification({
  email,
  phone,
  status,
  replyMessage,
}: {
  email: string | null;
  phone: string | null;
  status: string;
  replyMessage: string | null;
}) {
  const content = `Your enquiry status has been updated to ${status}. ${replyMessage ? `Reply: ${replyMessage}` : ''}`.trim();

  if (email) {
    await notifyCustomerByEmail(email, 'Your enquiry has been updated', content);
  }

  if (phone) {
    await notifyCustomerByWhatsApp(phone, content);
  }
}
