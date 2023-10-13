import './OverviewSidebar.css'
import React from "react";
import {
  Link
} from "react-router-dom"
import { callApi } from "../util/API";

class OverviewSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topics: [],
    }
  }

  componentDidMount() {
    // load other topics
    callApi("/topics")
    .then((data) => {
      this.setState({
        topics: data.topics
      })
    })
    .catch((e) => {
      console.log(e)
    })
  }

  render() {
    let {topics} = this.state
    return (
      <div className="sidebar overview-sidebar">
        <div>

          <div className="intro">
            <div className="profile-image"></div>
            <p>An insight into the world of an obsessed software engineer.</p>
          </div>
        
          <p className="heading">Topics</p>
          <ul>
            { topics.map(topic => {
              // TODO this slug should be returned from the API
              let topicSlug = topic.url.split("/").pop()
              return (
                <li key={topicSlug}><Link to={"/" + topicSlug}>{ topic.title }</Link></li>
              )
            })  }
          </ul>
        </div>
      </div>
    )
  }
}

export default OverviewSidebar