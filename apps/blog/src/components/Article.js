import "./Article.css"
import React from "react";
import { callApi } from "../util/API";
import { Handler as ErrorHandler } from "./Errors"
import {useParams} from "react-router-dom"
import { PageTitle } from "../util/PageHeaders";
import parse from 'html-react-parser';
import hljs from "highlight.js";
import 'highlight.js/styles/base16/solarized-dark.css'

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      html: "",
      title: "",
      errorCode: null
    }
  }

  componentDidMount() {
    let {topic, article} = this.props
    console.log("Article mounted:", article)
    callApi("/topics/" + topic + "/articles/" + article)
      .then((data) => {
        this.setState({
          html: data.html,
          title: data.title,
        })
        setTimeout(() => {
          hljs.highlightAll();
          document.querySelectorAll(".images > img").forEach((imageContainer, i) => {
            imageContainer.outerHTML = `<div class="image image-` + (i + 1) + `"><div>` + imageContainer.outerHTML + "</div></div>"
          })
        }, 50)
      })
      .catch((e) => {
        this.setState({
          errorCode: e.code
        })
      })
  }

  render() { 
    let {title, html, errorCode} = this.state
    if (errorCode) {
      return <ErrorHandler code={errorCode} />
    }
    return (
      <article>
        <PageTitle title={title} />
        {parse(html)}
      </article>
    )
  }
}

export default (props) => {
  const params = useParams();
  let topic = params.topic || ""
  let article = params.article || ""
  return <Article key={topic+article} {...props} topic={topic} article={article} />;
}