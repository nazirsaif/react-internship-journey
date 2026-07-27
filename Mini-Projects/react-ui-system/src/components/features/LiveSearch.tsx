import React, { useState } from 'react';
import { useDebounce } from '@hooks/useDebounce';
import { useFetch } from '@hooks/useFetch';
import { useLocalStorage } from '@hooks/useLocalStorage';

interface Country {
  name: {
    common: string;
  };
  region: string;
  flags: {
    svg: string;
  };
}

export const LiveSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);

  const url = debouncedSearchTerm ? `https://restcountries.com/v3.1/name/${debouncedSearchTerm}` : '';
  const { data, error, isLoading } = useFetch<Country[]>(url);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5)); // Keep last 5
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search countries..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
          }}
        />
        <button type="submit" className="btn btn-primary btn-sm">Save</button>
      </form>

      {recentSearches.length > 0 && (
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Recent: </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {recentSearches.map(term => (
              <button
                key={term}
                onClick={() => { setSearchTerm(term); }}
                style={{
                  background: 'var(--border-color)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ minHeight: '200px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
        {isLoading && debouncedSearchTerm && <div style={{ color: 'var(--text-muted)' }}>Searching...</div>}
        
        {error && <div style={{ color: '#EF4444' }}>No results found for "{debouncedSearchTerm}"</div>}

        {!isLoading && !error && data && data.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.slice(0, 5).map(country => (
              <li key={country.name.common} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} style={{ width: '32px', height: 'auto', borderRadius: '2px' }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{country.name.common}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{country.region}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && !debouncedSearchTerm && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
            Type to start searching...
          </div>
        )}
      </div>
    </div>
  );
};
