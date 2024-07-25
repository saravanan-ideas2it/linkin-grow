import FollowerAvatarList from "../FollowerAvatarList";
import AllowPostNotificationItem from "../AllowPostNotificationItem";
import AllowMessagingNotificationItem from "../AllowMessagingNotificationItem";
import { useEffect, useState } from "react";

const DetailedView = () => {
  const [allowPosts, setAllowPosts] = useState(false);
  const [allowDm, setAllowDm] = useState(false);

  useEffect(() => {
    chrome.cookies.get(
      {
        url: "https://www.linkedin.com",
        name: "atk",
      },
      async function (cookie) {
        if (cookie) {
          const accessToken = cookie.value;

          const apiUrl = "http://52.72.128.87:3000/api/user/permissionstatus";
          const options = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          const response = await fetch(apiUrl, options);
          const data = await response.json();

          {
            data.allow_dm ? setAllowDm(false) : setAllowDm(true);
          }
          {
            data.allow_posting ? setAllowPosts(false) : setAllowPosts(true);
          }
        } else {
          console.log("Cookie not found");
        }
      }
    );
  }, []);

  const onClickAllowPermissions = (permissionItem) => {
    let apiUrl = "";
    if (permissionItem === "DM") {
      apiUrl = `http://52.72.128.87:3000/api/user/allowdirectmessaging`;
    } else {
      apiUrl = "http://52.72.128.87:3000/api/user/allowpostingonlinkedin";
    }

    chrome.cookies.get(
      {
        url: "https://www.linkedin.com",
        name: "atk",
      },
      async function (cookie) {
        if (cookie) {
          const accessToken = cookie.value;

          const options = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          const response = await fetch(apiUrl, options);
          const data = await response.json();

          if (permissionItem === "DM") {
            setAllowDm(false);
          } else {
            setAllowPosts(false);
          }
        } else {
          console.log("Cookie not found");
        }
      }
    );
  };

  return (
    <div className="p-2.5 mb-2">
      {allowPosts && (
        <div
          className="w-full rounded p-1.5"
          style={{ backgroundColor: "#E7F5F690", border: "1px solid #E7F5F6" }}
        >
          <AllowPostNotificationItem
            onClickAllowPermissions={onClickAllowPermissions}
          />
        </div>
      )}

      {allowDm && (
        <div
          className="w-full rounded p-1.5 my-2"
          style={{ backgroundColor: "#E7F5F690", border: "1px solid #E7F5F6" }}
        >
          <AllowMessagingNotificationItem
            onClickAllowPermissions={onClickAllowPermissions}
          />
        </div>
      )}

      <div className="mt-5">
        <h1
          className="non-italic font-medium text-sm mb-2"
          style={{ fontFamily: "Quicksand", color: "#084649" }}
        >
          People who started following me in the past week.
        </h1>
        <FollowerAvatarList followerListType="/pastweekfollowers" />
      </div>

      <div className="mt-5">
        <h1
          className="non-italic font-medium text-sm mb-2"
          style={{ fontFamily: "Quicksand", color: "#084649" }}
        >
          People who will start following me from next week.
        </h1>
        <FollowerAvatarList followerListType="/nextweekfollowers" />
      </div>
    </div>
  );
};

export default DetailedView;
