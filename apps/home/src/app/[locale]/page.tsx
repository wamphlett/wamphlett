type PageProps = {
  params: {
    locale: string
  }
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <h1 style={{ color: 'black' }}>{params.locale}</h1>
    </div>
  )
}
