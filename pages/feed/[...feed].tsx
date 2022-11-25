import getFeed from '@framework/api/content/getFeed'

export default function FeedComposer({ feed }: any) {
  if (!feed) return null
  return <iframe className="h-screen w-screen" src={feed.downloadLink} />
}

export async function getServerSideProps(context: any) {
  console.log(context.query.feed)
  if (context.query?.feed[0]?.includes('xml')) {
    const feed = await getFeed(context.query.feed)
    console.log(feed)
    return {
      props: {
        feed,
      },
    }
  }

  //if there's no xml in the format the user will be redirected to the homepage, this is used as antispam for feed endpoint
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
    props: {},
  }
}
