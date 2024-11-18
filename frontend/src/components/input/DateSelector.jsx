import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import { MdClose, MdOutlineDateRange } from 'react-icons/md';
import 'react-day-picker/dist/style.css'; // Ensure this line is included

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div>
      <button
        className='inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 rounded px-2 py-1 cursor-pointer'
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className='text-lg' />
        {date ? moment(date).format('Do MMM YYYY') : moment().format('Do MMM YYYY')}
      </button>
      {openDatePicker && (
        <div className='overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9'>
          <button 
            className='w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200 absolute top-2 right-2'
            onClick={() => setOpenDatePicker(false)}
          >
            <MdClose className='text-xl text-sky-600' />
          </button>
          <DayPicker
            className='bg-white p-3 rounded-lg shadow-lg border border-gray-300 rdp-root'
            captionLayout='dropdown-buttons'
            mode='single'
            selected={date}
            onSelect={setDate}
            pageNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
