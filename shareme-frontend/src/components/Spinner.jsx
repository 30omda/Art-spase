import React from 'react';
import {BallTriangle} from 'react-loader-spinner';

const Spinner = ({ message }) => {
    return (
    <div className="flex flex-col justify-center items-center w-full h-full">
        <BallTriangle
            color="#00BFFF" 
            height={80} width={80} 
        />

        <p className="text-lg text-center px-2">{message}</p>
    </div>
    );
}

export default Spinner;