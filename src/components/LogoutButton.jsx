"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }
  return (
    <button onClick={handleLogout} className="inline-flex items-center text-sm text-gray-800 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg cursor-pointer">Logout</button>
  );
}


