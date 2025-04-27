import React from 'react';
import axios from 'axios';

import toastr from '../../../../utils/toastConfig';

import { getBaseUrl } from '../../../../utils/baseURL';
const UploadImage = ({ name, setImage }) => {
  const [loading, setLoading] = React.useState(false);
  const [url, setUrl] = React.useState('');

  // base64 functionality

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // request to upload a file
  const uploadSingleImage = (base64) => {
    setLoading(true);
    axios
      .post(`${getBaseUrl()}/uploadImage`, { image: base64 })
      .then((res) => {
        const imageUrl = res.data;
        setUrl(imageUrl);
        // console.log(imageUrl);
        toastr.success('Image uploaded successfully');
        setImage(imageUrl);
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const uploadImage = async (event) => {
    const files = event.target.files;

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }

    const base64s = [];
    for (let i = 0; i < files.length; i++) {
      const base = await convertBase64(files[i]);
      base64s.push(base);
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        Upload Image
      </label>
      <input type="file" name={name} id={name} onChange={uploadImage} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" />
      {loading && <div className="mt-2 text-sm text-blue-600">uploading...</div>}
      {url && (
        <div className="mt-2 text-sm text-green-600">
          <p>Image uploaded successfully!</p>
          <img src={url} alt="uploaded-image" />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
