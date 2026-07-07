import { getFlashcardsData } from "@/data/api";
import FlashcardsClient from "@/components/FlashcardsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FlashcardsPage({ params }: Props) {
  const { id } = await params;
  const data = await getFlashcardsData(id);

  return (
    <FlashcardsClient
      id={data.id}
      documentName={data.documentName}
      total={data.total}
      categories={data.categories}
      tags={data.tags}
      items={data.items}
    />
  );
}
