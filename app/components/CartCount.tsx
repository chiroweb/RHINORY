"use client";

import { useEffect, useState } from "react";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(window.localStorage.getItem("rhinory_cart") || "[]") as { quantity?: number }[];
        setCount(items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0));
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener("rhinory-cart-updated", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("rhinory-cart-updated", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return <b aria-label={`장바구니 상품 ${count}개`}>{count}</b>;
}
