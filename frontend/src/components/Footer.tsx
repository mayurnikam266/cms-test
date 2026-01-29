import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">TA</span>
              </div>
              <div>
                <div className="text-xl font-bold">Test Agency</div>
                <div className="text-xs text-gray-500">Solar & Electronics</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Leading provider of high-efficiency solar panels and electronic solutions for a sustainable future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/products?category=solar-panels" className="hover:text-white">Solar Panels</Link></li>
              <li><Link href="/products?category=inverters" className="hover:text-white">Inverters</Link></li>
              <li><Link href="/products?category=batteries" className="hover:text-white">Batteries</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@test-agency.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Solar Street</li>
              <li>City, State 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Test Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
