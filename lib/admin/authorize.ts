import { getServerProfile } from '@/lib/serverAuth';

export async function authorizeAdmin() {
  const profile = await getServerProfile();
  return Boolean(profile && profile.role_id === 1);
}
