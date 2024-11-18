import React, { useRef, useState, useEffect } from 'react';
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (image && image instanceof Blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(image);
        } else if (typeof image === 'string') {
            setPreviewUrl(image);
        } else {
            setPreviewUrl(null);
        }
    }, [image]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Triggers useEffect to set preview
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        handleDeleteImg();
        setPreviewUrl(null); // Clear preview
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />
            {!image ? (
                <button
                    className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
                    onClick={onChooseFile}
                >
                    <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
                        <FaRegFileImage className="text-xl text-cyan-500" />
                    </div>
                    <p className="text-sm text-slate-500">Browse image files to upload</p>
                </button>
            ) : (
                <div className="w-full relative">
                    <img
                        src={previewUrl}
                        alt="Selected"
                        className="w-full h-[300px] object-cover rounded-lg"
                    />
                    <button
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-200"
                        onClick={handleRemoveImage}
                    >
                        <MdDeleteOutline className="text-red-500 text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageSelector;
