import React from 'react';
import { useDispatch } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';

import toastr from '../utils/toastConfig';

import { useRegisterUserMutation, useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';

const Register = () => {
  const [message, setMessage] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };
    try {
      await registerUser(data).unwrap();
      toastr.success('Registration successful!');
      setTimeout(() => {}, 1000);

      const loginData = {
        email,
        password,
      };
      const response = await loginUser(loginData).unwrap();
      console.log(response);
      const { token, user } = response;
      dispatch(setUser({ user }));

      // Display a success toast, with a title
      toastr.success('Successfully login!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.log(error);
      toastr.error('Registration failed');
    }
  };
  return (
    <section className="h-screen flex items-center justify-center">
      <div className="max-w-sm border shadow bg-white mx-auto p-8">
        <h2 className="text-2xl font-semibold pt-5">Registration</h2>
        <form onSubmit={handleRegister} className="space-y-5 max-w-sm mx-auto pt-8">
          <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} placeholder="username" required className="w-full bg-gray-100 focus:outline-none px-5 py-3" />
          <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-gray-100 focus:outline-none px-5 py-3" />
          <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-100 focus:outline-none px-5 py-3" />
          {message && <p className="text-red-500">{message}</p>}

          <button type="submit" className="w-full mt-5 bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md">
            Register
          </button>
        </form>

        <p className="my-5 italic text-sm text-center">
          Have an account?
          <Link to="/login" className="text-red-700 px-1 underline">
            Login
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Register;
