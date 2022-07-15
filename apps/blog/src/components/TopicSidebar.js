import './TopicSidebar.css'
import React from "react";
import {
  Link
} from "react-router-dom"
import { callApi } from "../util/API";
import {useParams} from "react-router-dom"

class TopicSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topic: "",
      articles: [],
      otherTopics: [],
    }
  }

  componentDidMount() {
    let {topicSlug} = this.props
    let topicUrl = "/topics/" + topicSlug
    callApi(topicUrl)
      .then((data) => {
        this.setState({
          topic: data
        })
        callApi(data.articleUrl)
          .then((data) => {
            this.setState({
              articles: data.articles
            })
          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((e) => {
        console.log(e)
      })
      // load other topics
      callApi("/topics")
        .then((data) => {
          this.setState({
            otherTopics: data.topics.filter((t) => t.url != topicUrl)
          })
        })
        .catch((e) => {
          console.log(e)
        })
  }

  render() {
    let {topic, articles, otherTopics} = this.state
    let {topicSlug} = this.props
    return (
      <div className="sidebar topic-sidebar">
        <div>
          <p className="heading"><Link to={"/" + topicSlug}>{ topic.title }</Link></p>
          <ul>
            { articles.map(article => {
              return (
                <li key={article.slug}><Link to={"/" + topicSlug + "/" + article.slug}>{ article.title }</Link></li>
              )
            })  }
          </ul>
          <p className="heading">Other Topics</p>
          <ul>
            { otherTopics.map(topic => {
              return (
                <li key={topic.slug}><Link to={"/" + topic.slug}>{ topic.title }</Link></li>
              )
            })  }
          </ul>
        </div>
      </div>
    )
  }
}

export default (props) => {
  const params = useParams()
  const topicSlug = params.topic || ""
  return <TopicSidebar key={topicSlug} topicSlug={topicSlug} {...props} params={params} />;
};