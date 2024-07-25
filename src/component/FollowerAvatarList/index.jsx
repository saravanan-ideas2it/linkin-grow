import { useEffect, useState } from "react";
import AvatarItem from "../AvatarItem";
import { FaPeopleGroup } from "react-icons/fa6";

function FollowerAvatarList(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarList, setAvatarList] = useState([]);

  const { followerListType } = props;

  useEffect(() => {
    setIsLoading(true);
    chrome.cookies.get(
      {
        url: "https://www.linkedin.com",
        name: "atk",
      },
      async function (cookie) {
        if (cookie) {
          const accessToken = cookie.value;

          const apiUrl = `http://52.72.128.87:3000/api/mutual${followerListType}`;
          const options = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };

          const response = await fetch(apiUrl, options);
          const data = await response.json();

          setAvatarList(data);
          setIsLoading(false);
        } else {
          console.log("Cookie not found");
        }
      }
    );
  }, []);

  const formatAvatarDetails = (avatarDetail) => {
    return {
      userId: avatarDetail.user_id,
      country: avatarDetail.country,
      name: avatarDetail.name,
      imageUrl: avatarDetail.image_url,
      existingFollowerCount: avatarDetail.existing_follower_count,
    };
  };

  const renderAvatarItem = (followerAvatarList) => {
    if (followerAvatarList.length > 0) {
      return avatarList.map((avatarDetail) => {
        const formattedAvatarDetails = formatAvatarDetails(avatarDetail);
        return (
          <AvatarItem
            key={formattedAvatarDetails.userId}
            avatarDetail={formattedAvatarDetails}
          />
        );
      });
    } else {
      return (
        <div className="flex flex-col items-center w-full h-24 mt-3">
          <FaPeopleGroup style={{ color: "#1280A3", fontSize: "40px" }} />
          <p
            className="non-italic font-medium text-xs mt-2"
            style={{ fontFamily: "Quicksand", color: "#6A707C" }}
          >
            You're getting noticed keep going!
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-row items-center flex-wrap h-auto">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-24">
          <h1
            className="non-italic font-medium text-xs mt-2"
            style={{ fontFamily: "Quicksand", color: "#6A707C" }}
          >
            Loading...
          </h1>
        </div>
      ) : (
        renderAvatarItem(avatarList)
      )}
    </div>
  );
}

export default FollowerAvatarList;
