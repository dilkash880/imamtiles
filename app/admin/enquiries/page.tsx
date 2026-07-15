import { SectionHeading } from '@/components/SectionHeading';
import EnquiryManagement from '@/components/admin/EnquiryManagement';

export default function AdminEnquiriesPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Enquiries"
        title="Customer enquiries"
        description="Review uploaded tile images, customer details, and reply history from the admin dashboard."
      />
      <EnquiryManagement />
    </div>
  );
}
