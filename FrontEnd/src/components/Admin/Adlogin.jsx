import React from 'react'

function Adlogin() {
  return (
    <div className='adlogin w-full h-screen relative'>
        <div className='adlogcard w-[95%] h-[90%] lg:w-fit lg:h-fit lg:px-5 lg:py-10 bg-[#afa5a522] absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]'>
          <h1 className='text-4xl text-white p-5  w-fit mx-auto'>LOG IN</h1>

          <form className='w-full flex flex-col'>
            <input className='w-[290px] md:w-[40%] lg:w-[350px] h-[55px] rounded-full placeholder:text-[white] mt-10 bg-[#ffffff67] mx-auto p-5 text-2xl' type="email" required placeholder='Email'/>
            <input className='w-[290px] md:w-[40%] lg:w-[350px] h-[55px] rounded-full placeholder:text-[white] mt-10 bg-[#ffffff67]  mx-auto p-5 text-2xl' type="password" required placeholder='Password' />
            <button className='w-[290px] lg:w-[350px] h-[55px] rounded-full mt-10 mb-10 mx-auto text-3xl text-white font-semibold bg-green-500' >Sign Up</button>
            <div className='w-[290px] lg:w-[350px] h-[1.5px] bg-[#d6d2d2]  mx-auto'></div>
            <h3 className='text-center text-white text-xl mt-5'>Forgot Password ?</h3>
          </form>
        </div>
    </div>
  )
}

export default Adlogin