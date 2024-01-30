import Layout from "@/components/layout";

const ChatsPage = () => {
  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-5/6 shadow-2xl p-10">
          <div className="flex flex-row space-x-3 h-full">
            <div className="w-80 h-full flex flex-col space-y-2 overflow-y-scroll">
              <SideChat></SideChat>
            </div>
            <div className="flex flex-col w-full border border-gray-300 rounded-lg">
              <div className="flex-grow overflow-y-auto p-3 space-y-2">
                {/* Messages will go here */}
              </div>
              <div className="border-t border-gray-300 p-2">
                <div className="flex flex-row items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <button className="rounded-lg p-2 focus:outline-none border border-gray-300">
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

const SideChat = () => {
  return (
    <div className="w-full border border-gray-300 rounded-lg py-4 px-6 cursor-pointer hover:bg-slate-50 text-gray-800 font-medium shadow-sm">
      Going to Kunjip
    </div>
  );
};

export default ChatsPage;
