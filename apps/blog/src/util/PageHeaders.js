import {Helmet} from "react-helmet";

const PageHeaders = (props) => {
  let {title} = props
  return (
    <Helmet>
      <title>Warren Amphlett | {title || "Loading"}</title>
    </Helmet>
  )
}

export const PageTitle = (props) => {
  let {title} = props
  return (
    <Helmet>
      <title>Warren Amphlett | {title || "Loading"}</title>
    </Helmet>
  )
}

export const DefaultPageTitle = () => {
  return (
    <Helmet>
      <title>Warren Amphlett</title>
    </Helmet>
  )
}

export default PageHeaders