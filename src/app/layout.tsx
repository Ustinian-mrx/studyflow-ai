import "./globals.css";

export const metadata = {
  title: "StudyFlow AI",
  description: "AI 学习资料分析与复习辅助平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
