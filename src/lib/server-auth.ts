import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function getCurrentUserFromRequest(req: Request) {
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

    const token = cookies[AUTH_COOKIE_NAME];

    if (!token) {
        return null;
    }

    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(payload.userId) },
        select: {
            id: true,
            email: true,
            username: true,
        },
    });

    return user;
}