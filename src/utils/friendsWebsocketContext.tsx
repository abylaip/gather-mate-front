"use client";

import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const userId = localStorage.getItem("user_id");

export const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  query: { userId },
  transports: ["websocket"],
});

export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
