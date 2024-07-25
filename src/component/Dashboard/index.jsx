import { useEffect, useState } from "react";
import chrome from "../../global";
import DisplayProfile from "../DisplayProfile";
import NavBar from "../NavBar";
import DetailedView from "../DetailedView";

const navbarConstants = [{ id: "GROW", name: "Grow" }];

const Dashboard = () => {
  useEffect(async () => {
    let accessToken = "";
    function formatFollowersList(followerList) {
      const formattedFollowerList = followerList.map((eachFollowers) => ({
        id: eachFollowers.id,
        toFollowLinkedinId: eachFollowers.toFollowLinkedin,
      }));

      return formattedFollowerList;
    }

    chrome.cookies.get(
      {
        url: "https://www.linkedin.com",
        name: "atk",
      },
      async function (cookie) {
        if (cookie) {
          accessToken = cookie.value;

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });

          const apiUrl = "http://52.72.128.87:3000/api/mutual/tofollowerslist";
          const options = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          const response = await fetch(apiUrl, options);
          const data = await response.json();
          const formattedFollowersList = data ? formatFollowersList(data) : [];

          await chrome.runtime.sendMessage({
            action: "startFollow",
            followerList: formattedFollowersList,
          });
        } else {
          console.log("Cookie not found");
        }
      }
    );
  }, []);

  const [currNavTab, setCurrNavTab] = useState(navbarConstants[0].id);

  const changeTab = (currTabId) => {
    setCurrNavTab(currTabId);
  };

  const renderCurrentPage = () => {
    if (currNavTab === navbarConstants[0].id) {
      return <DetailedView />;
    } else {
      return null;
    }
  };

  return (
    <div className="h-full flex flex-col justify-start">
      <DisplayProfile />
      <NavBar
        changeTab={changeTab}
        activeTab={currNavTab}
        navbarConstants={navbarConstants}
      />
      <div className="h-full overflow-y-auto">{renderCurrentPage()}</div>
    </div>
  );
};

export default Dashboard;
