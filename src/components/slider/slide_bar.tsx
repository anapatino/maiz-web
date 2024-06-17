"use client";

import React, { useState } from "react";
import Image from "next/image";
import uichecksgrid from "../../../public/svg/slidebar/uichecksgrid.svg";
import uicheckslist from "../../../public/svg/slidebar/uicheckslist.svg";
import dooropenfill from "../../../public/svg/slidebar/dooropenfill.svg";
import maiz from "../../../public/svg/maiz.svg";
import { usePathname, useRouter } from "next/navigation";

const SlideBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: "dashboard/category", icon: uichecksgrid, label: "Category" },
    { path: "dashboard/product", icon: uicheckslist, label: "Product" },
  ];

  const navigateTo = (path: string) => {
    router.push(`/${path}`);
  };

  return (
    <div
      className={`bg-[#1E1E1E] text-white h-screen p-4 rounded-r-lg relative max-phone:hidden `}
    >
      <div className="flex justify-center py-10">
        <div className="w-1/3 h-1/3 ">
          <Image src={maiz} alt="maiz SVG" layout="responsive" />
        </div>
      </div>
      <div className="space-y-6 mt-8 ml-2  items-center">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-4 w-full text-left"
            onClick={() => navigateTo(item.path)}
          >
            <Image
              src={item.icon}
              alt={`${item.label} Icon`}
              width={24}
              height={24}
            />
            <h4 className="text-lg font-bold tracking-wider">{item.label}</h4>
          </button>
        ))}
      </div>
      <div className="absolute bottom-0 mb-4 w-[80%]">
        <button
          className="flex justify-start"
          onClick={() => {navigateTo("login");
            localStorage.removeItem('user_email');
          }}
        >
          <Image src={dooropenfill} alt="Product Icon" width={24} height={24} />
          <h4 className="ml-2 text-lg font-bold tracking-wider">Exit</h4>
        </button>
      </div>
    </div>
  );
};

export default SlideBar;
