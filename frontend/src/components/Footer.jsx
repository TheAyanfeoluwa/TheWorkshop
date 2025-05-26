const Footer = () => {
  return (
    <footer className="w-full py-4 border-t border-white/10 bg-[#121212] mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>
          2025 WorkShop by{' '}
          <a 
            href="https://portfolio-promise.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            Promise Omisakin
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
