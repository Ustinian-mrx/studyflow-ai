import ResultDetailClient from "@/components/ResultDetailClient";
import { getProcessingSteps, getResultData } from "@/data/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const processingSteps = await getProcessingSteps();

  let initialData = null;

  try {
    initialData = await getResultData(id);
  } catch {
    initialData = null;
  }

  return (
    <ResultDetailClient
      id={id}
      initialData={initialData}
      processingSteps={processingSteps}
    />
  );
}