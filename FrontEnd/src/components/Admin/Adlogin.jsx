import React from 'react';

function Adlogin() {
  return (
    <div id="login-back" className="w-full h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] flex justify-center items-center">
      <div className="adlogcard w-[90%] md:w-[400px] bg-[#1c1c1c88] backdrop-blur-lg rounded-[20px] p-8">
        <h1 className="text-4xl text-white text-center">Log In</h1>
        <form className="w-full mt-8 flex flex-col space-y-6">
          <input
            className="w-full h-[50px] rounded-full placeholder:text-white bg-[#ffffff22] text-white px-5 text-lg outline-none focus:ring-2 focus:ring-[#3ac47d]"
            type="email"
            placeholder="Email"
          />
          <input
            className="w-full h-[50px] rounded-full placeholder:text-white bg-[#ffffff22] text-white px-5 text-lg outline-none focus:ring-2 focus:ring-[#3ac47d]"
            type="password"
            placeholder="Password"
          />
          <button className="w-full h-[50px] bg-[#3ac47d] text-white text-lg font-semibold rounded-full hover:bg-[#21888b]">
            Log In
          </button>
          <a href="#" className="text-gray-300 text-sm text-center mt-2 hover:text-green-500">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
}

export default Adlogin;
