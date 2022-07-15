import React from "react";
import Article from "../components/Article"
import Layout from "../components/Layout"
import TopicSidebar from "../components/TopicSidebar";

const ArticlePage = (props) => {
  return <Layout
    article={() => <Article />}
    sidebar={() => <TopicSidebar /> }
  />
}

export default ArticlePage