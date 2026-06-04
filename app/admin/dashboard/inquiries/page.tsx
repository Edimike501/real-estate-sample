import { InquiryTable } from "@/components/admin/InquiryTable";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Inquiries</h1>
      <InquiryTable />
    </div>
  );
}
