"use client"
// WebTemplate.jsx
import CreateButton from '../../CreateButton';
import Link from 'next/link';
import EditWebTemplate from './EditWebTemplate';
import { FaCode, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Message from '@/components/comLayout/create-code-comp/Message';
import CustomModal from '../CustomModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import useComponent from '@/hooks/useComponent';

const WebTemplate = ({ webTemplates }) => {
  const {
    editingComponent,
    confirmDelete,
    showDeleteMessage,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    confirmDeleteHandler,
    setConfirmDelete,
  } = useComponent(webTemplates, process.env.NEXT_PUBLIC_NEXUS_URL, 'web-templates', 'webTempId');

  return (
    <div className="mt-10 text-center">
      <h3 className="mb-8 text-3xl font-bold text-gray-800">Web Templates</h3>

      {webTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-8 text-gray-600">
          <p className="mb-4 text-2xl font-bold text-center">No web templates found for this user.</p>
          <p className="mb-4 text-lg text-center text-gray-500">
            Explore amazing templates or create your first one now!
          </p>
          <CreateButton navigateTo="/create-template" text="Create WebTemplate" />
        </div>
      ) : (
        <div>
          {editingComponent ? (
            <EditWebTemplate template={editingComponent} onCancelEdit={handleCancelEdit} />
          ) : (
            <div>
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                grabCursor={true}
                loop={false}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                speed="3000"
                modules={[Autoplay]}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1170: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}
              >
                {webTemplates.map((template) => (
                  <SwiperSlide key={template._id}>
                    <div className="p-4 mb-8 border rounded shadow-md">
                      <div className="relative h-96">
                        <img src={template.templateImage} alt="templateImage" className="object-cover w-full h-full rounded-t-lg" />
                      </div>
                      <h4 className="mb-2 text-xl font-semibold">{template.title}</h4>
                      <p className="text-gray-600">{template.description}</p>

                      <div className="flex justify-between mt-2 md:mt-4">
                        <Link href={`/templates/${template._id}`}>
                          <button
                            className="px-4 py-2 text-white transition-transform duration-300 ease-in-out rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl focus:outline-none focus:ring focus:border-blue-300 transform-style-preserve-3d"
                          >
                            <FaCode className="text-3xl" />
                          </button>
                        </Link>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(template)}
                            className="flex items-center px-4 py-2 text-blue-500 transition duration-300 ease-in-out bg-blue-100 rounded-lg hover:text-blue-100 hover:bg-blue-600"
                          >
                            <FaEdit className="mr-1" />
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-red-500 transition duration-300 ease-in-out bg-red-100 rounded-lg hover:text-red-100 hover:bg-red-600"
                            onClick={() => handleDelete(template._id)}
                          >
                            <FaTrashAlt className="mr-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {confirmDelete && (
            <CustomModal
              title={confirmDelete.title}
              message={confirmDelete.message}
              onConfirm={confirmDeleteHandler}
              onCancel={() => setConfirmDelete(null)}
            />
          )}
          {showDeleteMessage && (
            <Message type="error" message="Item deleted successfully" onClose={() => console.log("Done")} />
          )}
        </div>
      )}
    </div>
  );
};

export default WebTemplate;
