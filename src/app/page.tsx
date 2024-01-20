"use client";

const Home = () => {
  const handleGoogleOauth = () => {
    window.location.href = "http://localhost:3001/api/auth/google/login";
  };
  return (
    <div className="h-screen flex flex-row items-center justify-center bg-slate-100 space-x-32">
      <div className="flex flex-col">
        <p className="text-3xl font-bold text-blue-500">Gather Mate</p>
        <p className="text-xl font-semibold">
          Together We Thrive: Where Friendship <br />
          Sparks Unforgettable Events!
        </p>
      </div>
      <div className="flex flex-col space-y-5 rounded-xl bg-white shadow-2xl p-10">
        <p className="font-semibold text-gray-600">You can sign in with:</p>
        <div className="flex flex-row space-x-6">
          <button
            onClick={handleGoogleOauth}
            className="opacity-50 hover:opacity-100 cursor-pointer"
          >
            <img
              src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
              alt=""
              className="h-10 w-10"
            />
          </button>
          <button className="opacity-50 hover:opacity-100 cursor-pointer">
            <img
              src="https://www.edigitalagency.com.au/wp-content/uploads/Facebook-logo-blue-circle-large-transparent-png.png"
              alt=""
              className="h-10 w-10"
            />
          </button>
          <button className="opacity-50 hover:opacity-100 cursor-pointer">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_icon_2.svg/2048px-X_icon_2.svg.png"
              alt=""
              className="h-10 w-10"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
