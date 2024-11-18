import React, { useState } from 'react';
import PasswordInput from '../../components/input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter password.");
      return;
    }
    setError("");

    // Login API call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if(
        error.response && error.response.data && error.response.data.message
      ){
        setError(error.response.data.message);
      }else{
        setError("An unexpected error occured. Please try again.")
      }
    }
  };

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='container h-screen flex items-center justify-center px-4 md:px-20 mx-auto'>
        <div className='hidden md:flex w-2/4 h-[90vh] items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <div>
            <h4 className='text-5xl text-white font-semibold leading-[58px]'>Capture Your <br /> Journeys</h4>
            <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
              Record your experiences in your personal 
              travel journal.
            </p>
          </div>
        </div>

        <div className='w-full md:w-2/4 h-auto md:h-[75vh] bg-white rounded-lg md:rounded-r-lg relative p-8 md:p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7'>Login</h4>
            <input 
              type='text' 
              placeholder='Email' 
              className='input-box mb-4'
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <PasswordInput 
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary w-full mb-4'>Login</button>
            <p className='text-xs text-slate-500 text-center my-4'>Or</p>
            <button 
              type='button' 
              className='btn-primary btn-light w-full' 
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
