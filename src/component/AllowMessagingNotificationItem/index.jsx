const AllowMessagingNotificationItem = (props) => {
  const { onClickAllowPermissions } = props;

  const onClickAllow = () => {
    onClickAllowPermissions("DM");
  };

  return (
    <div
      className="w-full rounded p-1.5 flex justify-between items-center"
      style={{ backgroundColor: "#E7F5F6" }}
    >
      <div className="mr-1.5">
        <h1
          className="non-italic font-medium text-sm mb-1.5"
          style={{ fontFamily: "Quicksand", color: "#084649" }}
        >
          Get 100 more followers
        </h1>
        <p
          className="non-italic font-medium text-xs"
          style={{ fontFamily: "Quicksand", color: "#6A707C" }}
        >
          Allow DM your friends.
        </p>
      </div>

      <button
        className="bg-white rounded w-24 h-8"
        style={{ fontFamily: "Quicksand", color: "#084649" }}
        onClick={onClickAllow}
      >
        Allow
      </button>
    </div>
  );
};

export default AllowMessagingNotificationItem;
