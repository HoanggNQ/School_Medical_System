import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow border">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Login Doccure</h2>

        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">E-mail</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                👁️
              </button>
              <a href="#" className="absolute right-0 top-2.5 text-blue-500 text-sm pr-10">Forgot password?</a>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Login with OTP</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-full hover:from-blue-600 hover:to-cyan-600"
          >
            Sign in
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-full hover:bg-gray-50 space-x-2">
            <img src="https://img.icons8.com/color/20/000000/google-logo.png" alt="Google" />
            <span>Sign in With Google</span>
          </button>

          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-full hover:bg-gray-50 space-x-2">
            <img src="https://img.icons8.com/color/20/000000/facebook-new.png" alt="Facebook" />
            <span>Sign in With Facebook</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account ? <a href="#" className="text-blue-500 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
