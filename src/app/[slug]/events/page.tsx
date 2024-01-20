import Layout from "@/components/layout";

const EventsPage = () => {
  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-col w-full space-y-5">
            <div className="flex justify-between">
              <p className="text-2xl font-bold text-blue-500">Events</p>
              <button className="flex space-x-4 py-3 px-6 rounded-lg bg-blue-500 text-white">
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
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">Kunjip Dinner</td>
                    <td className="text-center">
                      We are going to eat some beef lesgo
                    </td>
                    <td className="text-center">19 Jan, 8:30pm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;
