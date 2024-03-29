"use client"
import React, { useEffect, useState } from 'react';
import Container from "@/components/homeLayout/Container";
import { useAuth } from "@/hooks/useAuth";
import axios from 'axios';
import Loader from '@/components/Loader';
import UserProfileContainer from '@/components/ProfilePage/UserProfileContainer';
import useFollowerFollowing from '@/hooks/useFollowerFollowing';

export default function UserProfile() {
    const { user, error, isLoading } = useAuth();
    const [userData, setUserData] = useState(null);
    const [codeComponentsData, setCodeComponentsData] = useState([]);
    const [webTemplatesData, setWebTemplatesData] = useState([]);
    const { followerCount, followingCount, updateCounts } = useFollowerFollowing();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user && user._id && !userData) { // Add condition to fetch data only if userData is null
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL || "https://devnexus-server.onrender.com";
                    const userResponse = await axios.get(`${apiUrl}/api/users/${user._id}`);
                    setUserData(userResponse.data);

                    // Fetch detailed data for code components
                    const codeCompIds = userResponse.data.codeComponents.join(',');
                    if (codeCompIds) {
                        const codeComponentsResponse = await axios.get(`${apiUrl}/api/code-components/ids/${codeCompIds}`);
                        const codeComponentsData = codeComponentsResponse.data;
                        setCodeComponentsData(codeComponentsData.filter(Boolean));
                    } else {
                        console.log('No code components IDs to fetch');
                    }

                    // Fetch detailed data for web templates
                    const webTemplateIds = userResponse.data.webTemplates.join(',');
                    if (webTemplateIds) {
                        const webTemplatesResponse = await axios.get(`${apiUrl}/api/web-templates/details/${webTemplateIds}`);
                        const webTemplatesData = webTemplatesResponse.data;
                        setWebTemplatesData(webTemplatesData.filter(Boolean));
                    } else {
                        console.log('No web template IDs to fetch');
                    }
                    updateCounts(userResponse.data.followerCount || 0, userResponse.data.following.length || 0);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserDetails();
    }, [user, userData, updateCounts]); // Add userData to dependencies to prevent re-fetching

    return (
        <Container>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <div className="mt-8 text-center text-red-600">
                    Error: {error.message}
                </div>
            ) : (
                <UserProfileContainer
                    user={user}
                    userData={userData}
                    codeComponentsData={codeComponentsData}
                    webTemplatesData={webTemplatesData}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    loading={isLoading}
                />
            )}
        </Container>
    );
}
