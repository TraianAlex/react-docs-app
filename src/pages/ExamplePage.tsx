import { Link, useParams } from 'react-router-dom';
import { getExampleBySlug } from '../examples/examples';
import NotFound from './NotFound';

export default function ExamplePage() {
  const { slug } = useParams();

  if (!slug) {
    return <NotFound />;
  }

  const example = getExampleBySlug(slug);

  if (!example) {
    return <NotFound />;
  }

  return (
    <section>
      <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3'>
        <div>
          <h1 className='h2 mb-1'>{example.title}</h1>
          <p className='text-secondary mb-0'>{example.description}</p>
        </div>
        <Link className='btn btn-outline-primary' to={`/docs/${slug}`}>
          Back to guide
        </Link>
      </div>
      <div className='mt-4'>{example.element}</div>
    </section>
  );
}
