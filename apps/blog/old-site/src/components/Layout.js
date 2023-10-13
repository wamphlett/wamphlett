import "./Layout.css"
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Layout = (props) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
      const onScroll = () => setOffset(window.pageYOffset);
      // clean up code
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="layout">
      <header className={ offset >= 10 && "with-shadow" }>
        <div>
          <Link to="/topics">WARREN AMPHLETT<span>.</span></Link>
        </div>
      </header>
      <div>
        <div className="main">
          {props.article()}
        </div>
        {props.sidebar()}
      </div>
    </div>
  )
}

export default Layout