"use client";

import useApiFetch from "@/hooks/useApiFetch";
import { WebTemplatesDetailsSkeleton } from "../SkeltonLoading";
import { useEffect, useState } from "react";
import Container from "../homeLayout/Container";
import GoBackButton from "../comLayout/codeCompIds/GoBackButton";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';
import Link from 'next/link';

const TemplateById = ({ params }) => {
    const [isInteraction, setIsInteraction] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInteraction = () => {
        setIsInteraction(!isInteraction);
    };

    const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL;
    const WebTempApiUrl = `${apiUrl}/api/web-templates/${params.templatesID}`;

    const { data: webTemplate, isLoading, error } = useApiFetch(WebTempApiUrl);

    if (isLoading) {
        return <WebTemplatesDetailsSkeleton />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!webTemplate) {
        return <div>No data found for the specified template ID</div>;
    }
    return (
        <Container>
            <div className="flex items-center justify-between mb-4">
                <GoBackButton />
            </div>
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row"
            >
                {/* Left side (templateImage) */}
                <motion.div
                    className="bg-purple-400 cursor-pointer mx-2 mb-8 md:mb-0 w-96 h-[50vh] overflow-y-hidden relative"
                    initial={{ x: -100, opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onTap={handleInteraction}
                    onHoverStart={() => setIsInteraction(true)}
                    onHoverEnd={() => setIsInteraction(false)}
                >
                    <motion.img
                        src={webTemplate.templateImage}
                        alt={`Card Image ${webTemplate._id}`}
                        className="w-full h-auto transform rounded-lg"
                        style={{
                            transform: isInteraction ? 'translateY(-75%)' : 'translateY(0%)',
                            transition: 'transform 10s ease-in-out',
                            willChange: 'transform',
                        }}
                        transition={{ yoyo: Infinity }}
                    />
                </motion.div>

                {/* Right side (title, description, links, etc,.) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:w-2/3"
                >
                    <h2 className="mb-4 text-3xl font-semibold">{webTemplate.title}</h2>
                    <p className="mb-4 text-gray-600">{webTemplate.description}</p>

                    {/* Links */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-start gap-4 mb-4"
                    >
                        <Link
                            href={webTemplate.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 text-2xl text-gray-700 rounded-full hover:bg-gray-100"
                        >
                            <FaGithub className="mr-2" />
                            GitHub
                        </Link>

                        <a
                            href={webTemplate.deployLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 text-2xl text-gray-700 rounded-full hover:bg-gray-100"
                        >
                            <FaExternalLinkAlt className="mr-2" />
                            Deployed Link
                        </a>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Thanks section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
            >
                <h3 className="mb-4 text-2xl font-semibold">Thanks for exploring our templates!</h3>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at quam non libero pharetra convallis.
                    Proin ut vestibulum leo.
                </p>
            </motion.div>
        </Container>
    )
}

export default TemplateById
