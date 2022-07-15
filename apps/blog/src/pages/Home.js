import './Home.css'
import React from "react";
import { Link } from 'react-router-dom';

const HomePage = (props) => {
  return (
    <div className="home">
        <h1>Warren Amphlett</h1>
        <p>If you're seeing this, then I broke something... sorry!</p>
        <Link to="/topics">Go back to Topics</Link>
    </div>
  )
}

export default HomePage