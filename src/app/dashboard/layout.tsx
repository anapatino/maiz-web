"use client";

import SlideBar from "@/components/slider/slide_bar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LayoutMenu({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const hasUserEmail = () => {
    return localStorage.getItem("user_email") !== null;
  };

  useEffect(() => {
    if (!hasUserEmail()) {
      router.push("/login");
    }
  }, []);

  return hasUserEmail() ? (
    <main className="flex min-h-screen w-full bg-black text-white">
      <SlideBar />
      {children}
    </main>
  ) : (
    <main className="flex min-h-screen w-full bg-black text-white"></main>
  );
}
