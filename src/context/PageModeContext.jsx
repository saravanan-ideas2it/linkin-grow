import { createContext } from "react";
import pageModeConstants from "../pageModeConstants";

const PageModeContext = createContext({
  activePage: pageModeConstants.initial,
  setActivePage: () => {},
});

export default PageModeContext;
