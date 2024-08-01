import { useState } from "react";
import chrome from "../../global";

import { BsDashLg } from "react-icons/bs";
import { FaRegEye } from "react-icons/fa";

const DisplayProfile = () => {
  const [profileDetails, setProfileDetails] = useState({});

  chrome.storage.local.get(["storedProfileDetails"]).then((result) => {
    setProfileDetails(result.storedProfileDetails);
  });

  const minimizePopup = () => {
    window.close();
  };

  return (
    <div className="flex flex-row justify-between items-center py-3 px-5">
      <div className="flex flex-row justify-start items-center">
        <img
          className="w-12 rounded-full mr-2.5"
          src={profileDetails.profileUrl}
          alt={profileDetails.name}
        />

        <div>
          <h1
            className="non-italic font-medium text-sm"
            style={{ fontFamily: "Quicksand", color: "#084649" }}
          >
            {profileDetails.name}
          </h1>
          <p
            className="non-italic font-medium text-xs"
            style={{ fontFamily: "Quicksand", color: "#6A707C" }}
          >
            {profileDetails.country}
          </p>
          {/* <a
            href="https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/"
            target="_blank"
            className="flex items-center hover:underline"
            style={{ textDecorationColor: "#2E64BC" }}
          >
            <p
              className="non-italic font-medium text-xs"
              style={{ fontFamily: "Quicksand", color: "#2E64BC" }}
            >
              {profileDetails.followersCount}
            </p>

            <FaRegEye
              className="non-italic font-medium text-xs ml-1"
              style={{ color: "#2E64BC" }}
            />
          </a> */}
        </div>
      </div>

      <button
        className="p-2 border rounded-full"
        style={{ borderColor: "#E5E7EB" }}
        onClick={minimizePopup}
      >
        <BsDashLg className="text-md" />
      </button>
    </div>
  );
};

export default DisplayProfile;
