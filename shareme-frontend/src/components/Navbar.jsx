import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

    const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();

    if (user) {
        return (
        <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 bg-[#06070d] ">
            <div className="flex justify-start items-center w-full px-2 rounded-md  bg-[#1f3b6e] border-none outline-none focus-within:shadow-sm">
            <IoMdSearch fontSize={21} className="ml-1 text-[#00BFFF]" />
            <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                value={searchTerm}
                onFocus={() => navigate('/search')}
                className=" w-full bg-[#1f3b6e] outline-none  text-[#ffffffc4] mx-2"
            />
            </div>
            <div className="flex gap-3 ">
            <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                <div className='overflow-hidden w-[30px] h-[30px] d-flex'> 
                <img src={user.image} alt="user-pic" className="rounded-lg w-full h-full object-cover  hover:h-[110%] duration-300 ease-in-out" />

                </div>
            </Link>
 
            <Link to="/create-pin" className="bg-[#00BFFF] hover:bg-[#00bfff77] duration-300 ease-in-out text-white rounded-lg w-[50px] h-[30px] flex justify-center items-center">
                <IoMdAdd />
            </Link>
            </div>
        </div>
        );
    }

    return null;
    };

export default Navbar;