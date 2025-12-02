'use client';

import type { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

export default function RegisterPage() {
      useEffect(() => {
      document.title = 'Register';
    }, []);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age), // Convert string to number
    };

   try {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const data = await res.json();

    // Save token if present
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
console.log(data);
    toast.success("User registered successfully!");

    // setTimeout(() => {
    //   router.push("/admin/dashboard");
    // }, 1200);
  } else {
    const error = await res.json();

    if (error.errors && Array.isArray(error.errors)) {
      // Display each error message from validation array
      error.errors.forEach((err: { msg: string }) => {
        toast.error(err.msg);
      });
    } else {
      toast.error(error.message || "Registration failed.");
    }
  }
} catch (err) {
  toast.error("Could not connect to the server.");
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" value={form.name} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={form.age} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full mt-4">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
