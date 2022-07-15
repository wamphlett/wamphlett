import React from "react";
import Topic from "../components/Topic"
import Layout from "../components/Layout"
import TopicSidebar from "../components/TopicSidebar";

const TopicPage = (props) => {
  return <Layout
    article={() => <Topic />}
    sidebar={() => <TopicSidebar /> }
  />
}

export default TopicPage