import GalleryPlate from "@/components/variants/v3/GalleryPlate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug} — A Private Viewing`,
  };
}

export default async function V3ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <GalleryPlate slug={slug} />;
}
