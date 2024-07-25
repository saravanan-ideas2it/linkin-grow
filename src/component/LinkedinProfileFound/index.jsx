import { useState, useContext } from "react";
import chrome from "../../global";
import PageModeContext from "../../context/PageModeContext";
import pageModeConstants from "../../pageModeConstants";

function LinkedinProfileFound() {
  const { activePage, setActivePage } = useContext(PageModeContext);
  const [profileDetails, setProfileDetails] = useState({});

  chrome.storage.local.get(["storedProfileDetails"]).then((result) => {
    setProfileDetails(result.storedProfileDetails);
  });

  const activateAccount = async () => {
    setActivePage(pageModeConstants.inProgress);
    chrome.storage.local.set({
      storedActivePage: pageModeConstants.inProgress,
    });

    const { name, country, profileId, profileUrl, followersCount } =
      profileDetails;

    const userProfile = {
      linkedin_id: profileId,
      name,
      image_url: profileUrl,
      existing_follower_count: followersCount,
      country,
    };

    try {
      const apiUrl = "http://52.72.128.87:3000/api/user/register";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      };

      const response = await fetch(apiUrl, options);
      const data = await response.json();

      if (response.ok === true) {
        setActivePage(pageModeConstants.dashboard);
        chrome.storage.local.set({
          storedActivePage: pageModeConstants.dashboard,
        });

        const { token } = data;

        chrome.cookies.set(
          {
            url: "https://www.linkedin.com",
            name: "atk",
            value: token,
            domain: ".linkedin.com",
            path: "/",
            secure: true,
            httpOnly: false,
            expirationDate: Math.floor(Date.now() / 1000) + 5184000,
          },
          function (cookie) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else {
              console.log("Cookie set successfully");
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" bg-white flex flex-col justify-center h-full relative p-3">
        <div
          style={{ backgroundColor: "#FFFFFF80" }}
          className="h-auto border border-white bg-white rounded-2xl w-full relative z-10 p-2 backdrop-blur-md"
        >
          <div className="bg-white rounded-2xl h-full w-full flex flex-col justify-center items-center px-7 py-6">
            <h1
              style={{ color: "#4EA17A", fontFamily: "Comfortaa" }}
              className="text-base non-italic font-bold	text-center"
            >
              Hurray! we have found an account logged in.
            </h1>
            <div
              style={{
                width: "280px",
                height: "72px",
                backgroundColor: "#E7F5F6",
              }}
              className="px-4 py-3 my-2 rounded-2xl flex flex-row justify-start items-center"
            >
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
                <p
                  className="non-italic font-medium text-xs"
                  style={{ fontFamily: "Quicksand", color: "#2E64BC" }}
                >
                  {profileDetails.followersCount}
                </p>
              </div>
            </div>
            <p
              className="non-italic font-medium text-sm text-center"
              style={{ fontFamily: "Quicksand", color: "#6A707C" }}
            >
              Activate only if this LinkedIn profile is the one you want to grow
              your followers for.
            </p>
            <button
              className="rounded-md text-base non-italic font-medium text-white border px-2 py-3 mt-3.5 gap-2"
              style={{
                width: "120px",
                borderColor: "#1280A3",
                background:
                  "radial-gradient(94.24% 65% at 50% 76.25%, #11C3CC 0%, #119BA3 100%)",
                boxShadow:
                  "0px 2px 0px 0px rgba(255, 255, 255, 0.50) inset, 0px 8px 16px 0px rgba(18, 155, 163, 0.20)",
                fontFamily: "Quicksand",
              }}
              onClick={activateAccount}
            >
              Activate
            </button>

            {/* <a
              className="mt-3 text-center text-sm non-italic font-medium underline"
              style={{
                fontFamily: "Quicksand",
                color: "#1280A3",
              }}
              href=""
            >
              Not this account? Try again
            </a> */}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "60px",
          opacity: 0.3,
          background:
            "linear-gradient(159deg, #C58FB6 -6.81%, #F6B06F 42.64%, #129DA5 75.02%)",
          filter: "blur(100px)",
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
      ></div>
    </>
  );
}

export default LinkedinProfileFound;
