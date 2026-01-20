'use client';

// book

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Book = {
  id: number;
  title: string;
  author: string;
  year?: number | null;
  description?: string | null;
};

const API_URL =
  'https://potential-happiness-q7r7qv695956f6wgq-3001.app.github.dev';

export default function BooksPage() {
  const { token, logout } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState<string>(''); 
  const [description, setDescription] = useState('');

  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const headers = useMemo(() => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  async function loadBooks(customSearch?: string) {
    if (!token) return;
    setError('');
    setLoading(true);

    try {
      const q = (customSearch ?? search).trim();
      const url =
        q.length > 0
          ? `${API_URL}/books?search=${encodeURIComponent(q)}`
          : `${API_URL}/books`;

      const res = await fetch(url, { headers });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao listar livros');
      }
      const data = (await res.json()) as Book[];
      setBooks(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError('Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks('');
    
  }, [token]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setYear('');
    setDescription('');
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setTitle(book.title ?? '');
    setAuthor(book.author ?? '');
    setYear(book.year ? String(book.year) : '');
    setDescription(book.description ?? '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError('');
    setSaving(true);

    const payload: any = {
      title: title.trim(),
      author: author.trim(),
      year: year.trim() === '' ? null : Number(year),
      description: description.trim() === '' ? null : description.trim(),
    };

    try {
      const isEditing = editingId !== null;

      const res = await fetch(
        isEditing ? `${API_URL}/books/${editingId}` : `${API_URL}/books`,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao salvar');
      }

      resetForm();
      await loadBooks();
    } catch (e: any) {
      setError('Não foi possível salvar o livro.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    const ok = confirm('Remover este livro?');
    if (!ok) return;

    setError('');

    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao remover');
      }

      await loadBooks();
    } catch (e: any) {
      setError('Não foi possível remover o livro.');
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    await loadBooks(search);
    setSearching(false);
  }

  function clearSearch() {
    setSearch('');
    loadBooks('');
  }

  if (!token) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1 style={{ margin: 0, color: styles.text.color as string }}>
            Você não está logada
          </h1>
          <p style={{ margin: 0, color: styles.mutedText.color as string }}>
            Volte para a página de login.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, color: styles.text.color as string }}>
            📚 Book Manager
          </h1>
          <p style={{ margin: '6px 0 0', color: styles.mutedText.color as string }}>
            Crie, edite e remova livros.
          </p>
        </div>

        <button onClick={logout} style={styles.dangerBtn}>
          Sair
        </button>
      </header>

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.h2}>
            {editingId ? `Editar livro #${editingId}` : 'Novo livro'}
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Título *</label>
              <input
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Dom Casmurro"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Autor *</label>
              <input
                style={styles.input}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Machado de Assis"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Ano</label>
              <input
                style={styles.input}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 1899"
                inputMode="numeric"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Descrição</label>
              <textarea
                style={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
                rows={4}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={styles.primaryBtn} type="submit" disabled={saving}>
                {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </button>

              {editingId && (
                <button
                  type="button"
                  style={styles.ghostBtn}
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.card}>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={styles.h2}>Lista</h2>
              <button style={styles.ghostBtn} onClick={() => loadBooks()}>
                Recarregar
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
              <input
                style={styles.input}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, autor ou descrição..."
              />
              <button style={styles.primaryBtn} type="submit" disabled={searching}>
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
              <button type="button" style={styles.ghostBtn} onClick={clearSearch}>
                Limpar
              </button>
            </form>
          </div>

          {loading ? (
            <p style={styles.text}>Carregando...</p>
          ) : books.length === 0 ? (
            <p style={styles.text}>Nenhum livro encontrado.</p>
          ) : (
            <ul style={styles.list}>
              {books.map((b) => (
                <li key={b.id} style={styles.item}>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong style={styles.titleText}>{b.title}</strong>
                    <span style={styles.text}>{b.author}</span>

                    {(b.year || b.description) && (
                      <small style={styles.smallText}>
                        {b.year ? `Ano: ${b.year}` : ''}
                        {b.year && b.description ? ' • ' : ''}
                        {b.description ? b.description : ''}
                      </small>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={styles.ghostBtn} onClick={() => startEdit(b)}>
                      Editar
                    </button>
                    <button
                      style={styles.dangerOutlineBtn}
                      onClick={() => handleDelete(b.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f8',
    padding: 24,
    color: '#111827', 
  },
  header: {
    maxWidth: 1100,
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  grid: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 10,
    padding: 16,
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    color: '#111827', // 
  },
  h2: {
    margin: '0 0 12px',
    fontSize: 16,
    color: '#111827',
  },
  form: {
    display: 'grid',
    gap: 12,
  },
  field: {
    display: 'grid',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: '#111827', 
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #d0d5dd',
    fontSize: 14,
    outline: 'none',
    color: '#111827', 
    background: '#fff',
    width: '100%',
  },
  textarea: {
    padding: 10,
    borderRadius: 8,
    border: '1px solid #d0d5dd',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    color: '#111827', 
    background: '#fff',
  },
  primaryBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  ghostBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d0d5dd',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    color: '#111827', 
  },
  dangerBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  dangerOutlineBtn: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ef4444',
    background: '#fff',
    color: '#ef4444',
    cursor: 'pointer',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 10,
  },
  item: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    color: '#111827', 
  },
  error: {
    marginTop: 12,
    color: '#b91c1c',
    fontWeight: 800,
  },
  text: {
    color: '#111827', 
    fontWeight: 600,
  },
  mutedText: {
    color: '#111827', 
    fontWeight: 600,
  },
  titleText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: 800,
  },
  smallText: {
    color: '#111827',
    fontWeight: 600,
  },
};
