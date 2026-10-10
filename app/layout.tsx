import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ariva — Sri Lanka",
  description:
    "Handcrafted journeys across the teardrop of the Indian Ocean. Explore Negombo, Kitulgala, Yapahuwa and beyond with Ariva Travel.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
