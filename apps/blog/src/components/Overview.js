import React from "react";
import parse from 'html-react-parser';
import { callApi } from "../util/API";
import { DefaultPageTitle } from "../util/PageHeaders";

class Overview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      html: ""
    }
  }

  componentDidMount() {
    callApi("/overview")
      .then((data) => {
        console.log(data)
        this.setState({
          html: data.html,
        })
      })
      .catch((e) => {
        console.error(e)
      })
  }

  render() {
    let {html} = this.state
    return (
      <article>
        <DefaultPageTitle />
        {parse(html)}
      </article>
    )
  }
}

export default Overview