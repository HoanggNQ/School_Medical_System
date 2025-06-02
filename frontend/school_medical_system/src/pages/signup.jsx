import React from 'react'
import Login from './login';
import { Link } from 'react-router-dom';
import LoginSignupImg from '../assets/LoginSignupImg.png';

const signup = () => {
 return (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="hidden lg:block w-1/2 pr-8">
            <img src={LoginSignupImg} alt="Login or Signup" className="rounded-2xl shadow-lg w-full h-auto" />
          </div>
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E-mail"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm Password"
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">
                Sign Up
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">or</p>
              <button className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Sign in With Google</span>
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      );
}

export default signup