import SingleItemView from "@/components/variants/v5/SingleItemView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${slug} — Gallery — Kim Interior Designs` };
}

export default async function V5SingleItemPage({ params }: Props) {
  const { slug } = await params;
  return <SingleItemView slug={slug} />;
}
