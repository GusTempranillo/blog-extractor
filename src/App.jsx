import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('https://blog-extractor-backend.onrender.com/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Error al conectar con el backend' });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Blog Extractor</h1>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Introduce la URL del blog"
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleExtract} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Extraer
      </button>

      {loading && <p>Cargando...</p>}
      {result && result.error && <p style={{ color: 'red' }}>{result.error}</p>}

      {result && result.titles && (
        <div>
          <h2>Títulos encontrados:</h2>
          <ul>
            {result.titles.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          <h2>Contenido:</h2>
          <ul>
            {result.paragraphs.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
