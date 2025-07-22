import React from 'react';
import { IKUpload } from 'imagekitio-react';
import axios from 'axios';

const authenticator = async () => {
    try {
        // Fetch the signature, token, and expire timestamp from your backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
        return response.data;
    } catch (error) {
        console.error("Authentication request failed:", error);
        throw new Error(`Authentication failed: ${error.message}`);
    }
};

const Upload = ({ onUploadSuccess }) => {
    const onError = (err) => {
        console.error("Upload error:", err);
      };

      const onSuccess = (res) => {
        console.log("Upload success:", res);
        if (onUploadSuccess) {
            onUploadSuccess(res.url); // Using res.url is often more direct
        }
      };

  return (
        <div>
            <IKUpload
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
        onError={onError}
        onSuccess={onSuccess}
                authenticator={authenticator}
                useUniqueFileName={true}
            />
            <p>Click above to upload a new cover image.</p>
      </div>
    );
};

export default Upload;