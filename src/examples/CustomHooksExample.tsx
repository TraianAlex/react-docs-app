import { useEffect, useState } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    const cached = localStorage.getItem(key);
    return cached ?? initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

export default function CustomHooksExample() {
  const [note, setNote] = useLocalStorage('draft-note', '');

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Meeting notes</h3>
      <textarea
          className='form-control'
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder='Capture key decisions...'
      />
        <p className='text-secondary mb-0'>Drafts are saved automatically.</p>
      </div>
    </div>
  );
}
