import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beth Cartrette · @bethcnc',
  description: 'EDS Awareness Advocate, Medical Storyteller, and Health Journey Blogger',
  openGraph: {
    title: 'Beth Cartrette · @bethcnc',
    description: 'EDS Awareness Advocate, Medical Storyteller, and Health Journey Blogger',
    type: 'website',
    images: ['/avatar.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beth Cartrette · @bethcnc',
    description: 'EDS Awareness Advocate, Medical Storyteller, and Health Journey Blogger',
    images: ['/avatar.png'],
  },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 