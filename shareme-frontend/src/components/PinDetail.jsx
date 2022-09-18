import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        console.log(data);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };


  useEffect(() => {
    fetchPinDetails();

  }, [pinId]);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [pins]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  if (!pinDetail) {
    return (
      <Spinner message="Showing pin" />
    );
  }

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-[#0b0d18] rounded-3xl  h-fit  w-fit relative" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
          <div className="flex justify-center items-center md:items-start flex-initial mr-5">
            <div className='overflow-hidden w-full    rounded-lg my-auto ml-5'>
            <img
              className=" max-h-full  object-cover items-center  my-5  rounded-3xl "
              src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
              alt="user-post"
            />
          </div>
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
          <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-[#0b0d18] rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold text-gray-400">{pinDetail?.postedBy.userName}</p>
            </Link>


            <div className="flex items-center justify-between absolute top-10 right-10">
              <div className="">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-[#00BFFF] p-2 text-xl text-white  rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination?.slice(8)}
              </a> */}
            </div>


            <div>
              <h1 className="text-xl font-bold  text-gray-100 break-words mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-0 text-gray-300">{pinDetail.about}</p>
            </div>
            
       
            <h2 className="mt-5 text-l text-gray-400">Comments</h2>
            <div className="max-h-370 overflow-y-auto   ">
              {pinDetail?.comments?.map((item) => (
                <div className="flex gap-2 mt-5  ml-5 items-center bg-[#0b0d18] rounded-lg" key={item.comment}>
                  <img
                    src={item.postedBy?.image}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col rounded-2xl px-2 py-1 bg-[#eceffa0e]">
                    <p className="font-bold text-[12px] text-gray-300">{item.postedBy?.userName}</p>
                    <p className='text-gray-400'>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>




            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img src={user.image} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-[#00BFFF] text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? 'Doing...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center text-gray-300  font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  );
};

export default PinDetail;