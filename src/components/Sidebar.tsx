import { NavLink } from 'react-router-dom';
import type { NavLinkProps } from 'react-router-dom';
import { docs } from '../docs/docs';

const getNavClass: NavLinkProps['className'] = ({ isActive }) =>
  [
    'nav-link',
    'px-0',
    'py-1',
    isActive ? 'text-white fw-semibold' : 'text-secondary',
  ]
    .join(' ')
    .trim();

export default function Sidebar() {
  const coreDocs = docs.slice(0, 9);
  const modernDocs = docs.slice(9);

  return (
    <div className='d-flex flex-column gap-3 sticky-top' style={{ paddingTop: '20px' }}>
      <div>
        <div className='h5 mb-0 text-white'>React Docs</div>
        <div className='small text-secondary'>Quick Reference</div>
      </div>
      <nav className='nav flex-column'>
        <NavLink to='/' className={getNavClass}>
          Overview
        </NavLink>

        <div className='text-uppercase small text-secondary mt-3 mb-1'>
          Core Concepts
        </div>
        {coreDocs.map((doc) => (
          <NavLink
            key={doc.slug}
            to={`/docs/${doc.slug}`}
            className={getNavClass}
          >
            {doc.title}
          </NavLink>
        ))}

        <div className='text-uppercase small text-secondary mt-3 mb-1'>
          React 18+ & 19+ Features
        </div>
        {modernDocs.map((doc) => (
          <NavLink
            key={doc.slug}
            to={`/docs/${doc.slug}`}
            className={getNavClass}
          >
            {doc.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
