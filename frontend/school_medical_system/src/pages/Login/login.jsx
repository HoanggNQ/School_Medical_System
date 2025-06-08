import React from "react";
import { Link } from 'react-router-dom';
import LoginSignupImg from '../../assets/LoginSignupImg.png';
import { loginAPI } from '../../services/userServices';
import { useNavigate } from 'react-router-dom';

const Login = () => {

      const [userName, setUserName] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [rememberMe, setRememberMe] = React.useState(false);
      const [loginWithOtp, setLoginWithOtp] = React.useState(false);
      const [message, setMessage] = React.useState('');
      const navigate = useNavigate();
      
      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form default submission
        
        try {
          // Validate inputs
          if (!userName.trim() || !password.trim()) {
            setMessage('Please enter both email and password');
            return;
          }

          setMessage(''); // Clear any previous messages
          
          const response = await loginAPI(userName, password);
          
          if (response && response.data) {
            // Store user data in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            const role = response.data.user.role;
            
            // Navigate based on role
            switch(role.toLowerCase()) {
              case 'student':
                navigate('/studentpage');
                break;
              case 'parent':
                navigate('/parentpage');
                break;
              default:
                setMessage('Invalid user role');
                break;
            }
          } else {
            setMessage('Invalid response from server');
          }
        } catch (error) {
          console.error('Login error:', error);
          if (error.response) {
            // Server responded with an error
            setMessage(error.response.data.message || 'Login failed. Please check your credentials.');
          } else if (error.request) {
            // Request was made but no response
            setMessage('No response from server. Please check your connection.');
          } else {
            // Other errors
            setMessage('An error occurred during login. Please try again.');
          }
        }
      };
      

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="hidden lg:block w-1/2 pr-8">
            <img src={LoginSignupImg} alt="Login or Signup" className="rounded-2xl shadow-lg w-full h-auto" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="account">E-mail</label>
                <input
                  type="text"
                  id="account"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <a href="#" className="absolute right-2 top-2 text-blue-500 text-sm">Forgot password?</a>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Remember Me
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loginWithOtp}
                    onChange={(e) => setLoginWithOtp(e.target.checked)}
                    className="mr-2"
                  />
                  Login with OTP
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Sign in
              </button>
            </form>
            {message && (
              <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
            <div className="text-center my-4">or</div>
            <button
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition duration-200"
              onClick={() => alert('Google Sign-In not implemented in this example.')}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
            <p className="text-center mt-4">
              Don't have an account? <Link to="/Signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      );
}

export default Login