import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/cards/TravelStoryCard';
import { MdAdd } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import Modal from "react-modal";
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Import default DayPicker styles
import moment from 'moment';
import '../../index.css';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Fetch all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-travel-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  // Handlers for modal and stories
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        `/update-is-favourite/${storyId}`,
        { isFavourite: !storyData.isFavourite }
      );
      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        getAllTravelStories();
      }
    } catch (error) {
      toast.error("Failed to update story. Please try again.");
      console.error("Error updating story:", error);
    }
  };

  const deleteTravelStory = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delete-story/${data._id}`);
      if (response.status === 200) {
        toast.success("Story deleted successfully");
        getAllTravelStories();
        setOpenViewModal({ isShown: false, data: null });
      }
    } catch (error) {
      toast.error("Failed to delete story. Please try again.");
      console.error("Error deleting story:", error);
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", { params: { query } });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  };

  const filterStoriesByDate = async () => {
    try {
      const startDate = dateRange.from ? moment(dateRange.from).startOf('day').valueOf() : null;
      const endDate = dateRange.to ? moment(dateRange.to).endOf('day').valueOf() : null;

      if (!startDate || !endDate) return;

      const response = await axiosInstance.get("/travel-stories/filter", {
        params: { startDate, endDate },
      });

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      } else {
        toast.info("No stories found for the selected date range");
        setAllStories([]);
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
    }
  };

  const handleDayClick = (range) => {
    if (range.from && range.to) {
      setDateRange(range);
      filterStoriesByDate();
    } else {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">No stories available</div>
            )}
          </div>
          {/* Hide DayPicker on small screens */}
          <div className="hidden md:block w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg rounded-lg">
              <div className="p-3">
                <DayPicker
                  className="rdp-root"
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 999 } }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => setOpenViewModal({ isShown: false, data: null })}
          onEditClick={() => {
            setOpenViewModal({ isShown: false, data: null });
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => deleteTravelStory(openViewModal.data)}
        />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 bottom-4 sm:right-10 sm:bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
