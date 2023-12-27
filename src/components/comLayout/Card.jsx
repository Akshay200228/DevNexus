"use client";
import { FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LivePreview, LiveProvider } from 'react-live';
import useApiFetch from '@/hooks/useApiFetch';
import Link from 'next/link';
import { useState } from 'react';
import NavigationButtons from './NavigationButtons';
import { CardSkeleton } from '../SkeltonLoading';
import { useAuth } from '@/hooks/useAuth';

export default function CardComponent() {
    const [page, setPage] = useState(1);
    // const apiUrl = `http://localhost:8000/api/code-components/?page=${page}`;
    const apiUrl = `${process.env.NEXT_PUBLIC_NEXUS_URL}/api/code-components?page=${page}`;
    const { data: cardData, isLoading, error } = useApiFetch(apiUrl);
    console.log(cardData)

    const authData = useAuth();
    const user = authData.user;
    const userId = user ? user._id : null;

    const handleNextPage = () => {
        setPage((prevPage) => {
            const nextPage = prevPage + 1;
            return nextPage;
        });
    };

    const handlePrevPage = () => {
        setPage((prevPage) => {
            const prevPageNumber = Math.max(prevPage - 1, 1);
            return prevPageNumber;
        });
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
                    className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                >
                    {cardData.map((card) => (
                        <motion.div
                            key={card._id}
                            initial={{ opacity: 0, scale: 0.5, translateY: 20, rotateY: -10, rotateX: -5 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0, rotateY: 0, rotateX: 0 }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                            whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                            className="flex flex-col h-full bg-white rounded-lg shadow-xl transform-style-preserve-3d hover:shadow-2xl"
                        >
                            <LiveProvider code={card.code}>
                                <motion.div
                                    className="min-h-[50vh] mb-4 bg-gradient-to-r from-blue-300 to-blue-200 relative overflow-hidden rounded-t-lg transform-style-preserve-3d"
                                    initial={{ rotateY: -10, rotateX: 10 }}
                                    animate={{ rotateY: 0, rotateX: 0 }}
                                    whileHover={{ rotateY: 5, rotateX: 5 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <div className="absolute inset-0 text-neutral-950">
                                        <LivePreview />
                                    </div>
                                </motion.div>
                            </LiveProvider>

                            <div className="flex items-center justify-between px-2 mb-2">
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={userId === card.createdBy ? `/profile` : `/profile/${card.createdBy}`}
                                        className="w-8 h-8 overflow-hidden rounded-full sm:w-12 sm:h-12"
                                    >
                                        <motion.img
                                            src={card.creatorAvatar || "https://dev-nexus.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdevLogo.8d21b413.png&w=640&q=75"}
                                            alt="User Image"
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full rounded-full"
                                            initial={{ rotateY: -10, rotateX: 10 }}
                                            animate={{ rotateY: 0, rotateX: 0 }}
                                            whileHover={{ rotate: 5 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        />
                                    </Link>
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
                                            className="text-sm text-gray-600"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
                                        >
                                            Category {card.category}
                                        </motion.p>
                                    </div>
                                </div>
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
