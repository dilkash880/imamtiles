import supabaseAdmin from '@/lib/supabaseServer';

export const ENQUIRY_IMAGES_BUCKET = 'enquiry-uploads';

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180);
}

export function buildEnquiryImagePath(filename: string) {
  const safeFilename = sanitizeFilename(filename);
  return `enquiries/${Date.now()}-${crypto.randomUUID()}-${safeFilename}`;
}

export async function uploadEnquiryImage(file: Blob, filename: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase server client not configured');
  }

  const path = buildEnquiryImagePath(filename);
  const buffer = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from(ENQUIRY_IMAGES_BUCKET)
    .upload(path, new Uint8Array(buffer), {
      contentType: (file as any).type || undefined,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return path;
}

export async function getSignedImageUrl(path: string, expiresInSeconds = 60 * 60) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.storage
    .from(ENQUIRY_IMAGES_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) {
    return null;
  }

  return data.signedUrl;
}
