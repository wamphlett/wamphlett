import React from "react";
import Layout from "../components/Layout";
import Overview from "../components/Overview";
import OverviewSidebar from "../components/OverviewSidebar";

const OverviewPage = (props) => {
  return <Layout
    article={() => <Overview />}
    sidebar={() => <OverviewSidebar /> }
  />
}

export default OverviewPage