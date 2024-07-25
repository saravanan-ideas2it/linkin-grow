import { useContext } from "react";
import PageModeContext from "../../context/PageModeContext";
import chrome from "../../global";
import pageModeConstants from "../../pageModeConstants";

const ConnectLinkedin = () => {
  const { setActivePage } = useContext(PageModeContext);

  const startGettingProfile = async () => {
    setActivePage(pageModeConstants.inProgress);
    chrome.storage.local.set({
      storedActivePage: pageModeConstants.inProgress,
    });

    const response = await chrome.runtime.sendMessage({
      action: "startGettingProfile",
    });

    if (response.isSignedIn === true) {
      setActivePage(pageModeConstants.signedIn);
    } else {
      setActivePage(pageModeConstants.signedOut);
    }
  };

  return (
    <div className=" bg-white flex flex-col justify-center h-full relative p-3">
      <div
        style={{ backgroundColor: "#FFFFFF80" }}
        className="border h-auto border-white bg-white rounded-2xl w-full relative z-10 p-2 backdrop-blur-md"
      >
        <div className="bg-white rounded-2xl h-full w-full flex flex-col justify-center items-center px-7 py-6">
          <h1
            style={{ color: "#1280A3", fontFamily: "Comfortaa" }}
            className="text-base font-bold text-center"
          >
            Connect your Linkedin profile to grow your followers
          </h1>
          <p
            style={{
              fontFamily: "Quicksand",
              color: "#084649",
            }}
            className="text-sm font-medium text-center my-3"
          >
            Before you connect, please make sure your LinkedIn account is logged
            in on one of the tabs.
          </p>
          <button
            style={{
              width: "124px",
              height: "48px",
              backgroundColor: "#2E64BC",
              fontFamily: "Quicksand",
            }}
            className="flex flex-row justify-center items-center text-white text-sm font-medium not-italic rounded-lg"
            onClick={startGettingProfile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="mr-3"
            >
              <rect width="24" height="24" rx="4" fill="white" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M19 19H16.1234V14.1006C16.1234 12.7573 15.613 12.0066 14.5498 12.0066C13.3932 12.0066 12.7889 12.7878 12.7889 14.1006V19H10.0167V9.66667H12.7889V10.9239C12.7889 10.9239 13.6224 9.38152 15.603 9.38152C17.5827 9.38152 19 10.5904 19 13.0907V19ZM6.70944 8.44454C5.76517 8.44454 5 7.67337 5 6.72227C5 5.77117 5.76517 5 6.70944 5C7.65371 5 8.41842 5.77117 8.41842 6.72227C8.41842 7.67337 7.65371 8.44454 6.70944 8.44454ZM5.27799 19H8.16869V9.66667H5.27799V19Z"
                fill="#2E64BC"
              />
            </svg>
            Connect
          </button>
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
    </div>
  );
};

export default ConnectLinkedin;
