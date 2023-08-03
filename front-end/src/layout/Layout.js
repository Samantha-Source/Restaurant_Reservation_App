import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Keep window height updated with resize
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);


  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-md-2 side-bar" style={{height: windowHeight}}>
          <Menu />
        </div>
        <div className="col">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
