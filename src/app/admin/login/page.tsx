import { LoginForm } from "@/components/admin/LoginForm";

/** Halaman login admin — hanya jembatan ke Server Action `loginAction`. */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <LoginForm />
    </div>
  );
}
