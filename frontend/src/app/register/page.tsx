'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL =
  'https://potential-happiness-q7r7qv695956f6wgq-3001.app.github.dev';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const canSubmit = !loading && isValidEmail && password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = 'Não foi possível criar a conta.';
        try {
          const data = await res.json();
          msg = data?.message ? String(data.message) : msg;
        } catch {}
        throw new Error(msg);
      }

      setSuccess('Conta criada! Agora faça login.');
      // Pequeno atraso 
      setTimeout(() => router.push('/login'), 600);
    } catch (e: any) {
      setError(e?.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-black">
        <h1 className="text-2xl font-extrabold">✨ Criar conta</h1>
        <p className="text-sm mt-1 mb-6">
          Cadastre-se para acessar o Book Manager
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
            {!isValidEmail && email.length > 0 && (
              <p className="text-xs font-bold text-red-600 mt-1">
                Digite um email válido.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs font-bold text-red-600 mt-1">
                A senha deve ter pelo menos 6 caracteres.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600">{error}</p>
          )}

          {success && (
            <p className="text-sm font-bold text-green-700">{success}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-green-600 py-2 font-extrabold text-white disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link href="/login" className="font-extrabold text-blue-700 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
