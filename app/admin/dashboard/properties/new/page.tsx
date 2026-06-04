import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Create Property</h1>
      <PropertyForm />
    </div>
  );
}
