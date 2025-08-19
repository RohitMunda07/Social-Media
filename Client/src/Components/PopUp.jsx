import React from "react";
import { Close } from "@mui/icons-material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useDispatch } from "react-redux";

import { close } from "../Context/slice.js";

function PopUp({ message }) {
  const dispatch = useDispatch();

  return (
    <div className="h-screen w-full flex justify-center items-center backdrop-blur-sm absolute top-0 left-0">
      <div className="bg-white p-8 rounded-2xl relative border-2 shadow-lg">
        <Close
          onClick={() => dispatch(close())}
          className="absolute top-3 right-4 cursor-pointer"
        />
        <div className="flex flex-col items-center space-y-4">
          <HighlightOffIcon sx={{ fontSize: "7rem", color: "red" }} />
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="text-lg text-gray-700 text-center">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
