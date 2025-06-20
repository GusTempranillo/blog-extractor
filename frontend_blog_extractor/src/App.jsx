import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [max, setMax] = useState(5);
  const [csvLink, setCsvLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    setLoading(true);
    setError('');
    setCsvLink('');
    try {
      const response = await fetch('https://blog-extractor-backend.onrender.com/export_csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, max })
      });
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      setCsvLink(href);
    } catch (err) {
      setError('Error al conectar con el backend.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Blog Extractor</h1>
      <input
        type="text"
        placeholder="URL del blog"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: '60%', marginRight: '1rem', padding: '0.5rem' }}
      />
      <input
        type="number"
        value={max}
        onChange={e => setMax(e.target.value)}
        style={{ width: '5rem', padding: '0.5rem' }}
      />
      <button onClick={handleExtract} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Extraer
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {csvLink && (
        <p>
          <a href={csvLink} download="posts.csv">Descargar CSV</a>
        </p>
      )}
    </div>
  );
}

export default App;
