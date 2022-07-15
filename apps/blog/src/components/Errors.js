import './Error.css'
import React from "react";
import PageHeaders from "../util/PageHeaders";

export const Handler = (props) => {
  const {code} = props
  if (code == 404) {
    return <NotFound />
  }
  return <InternalServerError />
}

export const NotFound = () => {
  return <Error title="Not found!" main="404!" tag="This is not the page you are looking for..." />
}

export const InternalServerError = () => {
  return <Error title="Internal error!" main="500!" tag="Probably means I broke something... Ill try harder." />
}

export const Error = (props) => {
  let {title, main, tag} = props
  return (
    <div className="error">
      <PageHeaders title={ title } />
      <h1>{ main }</h1>
      <p>{ tag }</p>
    </div>
  )
}