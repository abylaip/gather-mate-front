"use client";

import Link from "next/link";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  WebsocketContext,
  WebsocketProvider,
  socket,
} from "@/utils/friendsWebsocketContext";

type Notification = {
  status: string;
  message: string;
  senderName?: string;
  requestId?: string;
  path?: string;
  receiverId?: string;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const contextSocket = useContext(WebsocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [avatar, setAvatar] = useState<string | null>();
  const [path, setPath] = useState<string | null>();
  const [indicator, setIndicator] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef: any = useRef(null);
  const icons: any = {
    friend: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-blue-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
    accept: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-green-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
        />
      </svg>
    ),
    decline: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-red-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
        />
      </svg>
    ),
    event: (
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
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
        />
      </svg>
    ),
  };

  const paths = [
    {
      label: "Profile",
      path: `/${path}/profile`,
    },
    {
      label: "Events",
      path: `/${path}/events`,
    },
    {
      label: "Chats",
      path: `/${path}/chats`,
    },
    {
      label: "Friends",
      path: `/${path}/friends`,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (contextSocket) {
      contextSocket.on("connect", () => {
        console.log("connected");
      });
      contextSocket.on("notifications", (data) => {
        const newNotifications = [...notifications, data];
        setNotifications(newNotifications);
        localStorage.setItem("notifications", JSON.stringify(newNotifications));
        setIndicator(true);
      });
      return () => {
        contextSocket.off("connect");
        contextSocket.off("notifications");
      };
    }
  }, [contextSocket]);

  useEffect(() => {
    setAvatar(localStorage.getItem("user_picture"));
    const email = localStorage.getItem("user_email");
    setPath(email?.split("@")[0]);
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleToggleDropdown = () => {
    setIndicator(false);
    setIsOpen(!isOpen);
  };

  return (
    <WebsocketProvider value={socket}>
      <div className="flex flex-col relative max-h-screen overflow-hidden">
        <div className="w-full top-0 z-10 py-5 bg-white shadow-lg">
          <div className="px-32 flex w-full justify-between items-center">
            <p className="font-semibold text-blue-500">Gather Mate</p>
            <div className="flex flex-row space-x-4 relative">
              <button
                onClick={handleToggleDropdown}
                className="hover:text-blue-500 text-gray-500 cursor-pointer"
              >
                {indicator ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
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
                )}
              </button>
              {isOpen && (
                <div
                  className="absolute rounded-lg shadow-md border border-gray-100 p-4 bg-white top-9 right-10 w-96"
                  ref={dropdownRef}
                >
                  <div className="flex flex-col space-y-3">
                    {notifications.length > 0 ? (
                      notifications.map((item: Notification, key: number) => (
                        <div key={key} className="">
                          <div className="flex flex-row space-x-3 items-center mb-1">
                            {icons[item.status]}
                            <p className="text-sm">
                              {item.message}{" "}
                              <span className="font-semibold">
                                {item.senderName}
                              </span>
                            </p>
                          </div>
                          {key < notifications.length - 1 && <hr />}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No notifications</p>
                    )}
                  </div>
                </div>
              )}
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
                  pathname === item.path
                    ? "bg-blue-400 text-white"
                    : "hover:bg-blue-100 hover:text-black"
                } font-semibold text-center cursor-pointer`}
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
    </WebsocketProvider>
  );
};

export default Layout;
