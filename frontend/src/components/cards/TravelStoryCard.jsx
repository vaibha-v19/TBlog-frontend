import React from 'react';
import moment from "moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
  story,
}) => {
  return (
    <div 
      className='border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all ease-in-out relative cursor-pointer'
      onClick={onClick}
    >
      <img
        src={imgUrl || 'default-image.jpg'} // Default image fallback
        alt={title}
        className="w-full h-56 object-cover rounded-t-lg"
      />
      <button
        className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-full border border-white/30 absolute top-4 right-4'
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick();
        }}
      >
        <FaHeart className={`text-lg ${isFavourite ? "text-red-500" : "text-white"}`} />
      </button>
      <div className='p-4'>
        <div className='flex flex-col mb-2'>
          <h6 className='text-sm font-medium'>{title}</h6>
          <span className='text-xs text-slate-500'>
            {date ? moment(date).format("Do MMM YYYY") : "-"}
          </span>
        </div>
        <p className='text-xs text-slate-600 mt-2'>
          {story?.slice(0, 60)}{story && story.length > 60 ? "..." : ""}
        </p>
        <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1'>
          <GrMapLocation className='text-sm' />
          {visitedLocation?.join(", ") || "No location provided"}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
