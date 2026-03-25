# StudyFlow AI

StudyFlow AI 是一个面向学习资料整理与复习的 Web 应用。用户可以上传 PDF 或图片资料，系统会生成分析结果、总结和复习闪卡，并在历史记录与个人中心中沉淀学习数据。

当前仓库处于 MVP 阶段，已经具备完整的页面骨架、数据库模型和基础接口，但分析流程仍是占位实现，认证链路和数据访问策略也还有待收口。

## 项目目标

- 上传学习资料并持久化到数据库
- 生成文档分析结果，包括摘要、知识点、疑难点、学习建议、标签
- 为单篇资料生成复习闪卡与总结
- 提供历史记录、统计信息和个人中心
- 为后续接入真实 OCR / LLM 服务预留后端结构

## 当前功能状态

### 已实现

- 基于 Next.js App Router 的前后端一体化项目结构
- Prisma + MySQL 数据建模与迁移
- 用户注册、登录、退出接口
- 文档上传、存储到 `public/uploads`、状态轮询页面
- 分析结果、闪卡、总结、历史记录、个人中心页面
- 文档删除与失败后重试分析

### 当前仍为占位或半成品

- 文档分析由 `src/lib/services/document-analysis.ts` 中的假数据模拟生成
- 首页 `src/app/page.tsx` 仍保留默认 Next.js 模板，未接入产品首页
- 鉴权方式同时混用了 Cookie、Bearer Token 和 `mockUserId`
- 部分数据获取逻辑仍保留 mock 数据痕迹
- 上传分析是同步执行，不是真正的异步后台任务

## 技术栈

- 前端：Next.js 16、React 19、TypeScript、Tailwind CSS 4
- UI：shadcn 风格组件、Radix 体系、Lucide 图标
- 后端：Next.js Route Handlers
- 数据库：MySQL
- ORM：Prisma
- 认证：JWT + HttpOnly Cookie（当前实现仍不统一）
- 包管理：pnpm

## 目录结构

```text
studyflow-ai
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
├─ public
│  └─ uploads
├─ src
│  ├─ app
│  │  ├─ (app)
│  │  │  ├─ dashboard
│  │  │  ├─ flashcards
│  │  │  ├─ history
│  │  │  ├─ profile
│  │  │  ├─ result
│  │  │  ├─ summary
│  │  │  └─ upload
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  ├─ dashboard
│  │  │  ├─ documents
│  │  │  ├─ flashcards
│  │  │  ├─ history
│  │  │  ├─ profile
│  │  │  ├─ result
│  │  │  └─ summary
│  │  ├─ login
│  │  ├─ register
│  │  └─ page.tsx
│  ├─ components
│  ├─ data
│  └─ lib
└─ README.md
```

## 核心业务流程

1. 用户注册并登录。
2. 用户在 `/upload` 上传 PDF 或图片文件。
3. 文件保存到 `public/uploads`，同时在 `Document` 表中创建记录。
4. `processDocumentAnalysis` 根据文档生成占位分析结果。
5. 系统写入 `AnalysisResult`、`Flashcard`、`Summary`。
6. 前端在结果页轮询状态，并展示摘要、知识点、建议、标签等内容。

## 数据模型概览

`prisma/schema.prisma` 中定义了 5 个核心模型：

- `User`：用户信息，包含邮箱、密码、姓名、角色
- `Document`：上传资料及处理状态
- `AnalysisResult`：单篇资料分析结果
- `Flashcard`：文档关联闪卡
- `Summary`：按用户沉淀的总结内容

其中 `Document.status` 使用 `DocumentStatus` 枚举管理处理阶段：

- `uploading`
- `extracting`
- `analyzing`
- `done`
- `failed`

## 主要页面

- `/login`：登录
- `/register`：注册
- `/dashboard`：学习控制台
- `/upload`：上传资料
- `/result/[id]`：分析结果
- `/flashcards/[id]`：闪卡详情
- `/summary/[id]`：总结详情
- `/history`：历史记录
- `/profile`：个人中心

## 主要接口

- `POST /api/auth/register`：注册用户
- `POST /api/auth/login`：登录并写入 Cookie
- `POST /api/auth/logout`：退出登录
- `GET /api/dashboard`：仪表盘数据
- `POST /api/documents/upload`：上传文件并触发分析
- `POST /api/documents/[id]/retry`：重新分析
- `GET /api/result/[id]`：获取分析结果
- `GET /api/flashcards/[id]`：获取闪卡
- `GET /api/summary/[id]`：获取总结
- `GET /api/history`：获取历史记录
- `DELETE /api/history/[id]`：删除历史记录
- `GET /api/profile`：获取个人中心数据

## 本地运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在项目根目录创建 `.env`：

```bash
DATABASE_URL="mysql://root:password@localhost:3306/studyflow_ai"
JWT_SECRET="replace-with-a-strong-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. 生成 Prisma Client

```bash
pnpm prisma generate
```

### 4. 执行数据库迁移

```bash
pnpm prisma migrate dev
```

### 5. 启动开发环境

```bash
pnpm dev
```

启动后访问 [http://localhost:3000](http://localhost:3000)。

## 常用命令

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma studio
```

## 当前项目评估

从现有代码来看，这个仓库已经不是空壳，而是一个具备完整学习资料流转雏形的全栈 MVP：

- 页面层已经覆盖核心学习流程
- 数据库模型能支撑“上传 -> 分析 -> 总结 -> 闪卡 -> 历史”链路
- API 设计已经接近真实产品结构

但它还没有达到可稳定交付的状态，主要原因是：

- 鉴权实现不统一，部分接口仍依赖 `mockUserId`
- 分析服务仍是本地模拟数据
- 首页和部分体验细节尚未产品化
- 缺少测试、错误恢复机制和后台任务体系

## 已知问题与改进建议

### 高优先级

- 统一认证方案，只保留一种服务端可信鉴权方式
- 去掉所有 `mockUserId`，改为基于当前用户查询数据
- 将上传后的分析改造成后台任务，避免请求阻塞
- 修复 TypeScript 构建错误并补齐基础静态检查

### 中优先级

- 用真实 OCR / LLM 服务替换占位分析逻辑
- 增加首页落地页和产品介绍页
- 增加环境变量示例文件，如 `.env.example`
- 将 `public/uploads` 改造为对象存储或独立文件服务

### 低优先级

- 补充单元测试和接口测试
- 完善角色体系、学习目标、标签体系
- 增强结果页和闪卡页的交互体验

## 下一步建议

如果继续迭代这个项目，建议优先按下面顺序推进：

1. 修复认证与构建问题，确保项目可稳定启动和打包。
2. 接入真实文档提取与分析服务。
3. 将同步分析改为异步任务队列。
4. 补充测试、日志和部署说明。

## 说明

当前 README 已按仓库现状编写，重点反映“真实完成度”和“当前限制”。如果你接下来要继续推进这个项目，建议优先把认证链路、首页和异步分析三部分做实。它们会决定这个仓库是停留在课程作业级别，还是进入可演示、可继续迭代的产品级原型。
