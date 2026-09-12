import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeGuide — Stop memorizing solutions. Understand the why.',
  description:
    'A guided Socratic workspace that mentors you through technical interview problems one question at a time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var r of registrations) { r.unregister(); }
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#12151c] text-[#f3f1eb] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
