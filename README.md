# StudyFlow AI

StudyFlow AI 是一个面向学习场景的智能资料分析系统。用户可以上传 PDF 或图片类学习资料，系统会对内容进行分析，并生成分析结果、闪卡、单篇总结和周总结，帮助用户完成“上传资料 -> 理解内容 -> 复习巩固”的学习闭环。

## 项目简介

本项目的核心目标是把零散的学习资料转化为更容易复习和整理的结构化内容。它主要面向以下场景：

- 上传课件、讲义、实验报告、截图笔记等学习资料
- 自动生成摘要、知识点、疑难点和学习建议
- 自动生成闪卡，用于快速复习
- 生成单篇总结和周总结，帮助做阶段复盘

## 主要功能

- 用户注册、登录、退出登录
- 上传学习资料
  - 支持 `PDF`、`PNG`、`JPG`、`JPEG`、`WEBP`
  - 单个文件大小限制为 `10MB`
- AI 分析资料内容
  - 生成摘要
  - 提取知识点
  - 提取疑难点
  - 生成学习建议
- 自动生成闪卡
- 单篇总结查看
- 周总结列表与详情查看
- 历史记录查看、删除、重试分析
- 首页控制台统计与快捷入口

## 当前 AI 能力说明

项目当前接入了通义千问相关模型进行资料分析：

- 图片资料：视觉模型
- PDF / 长文档：文档分析模型

同时，项目保留了一个本地兜底分析逻辑：

- 当外部 AI 服务不可用时，系统会自动生成本地兜底分析结果
- 这样可以保证上传、结果页、闪卡页和总结页的主流程仍然可联调、可演示

## 技术栈

- 前端框架：Next.js 16
- UI：React 19、Tailwind CSS、shadcn/ui
- 后端：Next.js App Router API Routes
- 数据库：MySQL
- ORM：Prisma
- 鉴权：JWT + Cookie
- AI 接入：OpenAI SDK 兼容方式接入阿里云百炼 / 通义千问

## 页面结构

项目当前主要页面包括：

- `/login`：登录页
- `/register`：注册页
- `/dashboard`：学习控制台
- `/upload`：资料上传页
- `/history`：历史记录页
- `/result/[id]`：分析结果页
- `/flashcards/[id]`：闪卡页
- `/summary/[id]`：单篇总结页
- `/summaries`：周总结列表页
- `/summaries/weekly/[id]`：周总结详情页
- `/profile`：个人中心

## 环境变量

请在项目根目录创建 `.env` 文件，并根据本地环境填写以下内容：

```env
DATABASE_URL="mysql://root:你的密码@localhost:3306/studyflow"
JWT_SECRET="一串足够长的随机字符串"

DASHSCOPE_API_KEY="你的 API Key"
DASHSCOPE_BASE_URL=

TONGYI_VISION_MODEL=
TONGYI_DOC_MODEL=

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

说明：

- `DATABASE_URL`：MySQL 连接地址
- `JWT_SECRET`：JWT 签名密钥
- `DASHSCOPE_API_KEY`：通义千问 / 百炼 API Key
- `DASHSCOPE_BASE_URL`：百炼兼容 OpenAI 的接口地址
- `TONGYI_VISION_MODEL`：图片分析模型
- `TONGYI_DOC_MODEL`：PDF / 长文档分析模型
- `NEXT_PUBLIC_APP_URL`：项目运行地址

## 本地运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置数据库

确保本地 MySQL 中已创建数据库：

```sql
CREATE DATABASE studyflow;
```

### 3. 执行 Prisma 迁移

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. 启动项目

```bash
pnpm dev
```

启动后访问：

```txt
http://localhost:3000
```

## 常用命令

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm prisma migrate dev
pnpm prisma generate
```

## 数据流说明

项目的核心处理流程如下：

1. 用户登录系统
2. 上传 PDF 或图片资料
3. 系统保存文件并创建文档记录
4. 后端触发资料分析
5. 生成分析结果、闪卡和总结
6. 用户在结果页、闪卡页和总结页查看内容

## 当前项目状态

当前项目已经完成以下闭环：

- 用户注册 / 登录 / 退出
- 文件上传
- 文档分析
- 分析结果查看
- 闪卡查看
- 单篇总结查看
- 周总结查看
- 历史记录删除与重试

项目当前更偏向一个可继续扩展的 MVP，后续仍可继续优化：

- 提升真实 AI 输出质量
- 增强 PDF / 图片识别效果
- 增加更多学习复盘能力
- 完善测试与部署文档

## 项目适用场景

StudyFlow AI 适合作为：

- 课程设计项目
- 毕业设计前期原型
- AI 学习辅助系统作品集项目
- 前后端全栈实践项目

## 目录结构

```txt
src/
  app/                    页面与 API 路由
  components/             页面组件
  data/                   数据获取与类型定义
  lib/                    工具函数、鉴权、Prisma、AI 服务
  lib/services/           业务服务，如文档分析
prisma/
  schema.prisma           Prisma 数据模型
  migrations/             数据库迁移记录
public/uploads/           用户上传文件
```

## 说明

如果外部 AI 服务状态异常，项目会自动进入本地兜底分析模式，以保证主要功能链路仍可运行。这种设计主要用于开发、联调和课堂展示，不影响后续继续切回真实 AI 服务。
