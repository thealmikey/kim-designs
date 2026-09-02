import SingleItemView from "@/components/variants/v5/SingleItemView";
import { projects, projectById } from "@/lib/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectById(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Winterior Design`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <SingleItemView slug={slug} />;
}
