import { Link, useParams } from 'react-router-dom';
import MarkdownContent from '../components/MarkdownContent';
import { getDocBySlug } from '../docs/docs';
import { getExampleBySlug } from '../examples/examples';
import NotFound from './NotFound';

export default function DocPage() {
  const { slug } = useParams();
  if (!slug) {
    return <NotFound />;
  }

  const doc = getDocBySlug(slug);
  const example = getExampleBySlug(slug);

  if (!doc) {
    return <NotFound />;
  }

  return (
    <section>
      <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3'>
        <h1 className='h2 mb-0'>{doc.title}</h1>
        {example && (
          <Link className='btn btn-primary' to={`/examples/${slug}`}>
            View real-world example
          </Link>
        )}
      </div>
      <MarkdownContent content={doc.content} />
    </section>
  );
}
