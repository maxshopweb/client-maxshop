export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout sin navbar ni footer - solo el contenido del checkout
  return <>{children}</>;
}

