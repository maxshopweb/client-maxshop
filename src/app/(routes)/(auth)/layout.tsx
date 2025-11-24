export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout sin navbar ni footer - solo el contenido de auth
  return <>{children}</>;
}

