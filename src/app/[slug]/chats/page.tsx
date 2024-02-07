"use client";

import { useState, useEffect, useCallback, KeyboardEvent, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Layout from "@/components/layout";
import { buildAxios } from "@/utils/buildAxios";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "ws://localhost:3001";

type Group = {
  id: string;
  title: string;
};

type Participant = {
  id: string;
  email: string;
  displayName: string;
};

type Message = {
  group_id: string;
  user_id: string;
  content: string;
};

const ChatsPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [groups, setGroups] = useState<Group[]>();
  const [request, setRequest] = useState<boolean>(false);
  const [chosenGroup, setChosenGroup] = useState<string>();
  const [messages, setMessages] = useState<Message[]>();
  const [content, setContent] = useState<string>("");
  const [userId, setUserId] = useState<string>();
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketIo = io(SOCKET_SERVER_URL, { transports: ["websocket"] });
    socketIo.on("connect", () => {
      console.log("Connected to the server");
    });
    setSocket(socketIo);
    setRequest(!request);
    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      const { current: container } = messagesEndRef;
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (newMessage: any) => {
        if (messages) setMessages([...messages, newMessage]);
      });
    }
    return () => {
      if (socket) {
        socket.off("new_message");
      }
    };
  }, [socket, messages]);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    setUserId(id!);
    const groupId = params.get("id");
    buildAxios()
      .get("/chats/groups")
      .then((response) => {
        const firstGroup = response.data[0].id;
        if (!groupId && firstGroup) {
          const newParams = new URLSearchParams(params.toString());
          newParams.set("id", firstGroup);
          router.push(pathname + "?" + newParams.toString());
          setRequest(!request);
        }
        setGroups(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const groupId = params.get("id");
    socket?.emit("room", groupId);
    const getMessages = async () => {
      try {
        const response = await buildAxios().get(`/chats/messages/${groupId}`);
        if (response.status === 200) {
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (groupId) {
      getMessages();
    }
  }, [request, params]);

  useEffect(() => {
    const groupId = params.get("id");
    if (groupId) {
      setChosenGroup(groupId);
    }

    const createGroup = async () => {
      try {
        const response = await buildAxios().get(`/events/${groupId}`);
        const event = response.data;

        const participants = event.participants.map(
          (item: Participant) => item.id
        );

        const exists = groups?.some((item) => item.id === event.id);
        if (!exists) {
          await buildAxios().post("/chats/group", {
            id: event.id,
            title: event.title,
            members: participants,
          });
          setRequest(!request);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (groupId) {
      createGroup();
    }
  }, [params]);

  const sendMessage = async () => {
    try {
      if (content.length > 0) {
        const response = await buildAxios().post("/chats/message", {
          group_id: chosenGroup,
          user_id: userId,
          content: content,
        });
        if (response.status === 201) {
          setContent("");
          socket?.emit("send_message", {
            room: chosenGroup,
            group_id: chosenGroup,
            user_id: userId,
            content: content,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-row space-x-3 h-full">
            <div className="w-80 h-full flex flex-col space-y-2 overflow-y-scroll">
              {groups ? (
                groups.map((item: Group, key: number) => (
                  <div key={key}>
                    <SideChat
                      title={item.title}
                      id={item.id}
                      chosenGroup={chosenGroup}
                      setRequest={setRequest}
                      request={request}
                    />
                  </div>
                ))
              ) : (
                <p>No groups</p>
              )}
            </div>
            <div className="flex flex-col w-full border border-gray-300 rounded-lg">
              <div
                ref={messagesEndRef}
                className="flex-grow overflow-y-auto p-3 space-y-2"
              >
                {messages?.map((item: Message, key: number) => (
                  <div
                    key={key}
                    className={`flex ${
                      item.user_id === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        item.user_id === userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 p-2">
                <div className="flex flex-row items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="rounded-lg p-2 focus:outline-none border border-gray-300 hover:bg-gray-100"
                  >
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
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SideChat = ({
  title,
  id,
  chosenGroup,
  setRequest,
  request,
}: {
  title: string;
  id: string;
  chosenGroup: string | undefined;
  setRequest: any;
  request: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <div
      onClick={() => {
        router.push(pathname + "?" + createQueryString("id", id));
        setRequest(!request);
      }}
      className={`w-full border-2 ${
        id === chosenGroup ? "border-blue-400 bg-slate-100" : "border-gray-300"
      } rounded-lg py-4 px-6 cursor-pointer hover:bg-slate-50 text-gray-800 font-medium shadow-sm`}
    >
      {title}
    </div>
  );
};

export default ChatsPage;
