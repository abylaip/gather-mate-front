import Layout from "@/components/layout";

const FriendsPage = () => {
  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-col w-full space-y-5">
            <div className="flex justify-between">
              <p className="text-2xl font-bold text-blue-500">Friends</p>
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
                <p>Add New Friend</p>
              </button>
            </div>
            <div className="w-full">
              <div className="flex flex-col">
                <div className="flex flex-row space-x-5 items-center">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <p className="text-2xl">Zhomart Mukhamejanov</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FriendsPage;
