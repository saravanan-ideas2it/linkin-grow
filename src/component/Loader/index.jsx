import { useState } from "react";
import { ColorRing, InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  const [stillLoading, setStillLoading] = useState(false);

  setTimeout(() => {
    setStillLoading(true);
  }, 30000);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full relative z-10">
        <InfinitySpin
          visible={true}
          width="200"
          color="#4fa94d"
          ariaLabel="infinity-spin-loading"
        />
        {stillLoading ? (
          <p
            style={{
              fontFamily: "Quicksand",
              color: "#084649",
            }}
            className="text-sm font-medium text-center my-3"
          >
            If Still Loading Please Close and Reopen
          </p>
        ) : null}
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
};

export default Loader;
