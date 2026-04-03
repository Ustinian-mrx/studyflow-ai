import "./globals.css";

// 根布局仅负责全局样式与基础元信息，不承载业务态逻辑。
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
      {/* 页面主体由各业务路由自行渲染。 */}
      <body>{children}</body>
    </html>
  );
}
