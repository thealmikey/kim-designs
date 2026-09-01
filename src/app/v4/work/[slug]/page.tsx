import CollisionPlate from "@/components/variants/v4/CollisionPlate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug} — Kim Interior Designs`,
  };
}

export default async function V4ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <CollisionPlate slug={slug} />;
}
