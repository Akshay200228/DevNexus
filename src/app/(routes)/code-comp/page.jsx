"use client"
import { useState } from 'react';
import axios from 'axios';
import Container from '@/components/homeLayout/Container';
import getCookie from '@/context/getCookie';
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';

const CreateCodeComponentForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        code: '<div className="flex items-center p-4 justify-center h-[50vh]">\n\t\t//code here \n</div>',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = getCookie('token');
            console.log("Token", token);

            const response = await axios.post(`http://localhost:8000/api/code-components/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Code component created:', response.data);
        } catch (error) {
            console.error('Error creating code component:', error);
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit} className="max-w-full mx-auto mt-4">
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-2 text-sm font-bold text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2 text-sm font-bold text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-4 mb-4">
                    <div className='w-[50%] bg-blue-200 h-[50vh] overflow-y-auto'>
                        <LivePreview />
                    </div>
                    <div style={{ width: '50%' }}>
                        <LiveProvider code={formData.code}>
                            <LiveEditor
                                className="overflow-y-auto bg-slate-900 h-[50vh]"
                            />
                        </LiveProvider>
                    </div>
                </div>
                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Create Code Component
                </button>
            </form>
        </Container>
    );
};

export default CreateCodeComponentForm;
