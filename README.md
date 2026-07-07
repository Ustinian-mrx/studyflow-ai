# StudyFlow AI

一个面向学习场景的智能资料分析系统。上传 PDF 或图片学习资料，AI 自动生成摘要、知识点、疑难点、闪卡和总结，帮助你完成「上传 → 理解 → 复习」的学习闭环。

## 主要功能

### 资料分析
- 上传 PDF、PNG、JPG、JPEG、WEBP 格式学习资料（单文件 ≤ 10MB）
- AI 自动分析内容，生成摘要、知识点、疑难点、学习建议和标签
- PDF 文本提取 + 图片视觉分析双通道

### 闪卡复习
- 自动生成问答闪卡，支持标签分类
- **复习模式**：显示答案后标记「掌握了」或「没掌握」
- 答错自动收录到错题集

### 错题集
- 自动收集 AI 疑难点 + 闪卡答错记录
- 按来源、标签、文档、掌握状态筛选
- 标记掌握、删除管理
- **一键导出**：PDF / Word / Excel

### Excel 统计报表（5 个 Sheet）
| Sheet | 内容 |
|-------|------|
| 错题详情 | 完整列表：题目、答案、来源、标签、掌握率 |
| 文档统计 | 按文档分组的错题数量和掌握率 |
| 标签统计 | 按知识点标签分组统计 |
| 时间趋势 | 按周统计新增和累计错题数 |
| 掌握评估 | 整体掌握率和按来源分布 |

### 总结与回顾
- 单篇文档总结
- 周总结（按时间段汇总）
- 历史记录管理（删除、重试分析）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16、React 19、Tailwind CSS、shadcn/ui |
| 后端 | Next.js App Router API Routes |
| 数据库 | MySQL + Prisma ORM |
| 鉴权 | JWT + Cookie |
| AI | OpenAI SDK 兼容方式接入（支持通义千问等） |
| 导出 | jsPDF（PDF）、docx（Word）、ExcelJS（Excel） |
| PDF 解析 | pdfjs-dist |

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm
- MySQL

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="mysql://root:密码@localhost:3306/studyflow"
JWT_SECRET="一串足够长的随机字符串"

DASHSCOPE_API_KEY="你的 API Key"
DASHSCOPE_BASE_URL="API 兼容接口地址"
TONGYI_VISION_MODEL="视觉模型名称"
TONGYI_DOC_MODEL="文档模型名称"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE studyflow;"

# 执行迁移
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:3000`

## 常用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查
pnpm prisma migrate dev  # 数据库迁移
pnpm prisma generate     # 生成 Prisma Client
```

## 页面结构

```
/login                  登录
/register               注册
/dashboard              学习控制台
/upload                 资料上传
/history                历史记录
/result/[id]            分析结果
/flashcards/[id]        闪卡（含复习模式）
/summary/[id]           单篇总结
/summaries              周总结列表
/summaries/weekly/[id]  周总结详情
/mistakes               错题集
/profile                个人中心
```

## 目录结构

```
src/
  app/                  页面与 API 路由
  components/           UI 组件
  data/                 数据获取与类型定义
  lib/                  工具函数、鉴权、Prisma 客户端
  lib/services/         业务服务（文档分析、导出）
prisma/
  schema.prisma         数据模型定义
  migrations/           迁移记录
public/uploads/         用户上传文件（已 gitignore）
```

## 数据模型

```
User ─┬─ Document ─┬─ AnalysisResult
      │            ├─ Flashcard
      │            └─ MistakeItem
      ├─ Summary
      └─ MistakeItem
```

## AI 服务说明

项目通过 OpenAI SDK 兼容方式接入 AI 服务，支持：

- **图片分析**：视觉模型，直接识别图片内容
- **PDF 分析**：先用 pdfjs-dist 提取文本，再发送给文档模型分析
- **本地兜底**：AI 服务不可用时自动生成兜底结果，保证功能链路可用

## 许可证

MIT
