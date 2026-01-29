import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3.5">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-400/70 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/60"></div>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                Test Agency
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wide group-hover:text-amber-300 transition-colors duration-300">SOLAR & ELECTRONICS</div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Home
            </Link>
            <Link href="/products" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Products
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              About
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-300 hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-orange-500/15 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-400/40">
              Contact
            </Link>
          </nav>

          {/* Admin Login Button */}
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-lg shadow-lg hover:shadow-orange-400/70 transition-all duration-300 hover:scale-105 border border-amber-400/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
