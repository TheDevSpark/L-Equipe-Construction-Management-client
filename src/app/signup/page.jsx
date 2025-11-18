"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fullName, email, phoneNumber, password, confirmPassword } = formData;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Sign up user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: phoneNumber,
            role: 'client' // This will be used by the trigger
          },
          emailRedirectTo: `${window.location.origin}/dashboard/client`,
        },
      });

      if (signUpError) throw new Error(signUpError.message);

      // Check if email confirmation is required
      if (authData.user?.identities?.length === 0) {
        // Email confirmation required
        toast.success('Please check your email to confirm your account');
        router.push('/login');
      
      // } else {
      //   // If no email confirmation needed, sign in the user
      //   const { error: signInError } = await supabase.auth.signInWithPassword({
      //     email,
      //     password,
      //   });

      //   if (signInError) throw new Error(signInError.message);
        
        // Wait a brief moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast.success('Account created successfully!');
        router.push('/dashboard/client');
        router.refresh();
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow px-6 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500">Join ClientHub to manage your legal cases</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


