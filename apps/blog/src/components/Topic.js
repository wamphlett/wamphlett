import React from "react";
import {useParams} from "react-router-dom"
import parse from 'html-react-parser';
import { callApi } from "../util/API";
import {Handler as ErrorHandler} from "./Errors"
import { PageTitle } from "../util/PageHeaders";

class Topic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      html: ""
    }
  }

  componentDidMount() {
    let {topic} = this.props
    callApi("/topics/" + topic)
      .then((data) => {
        this.setState({
          html: data.html,
          title: data.title
        })
      })
      .catch((e) => {
        this.setState({
          errorCode: e.code
        })
      })
  }

  render() {
    let {errorCode, html, title} = this.state
    if (errorCode) {
      return <ErrorHandler code={errorCode} />
    }
    return (
      <article>
        <PageTitle title={ title } /> 
        {parse(html)}
      </article>
    )
  }
}

export default (props) => {
    const params = useParams();
    let topic = params.topic || ""
    return <Topic key={topic} {...props} topic={topic} />;
  }