"use client";

import { useState } from "react";

type CartItem = { productId: number; slug: string; name: string; sku: string; priceText: string; thumbnailUrl: string; quantity: number };

export function AddToCartButton({ item }: { item: Omit<CartItem, "quantity"> }) {
  const [notice, setNotice] = useState("");
  const add = () => {
    try {
      const current = JSON.parse(window.localStorage.getItem("rhinory_cart") || "[]") as CartItem[];
      const found = current.find((entry) => entry.slug === item.slug);
      const next = found ? current.map((entry) => entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }];
      window.localStorage.setItem("rhinory_cart", JSON.stringify(next));
      window.dispatchEvent(new Event("rhinory-cart-updated"));
      setNotice("장바구니에 담았습니다.");
      window.setTimeout(() => setNotice(""), 2200);
    } catch { setNotice("장바구니를 사용할 수 없습니다."); }
  };
  return <><button type="button" className="outline-button detail-cart" onClick={add}>장바구니 담기</button>{notice && <span className="cart-inline-notice">{notice}</span>}</>;
}
