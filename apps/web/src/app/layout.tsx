import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Fatal Model - Encontre os melhores profissionais',
  description:
    'Plataforma inteligente para conectar clientes e profissionais com IA, confiança e privacidade.',
  keywords: ['marketplace', 'profissionais', 'busca inteligente', 'IA'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
