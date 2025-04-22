import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/Landing.css';

function Landing() {
  const headingRef = useRef(null);
  const chartsRef = useRef([]);

  useGSAP(() => {
    // Initial animation for the heading
    gsap.from(headingRef.current, {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: "power4.out",
      delay: 0.5
    });

    // Animate charts
    chartsRef.current.forEach((chart, index) => {
      gsap.from(chart, {
        duration: 2,
        scale: 0,
        opacity: 0,
        ease: "back.out(1.7)",
        delay: index * 0.2
      });
    });
  }, []);

  return (
    <div className='main w-full h-screen bg-[#1c1c1c] overflow-hidden relative'>
      {/* Background Charts */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        {/* Main Pie Chart - Top Center */}
        <div 
          ref={el => chartsRef.current[0] = el}
          className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 h-72"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="silver" strokeWidth="2" />
            <path
              d="M50 50 L50 5 A45 45 0 1 1 50 95 Z"
              fill="silver"
              className="opacity-25"
            />
          </svg>
        </div>

        {/* Bar Graph - Top Left */}
        <div 
          ref={el => chartsRef.current[1] = el}
          className="absolute top-20 left-20 w-64 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="10" y="60" width="15" height="40" fill="silver" className="opacity-25" />
            <rect x="30" y="40" width="15" height="60" fill="silver" className="opacity-25" />
            <rect x="50" y="20" width="15" height="80" fill="silver" className="opacity-25" />
            <rect x="70" y="30" width="15" height="70" fill="silver" className="opacity-25" />
          </svg>
        </div>

        {/* Line Graph - Top Right */}
        <div 
          ref={el => chartsRef.current[2] = el}
          className="absolute top-20 right-20 w-80 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10,80 L30,60 L50,70 L70,40 L90,50"
              fill="none"
              stroke="silver"
              strokeWidth="2"
              className="opacity-25"
            />
          </svg>
        </div>

        {/* Scatter Plot - Middle Left */}
        <div 
          ref={el => chartsRef.current[3] = el}
          className="absolute top-1/2 left-20 transform -translate-y-1/2 w-64 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="20" cy="30" r="3" fill="silver" className="opacity-25" />
            <circle cx="40" cy="50" r="3" fill="silver" className="opacity-25" />
            <circle cx="60" cy="40" r="3" fill="silver" className="opacity-25" />
            <circle cx="80" cy="60" r="3" fill="silver" className="opacity-25" />
            <circle cx="30" cy="70" r="3" fill="silver" className="opacity-25" />
          </svg>
        </div>

        {/* Area Chart - Middle Right */}
        <div 
          ref={el => chartsRef.current[4] = el}
          className="absolute top-1/2 right-20 transform -translate-y-1/2 w-72 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10,80 L30,60 L50,70 L70,40 L90,50 L90,80 Z"
              fill="silver"
              className="opacity-25"
            />
          </svg>
        </div>

        {/* Donut Chart - Bottom Left */}
        <div 
          ref={el => chartsRef.current[5] = el}
          className="absolute bottom-20 left-20 w-56 h-56"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="silver" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="silver" strokeWidth="2" />
            <path
              d="M50 50 L50 5 A45 45 0 0 1 95 50 Z"
              fill="silver"
              className="opacity-25"
            />
          </svg>
        </div>

        {/* Stacked Bar Graph - Bottom Right */}
        <div 
          ref={el => chartsRef.current[6] = el}
          className="absolute bottom-20 right-20 w-64 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="15" y="40" width="10" height="60" fill="silver" className="opacity-25" />
            <rect x="15" y="30" width="10" height="10" fill="silver" className="opacity-25" />
            <rect x="35" y="20" width="10" height="80" fill="silver" className="opacity-25" />
            <rect x="35" y="10" width="10" height="10" fill="silver" className="opacity-25" />
            <rect x="55" y="30" width="10" height="70" fill="silver" className="opacity-25" />
            <rect x="55" y="20" width="10" height="10" fill="silver" className="opacity-25" />
            <rect x="75" y="50" width="10" height="50" fill="silver" className="opacity-25" />
            <rect x="75" y="40" width="10" height="10" fill="silver" className="opacity-25" />
          </svg>
        </div>

        {/* Radar Chart - Center */}
        <div 
          ref={el => chartsRef.current[7] = el}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,5 80,35 80,65 50,95 20,65 20,35"
              fill="none"
              stroke="silver"
              strokeWidth="2"
              className="opacity-25"
            />
            <polygon
              points="50,20 65,35 65,65 50,80 35,65 35,35"
              fill="silver"
              className="opacity-25"
            />
          </svg>
        </div>

        {/* Bubble Chart - Middle Top */}
        <div 
          ref={el => chartsRef.current[8] = el}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-80 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="20" cy="50" r="15" fill="silver" className="opacity-25" />
            <circle cx="40" cy="30" r="20" fill="silver" className="opacity-25" />
            <circle cx="60" cy="60" r="10" fill="silver" className="opacity-25" />
            <circle cx="80" cy="40" r="25" fill="silver" className="opacity-25" />
          </svg>
        </div>

        {/* Heat Map - Middle Bottom */}
        <div 
          ref={el => chartsRef.current[9] = el}
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-80 h-64"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="10" y="10" width="20" height="20" fill="silver" className="opacity-25" />
            <rect x="30" y="10" width="20" height="20" fill="silver" className="opacity-35" />
            <rect x="50" y="10" width="20" height="20" fill="silver" className="opacity-25" />
            <rect x="10" y="30" width="20" height="20" fill="silver" className="opacity-35" />
            <rect x="30" y="30" width="20" height="20" fill="silver" className="opacity-45" />
            <rect x="50" y="30" width="20" height="20" fill="silver" className="opacity-35" />
            <rect x="10" y="50" width="20" height="20" fill="silver" className="opacity-25" />
            <rect x="30" y="50" width="20" height="20" fill="silver" className="opacity-35" />
            <rect x="50" y="50" width="20" height="20" fill="silver" className="opacity-25" />
          </svg>
        </div>

        {/* Parallel Coordinates - Bottom Center */}
        <div 
          ref={el => chartsRef.current[10] = el}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-96 h-48"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line x1="10" y1="20" x2="10" y2="80" stroke="silver" strokeWidth="2" className="opacity-25" />
            <line x1="30" y1="20" x2="30" y2="80" stroke="silver" strokeWidth="2" className="opacity-25" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="silver" strokeWidth="2" className="opacity-25" />
            <line x1="70" y1="20" x2="70" y2="80" stroke="silver" strokeWidth="2" className="opacity-25" />
            <line x1="90" y1="20" x2="90" y2="80" stroke="silver" strokeWidth="2" className="opacity-25" />
            <path
              d="M10,30 L30,50 L50,40 L70,60 L90,30"
              fill="none"
              stroke="silver"
              strokeWidth="2"
              className="opacity-25"
            />
            <path
              d="M10,60 L30,40 L50,50 L70,30 L90,60"
              fill="none"
              stroke="silver"
              strokeWidth="2"
              className="opacity-25"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full py-5 lg:px-10 px-5 relative flex items-center justify-between'>
        <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
          <Link to="/" className="hover:text-silver transition-colors duration-300">
            <h1>Contribute</h1>
          </Link>
        </div>
        <div ref={headingRef} className="name tracking-[18px] lg:mx-auto transform-gpu absolute left-1/2 transform -translate-x-1/2">
          <h1 className='lg:text-[40px] text-[30px] leading-tight font-bold text-silver transition-transform duration-300 hover:scale-110'>Survey</h1>
          <h4 className='lg:text-[25px] text-[20px] font-semibold leading-tight -mt-[5px] text-silver ml-[90px] lg:ml-[130px] transition-transform duration-300 hover:scale-110'>Scape</h4>
        </div>
        <div className='hidden lg:flex text-2xl gap-[20px] text-zinc-500 font-semibold'>
          <Link to="/" className="hover:text-silver transition-colors duration-300">
            <h1>Works</h1>
          </Link>
          <Link to="/" className="hover:text-silver transition-colors duration-300">
            <h1>Contact</h1>
          </Link>
          <Link to="/login" className="hover:text-silver transition-colors duration-300">
            <h1>Login</h1>
          </Link>
        </div>
        <i className="ri-menu-5-line block text-[30px] text-silver lg:hidden"></i>
      </div>

      <div id="main" className='w-full flex mt-[120px] lg:mt-[50px] justify-center'>
        <div id="heading" ref={headingRef} className="transform-gpu">
          <h1 
            className='px-10 text-center text-[15vw] lg:text-[7vw] font-semibold text-silver transform-gpu transition-all duration-500 hover:text-silver-light'
            style={{ 
              textShadow: '0 0 10px rgba(192, 192, 192, 0.5)',
              background: 'linear-gradient(45deg, #c0c0c0, #ffffff, #c0c0c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'metallicShine 3s linear infinite'
            }}
          >
            Create
          </h1>
          <h1 
            className='px-10 mx-auto text-[15vw] lg:text-[7vw] mt-[-25px] font-semibold text-silver transform-gpu transition-all duration-500 hover:text-silver-light'
            style={{ 
              textShadow: '0 0 10px rgba(192, 192, 192, 0.5)',
              background: 'linear-gradient(45deg, #c0c0c0, #ffffff, #c0c0c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'metallicShine 3s linear infinite',
              animationDelay: '1s'
            }}
          >
            Visualise
          </h1>
          <h1 
            className='px-10 mt-[-25px] text-center text-[15vw] lg:text-[7vw] font-semibold text-silver transform-gpu transition-all duration-500 hover:text-silver-light'
            style={{ 
              textShadow: '0 0 10px rgba(192, 192, 192, 0.5)',
              background: 'linear-gradient(45deg, #c0c0c0, #ffffff, #c0c0c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'metallicShine 3s linear infinite',
              animationDelay: '2s'
            }}
          >
            Grow
          </h1>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <Link 
          to="/login"
          className="bg-silver hover:bg-silver-light text-[#1c1c1c] font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-silver/50"
        >
          Get Started
        </Link>
      </div>

      <style>
        {`
          @keyframes metallicShine {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Landing;