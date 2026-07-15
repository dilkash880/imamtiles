export async function notifyCustomerByEmail(email: string, subject: string, htmlMessage: string) {
  // Placeholder for future email notification integration.
  // Integrate SendGrid, Mailgun, or SMTP here when ready.
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
