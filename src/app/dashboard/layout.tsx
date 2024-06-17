"use client";

import SlideBar from "@/components/slider/slide_bar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutMenu({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasUserEmail = () => {
      return localStorage.getItem("user_email") !== null;
    };

    if (!hasUserEmail()) {
      router.push("/login");
    }
  }, [router]);

  if (!isClient) {
    return (
      <main className="flex min-h-screen w-full bg-black text-white"></main>
    );
  }

  return (
    <main className="flex min-h-screen w-full bg-black text-white">
      {isClient && localStorage.getItem("user_email") !== null && (
        <>
          <SlideBar />
          {children}
        </>
      )}
    </main>
  );
}
