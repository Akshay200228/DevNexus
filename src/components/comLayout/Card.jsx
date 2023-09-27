"use client"
import { useEffect, useState } from 'react';
import { cardData } from '@/constants';
import Image from 'next/image';
import CardSkeleton from './CardSkeleton';
import Link from 'next/link';

export default function CardComponent() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            {/* Scrollable Cards */}
            <div className="w-full pt-10 overflow-y-auto text-white scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-gray-300 scrollbar-thumb-rounded-full" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {isLoading ? (
                        // Display skeleton loading when isLoading is true
                        [...Array(cardData.length)].map((_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    ) : (
                        cardData.map((card) => (
                            <Link key={card.id} href={`/component/${card.id}`}>
                                {/* <div className="p-4 bg-white rounded-lg shadow-[0px_22px_70px_4px_rgba(0,0,0,0.56)] h-96"> */}
                                <div className="p-4 bg-white rounded-lg shadow-xl h-96">
                                    <Image
                                        src={card.imageUrl}
                                        alt={`Card Image ${card.id}`}
                                        width={400}
                                        height={300}
                                        priority
                                        className="object-fill w-full mb-4 rounded-lg h-60"
                                    />
                                    <h2 className="mb-2 text-xl font-semibold text-gray-600">{card.title}</h2>
                                    <p className="text-gray-600">{card.content}</p>
                                </div>

                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
