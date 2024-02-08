"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { Modal } from "@/components/modal";
import { buildAxios } from "@/utils/buildAxios";
import { formatDateString } from "@/utils/formatDateString";
import { WebsocketContext } from "@/utils/friendsWebsocketContext";

type Participant = {
  id: string;
  email: string;
  displayName: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  userId: string;
  participants: Participant[];
};

type UploadEvent = {
  title: string;
  description: string;
  date: string;
};

const EventsPage = () => {
  const router = useRouter();
  const contextSocket = useContext(WebsocketContext);
  const [showModal, setShowModal] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [friends, setFriends] = useState<Participant[]>([]);
  const [requestChange, setRequestChange] = useState<boolean>(false);
  const [path, setPath] = useState<string>();
  const [eventApplication, setEventApplication] = useState<UploadEvent>({
    title: "",
    description: "",
    date: "",
  });
  const [uploadParticipants, setUploadParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (contextSocket) {
      contextSocket.on("notifications", (data) => {
        setRequestChange(!requestChange);
      });
      return () => {
        contextSocket.off("notifications");
      };
    }
  }, [contextSocket]);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    setPath(email?.split("@")[0]);
    const userId = localStorage.getItem("user_id");
    setUploadParticipants([userId!]);
    buildAxios()
      .get(`events`)
      .then((response) => {
        setEvents(response.data);
      });

    buildAxios()
      .get(`friends/list`)
      .then((response) => {
        setFriends(response.data.friends);
      });
  }, [requestChange]);

  const createEvent = async () => {
    const res = await buildAxios().post(`events`, {
      ...eventApplication,
      participantIds: uploadParticipants,
    });
    if (res.status === 201) {
      setShowModal(false);
      setEventApplication({
        title: "",
        description: "",
        date: "",
      });
      setRequestChange(!requestChange);
    }
  };

  return (
    <Layout>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="flex flex-col space-y-3 w-full mt-2">
          <div className="flex flex-row space-x-3 w-full">
            <input
              type="text"
              className="p-2 border border-gray-200 rounded w-full"
              placeholder="Title"
              onChange={(e) =>
                setEventApplication({
                  ...eventApplication,
                  title: e.target.value,
                })
              }
              value={eventApplication.title}
            />
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-200 rounded"
              placeholder="Date/time"
              onChange={(e) =>
                setEventApplication({
                  ...eventApplication,
                  date: e.target.value,
                })
              }
              value={eventApplication.date}
            />
          </div>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={4}
            className="border border-gray-200 rounded p-2"
            placeholder="Description"
            onChange={(e) =>
              setEventApplication({
                ...eventApplication,
                description: e.target.value,
              })
            }
            value={eventApplication.description}
          />
          <div className="w-full border border-gray-200 rounded p-2">
            <select
              name="participants"
              id="participants"
              className="w-full outline-none"
              onChange={(e) => {
                setUploadParticipants([...uploadParticipants, e.target.value]);
              }}
            >
              <option value="">Select Participants</option>
              {friends.length > 0 &&
                friends.map((item: Participant, key: number) => (
                  <option value={item.id} key={key}>
                    {item.displayName}
                  </option>
                ))}
            </select>
          </div>
          <div></div>
          <button
            onClick={() => createEvent()}
            className="w-full text-white bg-blue-500 p-2 rounded"
          >
            Create Event
          </button>
        </div>
      </Modal>
      <Modal showModal={showPeopleModal} setShowModal={setShowPeopleModal}>
        <div className="grid grid-cols-2 gap-3 p-3 w-full">
          {participants.length > 0 &&
            participants.map((items: Participant, key: number) => (
              <div
                className="flex flex-row space-x-5 items-center p-2 border border-gray-300 rounded"
                key={key}
              >
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="text-lg">{items.displayName}</p>
              </div>
            ))}
        </div>
      </Modal>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-col w-full space-y-5">
            <div className="flex justify-between">
              <p className="text-2xl font-bold text-blue-500">Events</p>
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
                <p>Add New Event</p>
              </button>
            </div>
            <div className="w-full">
              <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="py-3 px-6 text-center">
                        Event
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        Description
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        Date/Time
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        Participants
                      </th>
                      <th scope="col" className="py-3 px-6 text-start">
                        Chat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 &&
                      events.map((items: Event, key: number) => (
                        <tr className="bg-white border-b" key={key}>
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap text-center"
                          >
                            {items.title}
                          </th>
                          <td className="py-4 px-6 text-center">
                            {items.description}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {formatDateString(items.date)}
                          </td>
                          <td className="py-4 px-6 flex justify-center">
                            <button
                              onClick={() => {
                                setParticipants(items.participants);
                                setShowPeopleModal(true);
                              }}
                              className="bg-gray-100 text-black text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
                            >
                              Show
                            </button>
                          </td>
                          <td className="">
                            <button
                              onClick={() =>
                                router.push(`/${path}/chats?id=${items.id}`)
                              }
                              className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
                            >
                              Open Chat
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;
