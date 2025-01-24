import React from 'react';

function Adlogin() {
  return (
    <div className='adlogin w-full h-screen relative'>
      <div className='adlogcard w-[95%] h-[90%] lg:w-fit lg:h-fit lg:px-5 lg:py-10 bg-[#1c1c1c88] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[20px]'>
        <h1 className='text-4xl text-white p-5 w-fit mx-auto'>LOG IN</h1>

        <form className='w-full mt-8 flex flex-col space-y-6'>
          <input
            className='w-full h-[50px] rounded-full placeholder:text-white bg-[#ffffff22] text-white px-5 text-lg outline-none focus:ring-2 focus:ring-[#3ac47d]'
            type="email"
            required
            placeholder='Email'
          />
          <input
            className='w-full h-[50px] rounded-full placeholder:text-white bg-[#ffffff22] text-white px-5 text-lg outline-none focus:ring-2 focus:ring-[#3ac47d]'
            type="password"
            required
            placeholder='Password'
          />
          <button
          className='w-[290px] lg:w-[350px] h-[55px] bg-[#3ac47d] text-white text-lg font-semibold rounded-full hover:bg-[#21888b]'
        >
          Log In
        </button>

          <h3 className='text-center text-white underline cursor-pointer hover:text-green-500'>
            Forgot Password?
          </h3>


          {/* Divider Section */}
          <div className="flex items-center justify-center mt-2 px-4">
            <span className="text-gray-300 text-sm">or login with</span>
            <a href="#" className="flex items-center">
              <img
                className="w-[40px] h-[40px] ml-2"
                src="https://freepnglogo.com/images/all_img/google-g-logo-85b2.png"
                alt="Google Sign In"
              />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Adlogin;
