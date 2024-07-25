import { useEffect, useState } from "react";
import pageModeConstants from "./pageModeConstants";

import "./App.css";
import PageModeContext from "./context/PageModeContext";
import ConnectLinkedin from "./component/ConnectLinkedin";
import LinkedinNotFound from "./component/LinkedinNotFound";
import LinkedinProfileFound from "./component/LinkedinProfileFound";
import Dashboard from "./component/Dashboard";
import Loader from "./component/Loader";

function App() {
  const [activePage, setActivePage] = useState(pageModeConstants.initial);
  useEffect(() => {
    // TO UPDATE PERSISTING PAGE FROM LOCAL TO STATE
    chrome.storage.local.get(["storedActivePage"]).then((result) => {
      if (result.storedActivePage) {
        setActivePage(result.storedActivePage);
      }
    });
  }, []);

  const renderActivePage = () => {
    switch (activePage) {
      case pageModeConstants.initial:
        return <ConnectLinkedin />;
      case pageModeConstants.signedOut:
        return <LinkedinNotFound />;
      case pageModeConstants.signedIn:
        return <LinkedinProfileFound />;
      case pageModeConstants.dashboard:
        return <Dashboard />;
      case pageModeConstants.inProgress:
        return <Loader />;
    }
  };

  return (
    <PageModeContext.Provider value={{ activePage, setActivePage }}>
      <div style={{ height: "540px", width: "380px" }}>
        {renderActivePage()}
      </div>
    </PageModeContext.Provider>
  );
}

export default App;
