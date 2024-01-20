"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState<string | null>();
  useEffect(() => {
    setAvatar(localStorage.getItem("user_picture"));
  }, []);
  const paths = [
    {
      label: "Profile",
      path: "/abylaip/profile",
    },
    {
      label: "Events",
      path: "/abylaip/events",
    },
    {
      label: "Friends",
      path: "/abylaip/friends",
    },
  ];
  return (
    <div className="flex flex-col relative max-h-screen overflow-hidden">
      <div className="w-full top-0 z-10 py-5 bg-white shadow-lg">
        <div className="px-32 flex w-full justify-between items-center">
          <p className="font-semibold text-blue-500">Gather Mate</p>
          <div className="flex flex-row space-x-4">
            <button className="hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>
            <img
              src={
                avatar ??
                "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              }
              alt=""
              className="h-10 w-10 rounded-full object-contain"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-80 py-20 px-2 flex flex-col space-y-50 shadow-2xl">
          {paths.map((item: any, key: number) => (
            <Link
              href={item.path}
              key={key}
              className={`rounded p-3 w-full ${
                pathname === item.path ? "bg-blue-400 text-white" : ""
              } font-semibold text-center`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="w-full h-screen bg-slate-100 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
