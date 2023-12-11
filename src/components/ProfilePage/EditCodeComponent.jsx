"use client"
// EditCodeComponent.jsx
import { useState } from 'react';
import axios from 'axios';
import getCookie from '@/hooks/getCookie';
import { motion } from 'framer-motion';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';

const EditCodeComponent = ({ component, onCancelEdit }) => {
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

    const handleUpdate = async () => {
        try {
            // const apiUrl = "http://localhost:8000";
            const apiUrl = "https://devnexus-server.onrender.com";
            const response = await axios.put(
                `${apiUrl}/api/code-components/update/${component._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle update success
            console.log('Code component updated successfully:', response.data);
            // You might want to update the state or re-fetch data here

            onCancelEdit(); // Close the editing interface
        } catch (error) {
            console.error('Error updating code component:', error);
        }
    };

    const categories = ["Accordion", "Button", "Card", "Carousel", "Form", "Inputs", "Loaders", "Toast"];

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleUpdate}
            className="w-full p-6 mx-auto mt-4 bg-white rounded-lg shadow-lg"
        >
            <button
                onClick={onCancelEdit}
                className="flex items-center justify-end px-4 py-2 my-4 text-white transition duration-300 bg-blue-300 rounded-lg hover:bg-blue-400"
            >
                Go Back
            </button>

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
            <div className="flex mb-4">
                <div className="w-1/2">
                    <label htmlFor="code" className="block mb-2 text-sm font-bold text-gray-700">
                        Code
                    </label>
                    <LiveProvider code={formData.code}>
                        <LiveEditor onChange={(code) => setFormData({ ...formData, code })} />
                    </LiveProvider>
                </div>
                <div className="w-1/2 ml-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Preview</label>
                    <div className="bg-blue-200 h-[40vh] p-4">
                        <LivePreview />
                        <LiveError />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <button type="submit">Update</button>
                <button type="button" onClick={onCancelEdit}>
                    Cancel
                </button>
            </div>
        </motion.form>
    );
};

export default EditCodeComponent;