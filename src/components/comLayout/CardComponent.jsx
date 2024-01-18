"use client";
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LivePreview, LiveProvider } from 'react-live';
import NavigationButtons from './NavigationButtons';
import { CardSkeleton } from '../SkeltonLoading';
import useBookmark from '@/hooks/useBookmark';
import { IoBookmark } from "react-icons/io5";
import { FaCode } from 'react-icons/fa';
import UserAvatar from '../UserAvatar';

export default function CardComponent({ user, userId, apiUrl, page }) {
    const router = useRouter()

    const [cardData, setCardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateBookmarkCount = (codeComponentId, isBookmarkAdded) => {
        setCardData((prevData) => {
            return prevData.map((card) => {
                if (card._id === codeComponentId) {
                    return {
                        ...card,
                        bookmarks: isBookmarkAdded ? [...card.bookmarks, userId] : card.bookmarks.filter((id) => id !== userId),
                    };
                }
                return card;
            });
        });
    };

    const { bookmarkStates, handleAddBookmark } = useBookmark(user ? user.bookmarks : [], updateBookmarkCount);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(apiUrl);
                setCardData(response.data);
                setIsLoading(false);
                console.log("response: ", response.data)
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, page]);


    const handleNextPage = () => {
        const nextPage = page + 1;
        router.push(`/component?page=${nextPage}`);
    };

    const handlePrevPage = () => {
        const prevPage = page - 1;
        router.push(`/component?page=${prevPage}`);
    };

    return (
        <div className="w-full pt-4 text-white">
            {isLoading ? (
                <CardSkeleton count={9} />
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 gap-8 p-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                >
                    {cardData.map((card) => (
                        <motion.div
                            key={card._id}
                            initial={{ rotateY: -10, rotateX: 10 }}
                            animate={{ rotateY: 0, rotateX: 0 }}
                            whileHover={{ rotateY: 10, rotateX: 5 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="relative flex flex-col h-auto bg-white rounded-lg shadow-xl transform-style-preserve-3d hover:shadow-2xl"
                        >
                            <LiveProvider code={card.code}>
                                <div className="min-h-[50vh] mb-4 bg-gradient-to-r from-blue-300 to-blue-200 relative overflow-auto rounded-t-lg transform-style-preserve-3d">
                                    <div className="absolute inset-0 overflow-auto text-neutral-950 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-blue-200">
                                        <LivePreview />
                                    </div>
                                </div>
                            </LiveProvider>

                            <div className="flex items-center justify-between px-2 mb-2">
                                <div className="flex items-center space-x-3">
                                    {/* User avatar */}
                                    <UserAvatar createdBy={card.createdBy} creatorAvatar={card.creatorAvatar} />

                                    <div>
                                        <motion.div
                                            className="text-lg font-semibold text-gray-800 md:text-2xl "
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                                        >
                                            {card.title}
                                        </motion.div>
                                        <motion.p
                                            className="text-xs text-gray-600 md:text-sm"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                                        >
                                            Category {card.category}
                                        </motion.p>
                                    </div>
                                </div>

                                {/* Bookmark button */}
                                {bookmarkStates && bookmarkStates[card._id] ? (
                                    // Remove Bookmark button
                                    <motion.button
                                        onClick={() => handleAddBookmark(card._id)} // Updated to handle removal
                                        className={`absolute z-10 p-2 text-white bg-green-500 rounded-full top-2 right-2 transition-transform duration-300 transform hover:scale-110`}
                                        initial={{ opacity: 1 }}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <IoBookmark className="text-xl md:text-2xl" />
                                            <span className="ml-1 text-sm text-white">
                                                {card.bookmarks.length}
                                            </span>
                                        </div>
                                    </motion.button>
                                ) : (
                                    // Add Bookmark button
                                    <motion.button
                                        onClick={() => handleAddBookmark(card._id)}
                                        className={`absolute z-10 p-2 text-white bg-blue-500 rounded-full top-2 right-2 transition-all duration-300 transform hover:scale-110 hover:bg-blue-600`}
                                        initial={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            initial={{ y: -10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                                            className="flex items-center space-x-1"
                                        >
                                            <IoBookmark className="text-xl md:text-2xl" />
                                            {card.bookmarks.length > 0 && (
                                                <span className="ml-1 text-sm text-white">
                                                    {card.bookmarks.length}
                                                </span>
                                            )}
                                        </motion.div>
                                    </motion.button>
                                )}

                                <Link href={`/component/${card._id}`}>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ scale: 1, opacity: 0.9 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-4 py-2 text-white transition-transform duration-300 ease-in-out rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl focus:outline-none focus:ring focus:border-blue-300 transform-style-preserve-3d"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <motion.div
                                                initial={{ scale: 0.8, rotateY: -10, rotateX: 10 }}
                                                animate={{ scale: 1, rotateY: 0, rotateX: 0 }}
                                                transition={{ yoyo: Infinity, duration: 1.5 }}
                                            >
                                                <FaCode className="text-xl md:text-3xl" />
                                            </motion.div>
                                            <span className="text-lg">Explore</span>
                                        </div>
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            <NavigationButtons
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                page={page}
                cardData={cardData}
            />
        </div>
    );
}