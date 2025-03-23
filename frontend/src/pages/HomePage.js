import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8f9fa] transition-all duration-1000">
      
      {/* Floating Icon Animation */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center items-center mb-4"
      >
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/3208/3208779.png"
          alt="rocket"
          className="w-16 h-16 drop-shadow-lg"
        />
      </motion.div>

      {/* Title with subtle fade-in */}
      <motion.h1
        className="text-5xl font-extrabold text-gray-800 drop-shadow-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        Advanced Task Management
      </motion.h1>

      {/* Subtitle with soft entry effect */}
      <motion.p
        className="text-gray-600 mt-3 text-lg max-w-lg text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Organize tasks efficiently, collaborate in real-time, and stay productive! 🚀
      </motion.p>

      {/* Elegant "Get Started" Button */}
      <motion.button
        onClick={() => navigate("/login")}
        whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(100, 149, 237, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-bold rounded-xl shadow-md hover:from-cyan-500 hover:to-blue-400 transition-all"
      >
        Get Started →
      </motion.button>
    </div>
  );
};

export default HomePage;
