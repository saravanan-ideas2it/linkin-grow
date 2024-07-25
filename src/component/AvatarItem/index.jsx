import Popup from "reactjs-popup";

const AvatarItem = (props) => {
  const { avatarDetail } = props;

  const AvatarDetailsCard = () => (
    <div
      className="flex flex-row items-center bg-white rounded-lg w-80 h-20 p-2"
      style={{ boxShadow: "0 4px 8px rgba(18, 155, 163, 0.5)" }}
    >
      <img
        className="w-12 h-12 mr-3 rounded-full"
        src={avatarDetail.imageUrl}
        alt="user"
      />
      <div>
        <h1
          className="non-italic font-medium text-sm"
          style={{ fontFamily: "Quicksand", color: "#084649" }}
        >
          {avatarDetail.name}
        </h1>
        <p
          className="non-italic font-medium text-xs"
          style={{ fontFamily: "Quicksand", color: "#6A707C" }}
        >
          {avatarDetail.country}
        </p>
        <p
          className="non-italic font-medium text-xs"
          style={{ fontFamily: "Quicksand", color: "#2E64BC" }}
        >
          {avatarDetail.existingFollowerCount}
        </p>
      </div>
    </div>
  );

  const AvatarButton = () => (
    <button className="button">
      <div>
        <img
          className="w-8 h-8 rounded-full"
          src={avatarDetail.imageUrl}
          alt="avatar"
        />
      </div>
    </button>
  );

  return (
    <div className="m-1">
      <Popup
        trigger={AvatarButton}
        modal
        overlayStyle={{
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <AvatarDetailsCard />
      </Popup>
    </div>
  );
};

export default AvatarItem;
