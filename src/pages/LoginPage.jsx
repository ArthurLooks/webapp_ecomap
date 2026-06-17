import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Spinner, Logo } from '../components/ui.jsx';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.senha);
      } else {
        if (!form.nome) { setError('Nome é obrigatório'); setLoading(false); return; }
        await register(form.nome, form.email, form.senha);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 via-surface to-eco-100 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-eco-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-eco-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <Logo size="lg" />
            <div className="text-left">
              <p className="text-xs font-medium text-eco-600 uppercase tracking-widest">Ecomap</p>
              <h1 className="font-display font-bold text-2xl text-gray-900 leading-tight">
                Guardião do Bairro
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Reporte problemas urbanos, acompanhe a resolução e conquiste pontos pela sua cidade.
          </p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={set('nome')}
                  required={mode === 'register'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                className="input-field"
                placeholder="voce@email.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.senha}
                onChange={set('senha')}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
            >
              {loading ? <Spinner size="sm" color="white" /> : null}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {mode === 'login' ? (
              <>Não tem conta?{' '}
                <button onClick={() => { setMode('register'); setError(''); }}
                  className="text-eco-600 font-medium hover:underline">Cadastre-se</button>
              </>
            ) : (
              <>Já tem conta?{' '}
                <button onClick={() => { setMode('login'); setError(''); }}
                  className="text-eco-600 font-medium hover:underline">Entrar</button>
              </>
            )}
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-eco-100 text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Contas de demonstração:</p>
          <p>🌱 Cidadão: <code className="bg-gray-100 px-1 rounded">admin3@ecomap.com</code> / <code className="bg-gray-100 px-1 rounded">password</code></p>
          <p>🏛️ Gestor: <code className="bg-gray-100 px-1 rounded">gestor@ecomap.com</code> / <code className="bg-gray-100 px-1 rounded">password</code></p>
        </div>
      </div>
    </div>
  );
}
