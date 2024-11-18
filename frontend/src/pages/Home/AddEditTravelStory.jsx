import React, { useState, useEffect } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(storyInfo ? moment(storyInfo.visitedDate).toDate() : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storyInfo) {
      setTitle(storyInfo.title);
      setStoryImg(storyInfo.imageUrl);
      setStory(storyInfo.story);
      setVisitedLocation(storyInfo.visitedLocation);
      setVisitedDate(moment(storyInfo.visitedDate).toDate());
    }
  }, [storyInfo]);

  const handleImageUpload = async () => {
    if (storyImg && typeof storyImg !== 'string') {
      const imageUploadRes = await uploadImage(storyImg);
      return imageUploadRes.imageUrl || "";
    }
    return storyImg;
  };

  const addOrUpdateStory = async () => {
    setError(""); // Clear error before submission
    const imageUrl = await handleImageUpload();
    const data = {
      title,
      story,
      imageUrl,
      visitedLocation,
      visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
    };

    console.log("Sending data:", data); // Log the data being sent

    try {
      if (type === 'edit') {
        await updateTravelStory(data);
      } else {
        await addTravelStory(data);
      }
      getAllTravelStories();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${type === 'edit' ? 'update' : 'add'} story. Please try again.`);
      console.error("Error processing travel story:", error);
    }
  };

  const addTravelStory = async (data) => {
    const response = await axiosInstance.post("/add-travel-story", data);
    if (response.data && response.data.story) {
      toast.success("Story added successfully");
    }
  };

  const updateTravelStory = async (data) => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = storyInfo.imageUrl || "";

      // Check if storyImg is an object, which means a new image is selected
      if (typeof storyImg === "object" && storyImg !== null) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const postData = {
        title,
        story,
        imageUrl: imageUrl || "", // Ensure imageUrl is included in the data
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      };

      console.log("Sending data:", postData); // Log the data being sent

      const response = await axiosInstance.put("/edit-story/" + storyId, postData);

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
      }
    } catch (error) {
      console.error("Error updating travel story:", error);
      throw error;
    }
  };

  const deleteImage = async () => {
    if (storyImg && typeof storyImg === 'string') {
      try {
        const response = await axiosInstance.delete('/delete-image', { params: { imageUrl: storyImg } });
        if (response.status === 200) {
          toast.success("Image deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image. Please try again.");
      }
    }
    setStoryImg(null); // Clear image from state
  };

  const deleteTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.status === 200) {
        toast.success("Story deleted successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting travel story:", error);
      toast.error("Failed to delete story. Please try again.");
    }
  };

  const handleAddorUpdateClick = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }

    addOrUpdateStory();
  };

  const handleDeleteImg = () => {
    deleteImage();
  };

  const handleDeleteStory = () => {
    deleteTravelStory();
  };

  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={handleAddorUpdateClick}>
              {type === 'add' ? <MdAdd className="text-lg" /> : <MdUpdate className="text-lg" />}
              {type === 'add' ? ' ADD STORY' : ' UPDATE STORY'}
            </button>
            <button className="btn-small" onClick={handleDeleteStory}>
              <MdDeleteOutline className="text-lg" /> DELETE STORY
            </button>
            <button className="btn-small" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" /> CLOSE
            </button>
          </div>
          {error && (
            <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-2 pt-4'>
        <label className='input-label'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='A Day at Great Wall'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <div className='my-3'>
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>
        <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteImg} />
        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>STORY</label>
          <textarea
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='Your Story'
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>
        <div className='pt-3'>
          <label className='input-label'>VISITED LOCATION</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
