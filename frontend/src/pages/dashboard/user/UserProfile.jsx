import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../redux/features/auth/authApi';

import avatarImg from '../../../assets/avatar.png';
import { setUser } from '../../../redux/features/auth/authSlice';
import toastr from '../../../utils/toastConfig';
import UploadImage from '../admin/addProduct/UploadImage';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [editProfile, { isLoading, isError, error, isSuccess }] = useEditProfileMutation();

  const [formData, setformData] = React.useState({
    username: '',
    profileImage: '',
    bio: '',
    userId: '',
  });

  const [image, setImage] = React.useState('');

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setformData({
        username: user?.username || '',
        profileImage: user?.profileImage || '',
        bio: user?.bio || '',
        userId: user?._id || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (url) => {
    setformData((prev) => ({
      ...prev,
      profileImage: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      username: formData.username,
      profileImage: formData.profileImage,
      bio: formData.bio,
      userId: formData.userId || user?._id,
    };
    try {
      const response = await editProfile(updatedUser).unwrap();

      const mergedUser = { ...user, ...response.user };

      dispatch(setUser({ user: mergedUser }));
      localStorage.setItem('user', JSON.stringify(mergedUser));

      setImage('');

      toastr.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      toastr.error('Failed to update profile. Please try again');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <img src={formData?.profileImage || avatarImg} alt="" className="w-32 h-32 object-cover rounded-full" />
          <div className="ml-6">
            <h3 className="text-2xl font-semibold">Username: {formData?.username || 'N/A'}</h3>
            <p className="text-gray-700">User Bio: {formData.bio || 'N/A'}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="ml-auto text-blue-500 hover:text-blue-700">
            {/* Edit profile */}
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* show modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg md:w-96 max-w-xl mx-auto relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <i className="ri-close-line size-8 p-2 bg-black rounded-full"></i>
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 ">
                  Username
                </label>
                <input type="text" name="username" value={formData?.username} onChange={handleChange} placeholder="username" className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" required />
              </div>

              <UploadImage name="image" id="image" setImage={handleImageUpload} />
              {/*  */}

              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 ">
                  Write Your Bio
                </label>
                <textarea name="bio" row="3" className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" value={formData?.bio} onChange={handleChange} placeholder="add your bio"></textarea>
              </div>

              <button className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {isError && <p className="mt-2 text-red-500">Failed to update profile. Please try again</p>}
              {isSuccess && <p className="mt-2 text-green-500">Profile updated successfully!</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
