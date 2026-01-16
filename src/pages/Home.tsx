import MarkdownContent from '../components/MarkdownContent'
import { homeDoc } from '../docs/docs'

export default function Home() {
  return (
    <section>
      <h1 className="h2">{homeDoc.title}</h1>
      <MarkdownContent content={homeDoc.content} />
    </section>
  )
}
