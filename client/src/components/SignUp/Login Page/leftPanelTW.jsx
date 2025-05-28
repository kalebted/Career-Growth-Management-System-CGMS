import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link from react-router-dom
import signupgirl from '../../../assets/signupgirl.png';
import barchart from '../../../assets/barchart.svg';

const LeftPanel = () => (
  <div className="relative flex flex-col justify-center flex-1 p-8 overflow-hidden bg-gradient-to-b from-green-100 to-white">
    <Link to="/" className="absolute text-lg font-bold text-green-700 top-6 left-10 hover:text-green-800">
      CGMS
    </Link>

    <div className="absolute flex flex-col items-center w-32 p-4 bg-white shadow-md top-24 left-10 rounded-xl">
      <img src={barchart} alt="Stat" className="h-10 mb-2" />
      <p className="text-lg font-bold text-gray-800">100K+</p>
      <p className="text-xs text-center text-gray-400">People got hired</p>
    </div>

    <img
      src={signupgirl}
      alt="Person with magnifying glass"
      className="absolute bottom-0 right-[-15rem] h-[500px]"
    />
  </div>
);

export default LeftPanel;
