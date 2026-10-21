export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-[5rem]">
          Fatal <span className="text-primary-600">Model</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-gray-700">Encontrar melhor. Confiar mais.</p>
          <p className="text-center text-gray-500 max-w-2xl">
            Plataforma inteligente para conectar clientes e profissionais com IA, confiança e
            privacidade.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-primary-600">🔍 Busca Inteligente</h3>
            <div className="text-gray-600">
              Use IA para encontrar exatamente o que você procura com busca semântica e
              conversacional.
            </div>
          </div>
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-primary-600">🛡️ Confiança</h3>
            <div className="text-gray-600">
              Sistema de verificação e trust engine para garantir segurança e autenticidade.
            </div>
          </div>
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-primary-600">🔐 Privacidade</h3>
            <div className="text-gray-600">
              Privacy by design com separação entre identidade civil e perfil público.
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
            Começar Agora
          </button>
          <button className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            Saiba Mais
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          🚀 Sprint 0 - Setup Inicial • Versão 0.1.0
        </div>
      </div>
    </main>
  );
}
