// useAvatarUpload.js
import axios from 'axios';
import { useState, useEffect } from 'react';

const useAvatarUpload = (token, cloudinaryUrl) => {
    const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, error: null });
    const apiUrl = "https://devnexus-server.onrender.com"

    useEffect(() => {
        const uploadAvatar = async () => {
            setUploadStatus({ loading: true, success: false, error: null });

            try {
                // const response = await fetch(`${apiUrl}/api/users/upload-avatar`, {
                // const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_URL}/api/users/upload-avatar`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${token}`,
                //     },
                //     body: JSON.stringify({ url: cloudinaryUrl }),
                // });

                const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXUS_URL}/api/users/upload-avatar`, {
                    url: cloudinaryUrl,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to upload Cloudinary URL to the server');
                }

                // Store Cloudinary URL in local storage
                localStorage.setItem('userAvatar', cloudinaryUrl);

                setUploadStatus({ loading: false, success: true, error: null });
            } catch (error) {
                setUploadStatus({ loading: false, success: false, error: error.message });
            }
        };

        if (cloudinaryUrl) {
            uploadAvatar();
        }
    }, [token, cloudinaryUrl]);

    return uploadStatus;
};

export default useAvatarUpload;
