import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

function getTokenFromCookie(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((item) => {
      const [key, ...rest] = item.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  return cookies[AUTH_COOKIE_NAME] ?? null;
}

function getTokenFromAuthorization(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function getCurrentUserFromRequest(req: Request) {
  // 同时支持浏览器 Cookie 鉴权和服务端 Bearer 透传鉴权。
  const token = getTokenFromCookie(req) || getTokenFromAuthorization(req);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);

  // 只有在 payload 结构通过校验后才继续查库。
  if (!payload || typeof payload.id !== "number") {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return user;
}
