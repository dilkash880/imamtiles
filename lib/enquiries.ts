export type EnquiryStatus = 'new' | 'in progress' | 'replied' | 'closed';

export type EnquiryImage = {
  id: number;
  storage_path: string;
  public_url: string | null;
  metadata: any;
  created_at: string | null;
};

export type AdminReply = {
  id: number;
  admin_id: string;
  admin_name: string | null;
  message: string | null;
  outcome: string | null;
  recommended_products: string[];
  created_at: string | null;
};

export type EnquiryRecord = {
  id: number;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  type: string | null;
  status: EnquiryStatus;
  created_at: string | null;
  updated_at: string | null;
  images: EnquiryImage[];
  replies: AdminReply[];
};
