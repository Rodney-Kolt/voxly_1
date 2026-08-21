import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-secondary to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* CTA Section before footer content */}
        <div className="mb-16 pb-16 border-b border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="text-3xl font-bold mb-4">Start Gathering Insights Today</h3>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Join thousands of teams and communities using Voxly to make better decisions.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition">
              Create Your First Poll — It's Free
            </button>
          </div>
        </div>

        {/* Footer content grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-2xl mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                V
              </div>
              <span>Voxly</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Real-time polling for teams and communities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#features" className="text-gray-300 hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-300 hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with attribution */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} Voxly. All rights reserved.</p>
          <p className="text-xs">
            Made with ❤️ for better decision-making
          </p>
        </div>
      </div>
    </footer>
  )
}
