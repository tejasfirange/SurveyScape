import React from 'react'

function Landing() {
  return (
    <div className='w-full  h-screen bg-[url("https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")] bg-no-repeat bg-cover'>
        <div className='w-full py-10 px-10 relative '>
            <div className="name flex absolute top-[0] ">
              <h1 className='text-[2.5vw] font-bold absolute z-20 text-[#4a17f0d5]'>Survey</h1>
              <h3 className='text-[2.5vw] font-semibold mt-5 text-[#1b181898] absolute -top-[0vw] left-[5vw]'>Scape</h3>
            </div>
        </div>
    </div>
  )
}

export default Landing