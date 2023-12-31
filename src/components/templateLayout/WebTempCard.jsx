// WebTempCard.jsx
import { motion } from 'framer-motion';
import { FaCode } from 'react-icons/fa';
import Link from 'next/link';

const stagger = 0.2;

const variants = {
  hidden: { opacity: 0, rotateX: -45, rotateY: -45, rotateZ: -45 },
  visible: { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
};

const WebTempCard = ({ webtemp, index }) => {
  const isStaggered = index > 0 && index % 12 !== 0; // Skip stagger for the first card and multiples of 12

  return (
    <motion.div
      key={webtemp._id}
      variants={variants}
      initial={isStaggered ? "hidden" : "visible"}
      animate="visible"
      transition={{
        duration: 0.5,
        delay: isStaggered ? index * stagger : 0, // Apply stagger only if it's not the first card
        ease: "easeInOut",
      }}
      className="rounded-lg shadow-lg bg-blue-50"
    >
      <div className="relative h-96">
        <img
          src={webtemp.templateImage}
          alt={`Card Image ${webtemp._id}`}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">{webtemp.title}</h2>
        <p className="mt-2 text-gray-500">{webtemp.description}</p>

        {/* Links */}
        <div className="flex justify-center mt-4">
          <Link href={`/templates/${webtemp._id}`}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-2 text-white transition-transform duration-300 ease-in-out rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl focus:outline-none focus:ring focus:border-blue-300 transform-style-preserve-3d"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={{ scale: 0.8, rotateY: -10, rotateX: 10, rotateZ: -10 }}
                  animate={{ scale: 1, rotateY: 0, rotateX: 0, rotateZ: 0 }}
                  transition={{ yoyo: Infinity, duration: 1.5 }}
                >
                  <FaCode className="text-3xl" />
                </motion.div>
                <span className="text-lg">Explore</span>
              </div>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default WebTempCard;
