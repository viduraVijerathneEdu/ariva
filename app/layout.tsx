import type { Metadata } from "next";
import "./globals.css";
import { SiteProvider, LanguageSuggest } from "../lib/site";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Ariva Travel — Sri Lanka, made personal",
  description:
    "Handcrafted Sri Lanka journeys — cultural, wildlife, adventure and spiritual. Customise your trip on the map, choose your own guide, stay in handpicked hotels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteProvider>
          <Header />
          {children}
          <Footer />
          <LanguageSuggest />
        </SiteProvider>
      </body>
    </html>
  );
}
