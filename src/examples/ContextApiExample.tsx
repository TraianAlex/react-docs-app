import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: 'light', toggle: () => {} });

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const toggle = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`card shadow-sm ${
          theme === 'dark' ? 'bg-dark text-light' : ''
        }`}
      >
        <div className='card-body d-flex flex-column gap-2'>{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};

const ContextApiContent = () => {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <>
      <h3 className='h5 mb-0'>Workspace theme</h3>
      <p className='text-secondary mb-1'>Current theme: {theme}</p>
      <button className='btn btn-primary' onClick={toggle}>
        Toggle theme
      </button>
    </>
  );
};

export default function ContextApiExample() {
  return (
    <ThemeProvider>
      <ContextApiContent />
    </ThemeProvider>
  );
}
