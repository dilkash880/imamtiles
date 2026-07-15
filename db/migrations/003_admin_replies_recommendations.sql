-- Add support for storing recommended products on admin enquiry replies

alter table admin_replies
  add column if not exists recommended_products jsonb default '[]'::jsonb;
