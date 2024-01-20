"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout";

type User = {
  email: string | null;
  picture: string | null;
  name: string | null;
};

const ProfilePage = () => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser({
      email: localStorage.getItem("user_email"),
      picture: localStorage.getItem("user_picture"),
      name: localStorage.getItem("user_name"),
    });
  }, []);
  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-3/4 shadow-2xl p-10">
          <div className="flex flex-col items-center space-y-5">
            <img
              src={
                user?.picture ??
                "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              }
              alt=""
              className="h-52 w-52 rounded-full object-contain"
            />
            <p className="text-2xl font-semibold">{user?.name}</p>
            <p className="text-2xl">{user?.email}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
