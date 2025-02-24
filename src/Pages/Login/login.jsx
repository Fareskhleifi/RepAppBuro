import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../../Service/axios_helper'
import { useAuth } from '../../contextHook/AuthContext'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login,user } = useAuth(); 
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRememberChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await request('post', '/auth/signin', {
        email: email,
        password: password,
      });

      const token = response.data.token;
      const role = response.data.role;
      if (token && role) {
        login(token, rememberMe);
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      } else {
        console.log(token);
        console.log(response.data.role);
        setError('Informations de connexion incorrectes.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Email ou mot de passe incorrect.');
        } else if (error.response.status === 500) {
          setError('Erreur serveur. Veuillez réessayer plus tard.');
        } else {
          setError('Une erreur s\'est produite. Veuillez réessayer.');
        }
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto xl:p-16 h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <form onSubmit={handleSubmit} className="max-w-lg animate-fade-right animate-once mx-auto w-full p-6 relative z-20">
          <div className="mb-12">
            <h3 className="text-gray-800 text-4xl font-extrabold">Sign in</h3>
            <p className="text-gray-800 text-sm mt-6">
            Sign in to access your internal dashboard and manage repair requests within the company
            </p>
          </div>
          <div className="mb-4">
            <label className="text-gray-800 text-[15px] mb-2 block" htmlFor="email">Email</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                placeholder="Enter email"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 682.667 682.667">
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                  <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                  <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                </g>
              </svg>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-800 text-[15px] mb-2 block" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <input
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-sm text-gray-800 bg-gray-100 focus:bg-transparent px-4 py-3.5 rounded-md outline-blue-600"
                placeholder="Enter password"
              />
              <svg onClick={() => setPasswordVisible(!passwordVisible)} xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
              </svg>
            </div>
          </div>
          <div className='mb-4'>
              {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberChange}
                className="shrink-0 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="" className="text-blue-600 font-semibold hover:underline">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full shadow-xl py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white bg-black hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
            >
              Log in
            </button>
          </div>

        </form>
        

        <div className="h-full md:py-6 flex items-center relative max-md:before:hidden before:absolute before:bg-gradient-to-r before:from-gray-50 before:via-[#007bff] before:to-[#0056b3] before:h-full before:w-3/4 before:right-0 before:z-0">
          {/* <img
            src="/src/assets/acceuil-image2.jpg"
            className="rounded-md animate-fade-left animate-once lg:w-2/3 md:w-11/12 z-50 relative"
            alt="Dining Experience"
             loading="eager"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
