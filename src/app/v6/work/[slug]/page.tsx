import AtelierPlate from "@/components/variants/v6/AtelierPlate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = (await import("@/lib/projects")).projectById(slug);
  return {
    title: project ? `${project.title} — Atelier` : "Atelier — Kim Interior Designs",
    description: project?.description ?? "Project plate from Kim Interior Designs.",
  };
}

export default async function V6ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <AtelierPlate slug={slug} />;
}