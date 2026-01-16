import { Link } from 'react-router-dom'
import { defaultDocSlug } from '../docs/docs'

export default function NotFound() {
  return (
    <section className="text-center">
      <h1 className="h2">Page not found</h1>
      <p className="text-secondary">
        The page you are looking for does not exist.
      </p>
      <Link className="btn btn-primary" to={`/docs/${defaultDocSlug}`}>
        Go to the first guide
      </Link>
    </section>
  )
}
