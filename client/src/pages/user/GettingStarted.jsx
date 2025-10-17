import React from 'react'
import { useNavigate } from 'react-router-dom';
import { AUTH_SESSION_EVENT } from '../../utils/authStorage';

const GettingStarted = () => {

    const isLoggedIn = !!AUTH_SESSION_EVENT.token;

    const navigate = useNavigate();

    const HandleGoToHomePage = () => {
        if (isLoggedIn) {
            navigate('/home');
        }
        else{
            navigate('/login');
        }
    }

  return (
    <div>
  <div className="min-h-screen bg-[#faf8f5]">
    {/* Hero Section */}
    <div className="relative h-[600px] bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc8] flex items-center justify-center">
      <div className="px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[#8b7355] mb-6">
          Welcome to Ciyatake
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-700 md:text-2xl">
          Thoughtfully curated fashion and lifestyle essentials to help you celebrate everyday moments in style.
        </p>
        <button onClick={HandleGoToHomePage} className="bg-[#8b7355] text-white px-8 py-4 rounded-lg text-lg hover:bg-[#a08968] transition-all shadow-lg">
          Explore Collections
        </button>
      </div>
    </div>

    {/* Features Section */}
    <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#8b7355] mb-2">Quality Assured</h3>
          <p className="text-gray-600">Premium products carefully selected for you</p>
        </div>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#8b7355] mb-2">Best Prices</h3>
          <p className="text-gray-600">Affordable luxury for everyone</p>
        </div>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#8b7355] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#8b7355] mb-2">Easy Returns</h3>
          <p className="text-gray-660">Hassle-free 30-day return policy</p>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default GettingStarted