import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export type JwtPayload = {
    id: number;
    email: string;
};

export function signToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        // 无论是过期、伪造还是格式错误 token，都按未登录处理。
        return null;
    }
}

export function getBearerTokenFromRequest(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return null;
    }

    return token;
}
