import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "বাজার দর | বাংলাদেশের দৈনিক বাজারদর",
    template: "%s | বাজার দর",
  },

  description:
    "বাংলাদেশের চাল, ডাল, তেল, সবজি, মাছ, মাংস ও অন্যান্য প্রয়োজনীয় পণ্যের দৈনিক বাজারদর এক নজরে জানুন।",

  keywords: [
    "বাজার দর",
    "বাংলাদেশ বাজারদর",
    "দৈনিক বাজারদর",
    "পণ্যের দাম",
    "চালের দাম",
    "ডালের দাম",
    "তেলের দাম",
  ],

  authors: [
    {
      name: "বাজার দর",
    },
  ],

  openGraph: {
    title: "বাজার দর | বাংলাদেশের দৈনিক বাজারদর",
    description:
      "প্রতিদিনের প্রয়োজনীয় পণ্যের বাজারদর এক জায়গায়।",
    type: "website",
    locale: "bn_BD",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="bg-[#f7f7f5] text-black antialiased">
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}