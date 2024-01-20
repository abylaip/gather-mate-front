import Layout from "@/components/layout";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="h-full w-full p-10">
        <div className="bg-white rounded-xl w-full h-3/4 shadow-2xl p-10">
          <div className="flex flex-col items-center space-y-5">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt=""
              className="h-52 w-52 rounded-full object-contain"
            />
            <p className="text-2xl font-semibold">Abylay Aiyp</p>
            <p className="text-2xl">ablyaip@gmail</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
