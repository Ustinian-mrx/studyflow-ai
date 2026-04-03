import OpenAI from "openai";

const apiKey = process.env.DASHSCOPE_API_KEY;

if (!apiKey) {
  throw new Error("缺少 DASHSCOPE_API_KEY 环境变量");
}

export const openai = new OpenAI({
  apiKey,
  // 项目通过百炼提供的 OpenAI 兼容接口访问模型服务。
  baseURL:
    process.env.DASHSCOPE_BASE_URL ||
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export const TONGYI_VISION_MODEL =
  process.env.TONGYI_VISION_MODEL || "qwen3-vl-plus";

export const TONGYI_DOC_MODEL =
  process.env.TONGYI_DOC_MODEL || "qwen-long";
