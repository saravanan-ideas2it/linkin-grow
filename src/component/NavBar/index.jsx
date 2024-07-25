const NavItem = (props) => {
  const { tabDetails, changeTab, activeTab } = props;
  const { id, name } = tabDetails;

  const onClickTab = () => {
    changeTab(id);
  };

  let styleValue = {};

  if (id === activeTab) {
    styleValue = {
      height: "40px",
      borderBottom: "2px solid #1280A3",
      background:
        "linear-gradient(182deg, rgba(18, 155, 163, 0.10) 1.12%, rgba(254, 255, 255, 0.00) 97.91%)",
      fontFamily: "Quicksand",
      color: "#1280A3",
    };
  } else {
    styleValue = {
      height: "40px",
      fontFamily: "Quicksand",
      color: "#6A707C",
    };
  }

  return (
    <li className="grow">
      <button
        className="w-full text-sm non-italic font-medium"
        onClick={onClickTab}
        style={styleValue}
      >
        {name}
      </button>
    </li>
  );
};

const NavBar = (props) => {
  const { navbarConstants, changeTab, activeTab } = props;

  return (
    <ul className="flex flex-row justify-between items-center">
      {navbarConstants.map((eachTabDetails) => (
        <NavItem
          tabDetails={eachTabDetails}
          changeTab={changeTab}
          activeTab={activeTab}
        />
      ))}
    </ul>
  );
};

export default NavBar;
