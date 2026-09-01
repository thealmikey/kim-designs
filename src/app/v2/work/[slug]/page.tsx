import ArchivePlate from "@/components/variants/v2/ArchivePlate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Entry ${slug} — Kim Interior Designs Archive`,
  };
}

export default async function V2ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <ArchivePlate slug={slug} />;
}
