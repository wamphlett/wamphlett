type PageProps = {
  locale: string
  params: {
    locale: string
  }
}

export default function Page({params, locale}: PageProps) {
  return (
    <div>
      <h1 style={{color: "black"}}>{params.locale} : {locale}</h1>
    </div>
  )
}
