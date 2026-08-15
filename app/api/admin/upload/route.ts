import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminAuthorized } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthorized())) return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN을 설정하면 이미지 업로드를 사용할 수 있습니다." }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "이미지 파일을 선택하세요." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "JPG, PNG, WEBP, AVIF 이미지만 업로드할 수 있습니다." }, { status: 400 });
  if (file.size > maxBytes) return NextResponse.json({ error: "이미지는 8MB 이하로 업로드하세요." }, { status: 400 });

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const blob = await put(`rhinory/products/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: true });
  return NextResponse.json({ url: blob.url });
}
