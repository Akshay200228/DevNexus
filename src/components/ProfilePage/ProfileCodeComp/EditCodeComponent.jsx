"use client"
// EditCodeComponent.jsx
import { useState } from 'react';
import axios from 'axios';
import getCookie from '@/hooks/getCookie';
import { motion } from 'framer-motion';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { Editor } from '@monaco-editor/react';
import { FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';

const EditCodeComponent = ({ component, onCancelEdit }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: component.title,
        description: component.description,
        code: component.code,
        category: component.category,
    });

    const token = getCookie('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCodeChange = (code) => {
        setFormData((prevData) => ({
            ...prevData,
            code: code,
        }));
    };


    const handleUpdate = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL;
            const response = await axios.put(
                `${apiUrl}/api/code-components/update/${component._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onCancelEdit(); // Close the editing interface
        } catch (error) {
            console.error('Error updating code component:', error);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const categories = ["Accordion", "Button", "Card", "Carousel", "Form", "Input", "Loader", "Toast"];

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleUpdate}
            className="w-auto p-6 mx-auto mt-4 bg-white rounded-lg shadow-lg"
        >
            {/* Title */}
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-bold text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-bold text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                />
            </div>

            {/* Category Dropdown */}
            <div className="mb-4">
                <label htmlFor="category" className="block mb-2 text-sm font-bold text-gray-700">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Code and Preview Section */}
            <div className="flex flex-col gap-2 mb-4 md:flex-row">
                <LiveProvider code={formData.code}>
                    <div className="w-full md:w-1/2">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Preview</label>
                        <div className="bg-blue-200 h-[50vh] p-4">
                            <LivePreview />
                            <LiveError />
                        </div>
                    </div>
                    <div className="w-full overflow-auto md:w-1/2">
                        <label htmlFor="code" className="block mb-2 text-sm font-bold text-gray-700">
                            Code
                        </label>
                        {/* <LiveEditor onChange={handleCodeChange} className='overflow-y-auto text-start bg-[#011627] h-[50vh]' /> */}
                        <Editor
                            height="50vh"
                            language="javascript" // Set the language according to your code
                            theme="vs-dark" // Set the theme according to your preference
                            value={formData.code}
                            onChange={handleCodeChange}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                            }}
                        />
                    </div>
                </LiveProvider>
            </div>

            <div className="flex justify-between mt-4">
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <FaCheck className="mr-2" />
                            Update
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <FaTimes className="mr-2" />
                    Cancel
                </button>
            </div>
        </motion.form>
    );
};

export default EditCodeComponent;