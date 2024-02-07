"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";

const AuthCodePage = () => {
  const searchParams = useSearchParams();
  if (typeof window !== "undefined" && !searchParams.get("code")) {
    return <DefaultComponent />;
  } else {
    return <AuthCode />;
  }
};

const AuthCode = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loggedIn, setLoggedIn] = useState(false);
  let flag = false;

  const getAuthTokens = async () => {
    flag = true;
    let auth_code = String(searchParams.get("code"));
    const params = new URLSearchParams();
    params.append("code", auth_code);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/exchange-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );
      if (response.ok) {
        const data = await response.json();
        const expiresInDays = data.expires_in / 86400;
        const [emailPath] = data.email.split("@");
        Cookies.set("access_token", data.id_token, { expires: expiresInDays });
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_picture", data.picture);
        localStorage.setItem("user_id", data.user_id);
        router.push(`/${emailPath}/profile`);
        setLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let path = localStorage.getItem("user_email");
    if (localStorage.getItem("access_token")) {
      router.push(`/${path?.split("@")[0]}/profile`);
    }
    if (!flag) {
      getAuthTokens();
    }
  }, []);

  return (
    <div className="w-full flex flex-row justify-center pt-10">
      {loggedIn ? (
        <p className="text-blue-500 font-bold">Success</p>
      ) : (
        <ClipLoader
          color={"#7a7777"}
          loading={true}
          size={35}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
};

const DefaultComponent = () => {
  return <div>wroong</div>;
};

export default AuthCodePage;
