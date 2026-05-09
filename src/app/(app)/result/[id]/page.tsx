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
    // 服务端首屏预取，减少客户端首屏等待时间。
    initialData = await getResultData(id);
  } catch {
    // 预取失败时交给客户端继续拉取并显示错误态。
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
