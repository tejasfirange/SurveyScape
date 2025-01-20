import React from 'react'

function Adsign() {
  return (
    <div id='sign-back' className='w-full h-screen  '>
        <div className='sigcard w-[90%] h-fit lg:w-[25%] p-5 lg:p-10 lg:h-fit bg-[#afa5a522] rounded-[20px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '>
            <h1 className='text-4xl w-[fit-content] tracking-[3px] m-auto font-semibold text-white'>Signup</h1>

            <form className='w-full mt-5 flex flex-col justify-center'>
                <input className='w-[290px] lg:w-[350px] h-[55px] rounded-full placeholder:text-[#5d6ba0] mt-10 bg-[#ffffff67] mx-auto p-5 text-2xl ' type="text" placeholder='Username'/>
                <input className='w-[290px] lg:w-[350px] h-[55px] rounded-full placeholder:text-[white] mt-10 bg-[#ffffff67] mx-auto p-5 text-2xl' type="email" placeholder='Email'/>
                <input className='w-[290px] lg:w-[350px] h-[55px] rounded-full placeholder:text-[white] mt-10 bg-[#ffffff67]  mx-auto p-5 text-2xl' type="password" placeholder='Password' />
                <button className='w-[290px] lg:w-[350px] h-[55px] rounded-full mt-10 mb-10 mx-auto text-3xl text-white font-semibold bg-green-500' >Sign Up</button>
                <div className='w-[290px] lg:w-[350px] h-[1.5px] bg-[#d6d2d2]  mx-auto'></div>
                <h3 className='text-center text-white text-xl mt-5'>Or Login With</h3>
                <a href="#">
                    <img className='w-[40px] mt-5 mx-auto ' src="https://freepnglogo.com/images/all_img/google-g-logo-85b2.png"/>
                </a>

            </form>
        </div>
    </div>
  )
}

export default Adsign