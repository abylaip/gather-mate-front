"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { buildAxios } from "@/utils/buildAxios";
import { Modal } from "@/components/modal";
import { useDebounce } from "@/utils/useDebounce";

type Friend = {
  id: string;
  email: string;
  displayName: string;
};

type ReceiveRequest = {
  request_id: string;
  email: string;
  displayName: string;
};

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchedValues, setSearchedValues] = useState<Friend[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [requestChange, setRequestChange] = useState(false);
  const [receives, setReceives] = useState<ReceiveRequest[]>([]);
  const debouncedValue = useDebounce<string>(searchValue, 500);

  useEffect(() => {
    if (debouncedValue.length > 0) {
      buildAxios()
        .get(`friends/search?query=${debouncedValue}`)
        .then((response) => {
          setSearchedValues(response.data);
        });
    }

    if (showModal === false) {
      setSearchValue("");
      setSearchedValues([]);
    }
  }, [debouncedValue, showModal]);

  useEffect(() => {
    buildAxios()
      .get(`friends/list`)
      .then((response) => {
        setFriends(response.data.friends);
      });

    buildAxios()
      .get(`friends/sent-requests`)
      .then((response) => {
        let requests: string[] = [];
        response.data.forEach((item: any) => {
          requests.push(item.receiverId);
        });
        setSent(requests);
      });

    buildAxios()
      .get(`friends/received-requests`)
      .then((response) => {
        let requests: ReceiveRequest[] = [];
        response.data.forEach((item: any) => {
          requests.push({
            request_id: item.id,
            displayName: item.Sender.displayName,
            email: item.Sender.email,
          });
        });
        setReceives(requests);
      });
  }, [requestChange]);

  const sendFriendRequest = async (receiverId: string) => {
    const res = await buildAxios().post(
      `friends/send-friend-request/${receiverId}`
    );
    if (res.status === 201) {
      setSent([...sent, receiverId]);
    }
  };

  const acceptRequest = async (requestId: string) => {
    const res = await buildAxios().patch(`friends/${requestId}/accept`);
    if (res.status === 200) {
      setRequestChange(!requestChange);
    }
  };

  const declineRequest = async (requestId: string) => {
    const res = await buildAxios().patch(`friends/${requestId}/decline`);
    if (res.status === 200) {
      setRequestChange(!requestChange);
    }
  };

  return (
    <Layout>
      <Modal setShowModal={setShowModal} showModal={showModal}>
        <div className="flex flex-col w-full pt-3 space-y-4">
          <input
            type="text"
            className="w-full border border-gray-200 p-3 rounded-lg"
            placeholder="Write name or email"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          {!!searchedValues &&
            searchedValues.map((item: Friend) => (
              <div className="flex flex-row justify-between" key={item.id}>
                <div className="flex flex-row space-x-4">
                  <p className="text-xl">{item.displayName}</p>
                  <p className="text-xl">{item.email}</p>
                </div>
                <button
                  onClick={() => sendFriendRequest(item.id)}
                  className={`px-4 py-2 border ${
                    sent.includes(item.id) ? "bg-green-500 text-white" : ""
                  } border-gray-200 rounded-lg`}
                  disabled={sent.includes(item.id)}
                >
                  {sent.includes(item.id) ? (
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
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
                        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
        </div>
      </Modal>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-col w-full space-y-5">
            <div className="flex justify-between">
              <p className="text-2xl font-bold text-blue-500">Friends</p>
              <button
                onClick={() => setShowModal(true)}
                className="flex space-x-4 py-3 px-6 rounded-lg bg-blue-500 text-white"
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
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p>Add New Friend</p>
              </button>
            </div>
            <div className="w-full">
              {receives.length > 0 && (
                <div className="flex flex-col border border-gray-100 rounded-lg p-3">
                  <p className="text-xl mb-3">Friend Requests</p>
                  {receives.map((item: ReceiveRequest) => (
                    <div
                      className="flex flex-row justify-between"
                      key={item.request_id}
                    >
                      <div className="flex flex-row space-x-5 items-center">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                          alt=""
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <p className="text-2xl">{item.displayName}</p>
                        <p className="text-2xl">{item.email}</p>
                      </div>
                      <div className="flex flex-row space-x-2">
                        <button
                          onClick={() => acceptRequest(item.request_id)}
                          className="px-4 py-2 border bg-green-500 text-white border-gray-200 rounded-lg"
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
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => declineRequest(item.request_id)}
                          className="px-4 py-2 border bg-red-500 text-white border-gray-200 rounded-lg"
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
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                {!!friends &&
                  friends.map((item: Friend) => (
                    <div
                      className="flex flex-row space-x-5 items-center"
                      key={item.id}
                    >
                      <img
                        src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                        alt=""
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <p className="text-2xl">{item.displayName}</p>
                      <p className="text-2xl">{item.email}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FriendsPage;
