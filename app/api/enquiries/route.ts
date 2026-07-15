import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import { getServerProfile } from '@/lib/serverAuth';
import { uploadEnquiryImage } from '@/lib/enquiryStorage';
import { sendEnquiryUpdateNotification } from '@/lib/notifications';

async function parseRequest(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const images = formData.getAll('images').filter((item): item is File => item instanceof File);

    return {
      name: (formData.get('name') as string) ?? '',
      email: (formData.get('email') as string) ?? '',
      phone: (formData.get('phone') as string) ?? '',
      message: (formData.get('message') as string) ?? '',
      type: (formData.get('type') as string) ?? 'general',
      images,
    };
  }

  const payload = await req.json();
  return {
    name: payload.name ?? '',
    email: payload.email ?? '',
    phone: payload.phone ?? '',
    message: payload.message ?? '',
    type: payload.type ?? 'general',
    images: Array.isArray(payload.images) ? payload.images : [],
  };
}

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  const profile = await getServerProfile();
  const payload = await parseRequest(req);
  const { name, email, phone, message, type, images } = payload;

  if (!name.trim() || !message.trim() || !email.trim() || !phone.trim()) {
    return NextResponse.json({ error: 'Name, email, phone, and message are required.' }, { status: 400 });
  }

  const { data: enquiry, error: enquiryError } = await supabaseAdmin.from('enquiries').insert({
    user_id: profile?.id ?? null,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message.trim(),
    type: type.trim(),
    status: 'new',
  }).select('id, status').single();

  if (enquiryError || !enquiry) {
    return NextResponse.json({ error: enquiryError?.message ?? 'Failed to submit enquiry' }, { status: 500 });
  }

  if (images.length > 0) {
    const storagePaths: string[] = [];

    for (const image of images) {
      try {
        const path = await uploadEnquiryImage(image, image.name || 'enquiry-image');
        storagePaths.push(path);
      } catch (storageError) {
        // eslint-disable-next-line no-console
        console.warn('Failed to upload enquiry image', storageError);
      }
    }

    if (storagePaths.length > 0) {
      await supabaseAdmin.from('enquiry_images').insert(
        storagePaths.map((storage_path) => ({ enquiry_id: enquiry.id, storage_path }))
      );
    }
  }

  await sendEnquiryUpdateNotification({
    email: email.trim() || null,
    phone: phone.trim() || null,
    status: 'new',
    replyMessage: null,
  });

  return NextResponse.json({ success: true, enquiryId: enquiry.id });
}
