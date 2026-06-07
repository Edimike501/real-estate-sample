import { UserForm } from "@/components/admin/UserForm";

export default function CreateNewUserPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Create New User</h1>
      <UserForm />
    </div>
  );
}
