import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");

test("RHINORY home preserves the commerce structure", async () => {
  const page = await read("app/page.tsx");
  assert.match(page, /전체 카테고리/);
  assert.match(page, /오늘의 특가/);
  assert.match(page, /인기 카테고리/);
  assert.match(page, /무료 설치 상담/);
  assert.match(page, /많이 찾는 상품/);
  assert.match(page, /실제 설치 사례/);
  assert.match(page, /RHINORY PARTNER/);
  assert.doesNotMatch(page, /😀|😃|😄|😁|😂|🤣|😊|😍|👍|🏡|🌿|✨|🛒|🔍|📦|⭐|❤️/);
});

test("admin operations include product, inventory and inquiry workflows", async () => {
  const admin = await read("app/admin/page.tsx");
  assert.match(admin, /신규 상품 등록/);
  assert.match(admin, /재고 관리/);
  assert.match(admin, /문의 관리/);
  assert.match(admin, /이미지 업로드/);
  assert.ok(admin.includes("/api/admin/products"));
  assert.ok(admin.includes("/api/admin/inventory"));
});

test("production configuration and placeholder assets exist", async () => {
  const env = await read(".env.example");
  const schema = await read("db/schema.ts");
  assert.match(env, /DATABASE_URL=/);
  assert.match(env, /ADMIN_ACCESS_KEY=/);
  assert.match(env, /BLOB_READ_WRITE_TOKEN=/);
  assert.match(schema, /pgTable\("products"/);
  assert.match(schema, /pgTable\("inventory"/);
  await Promise.all([
    access(new URL("public/images/product-placeholder.svg", root)),
    access(new URL("public/images/product-gate.png", root)),
    access(new URL("public/images/product-fence.png", root)),
  ]);
});
