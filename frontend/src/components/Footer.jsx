import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 border-t border-white/10 bg-[#1A1A1A] z-50">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <motion.p 
          className="font-bold text-white"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {new Date().getFullYear()} WorkShop. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}

export default Footer