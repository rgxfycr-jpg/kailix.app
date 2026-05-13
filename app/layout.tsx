import "./globals.css";

export const metadata = {
  title: "Kalix Loyalty",
  description: "Earn rewards for your activities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">{children}</body>
    </html>
  );
}
