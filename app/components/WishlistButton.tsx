"use client";

import { useSyncExternalStore } from "react";

function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2S4.5 15.8 4.5 9.8A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.5 2.5c0 6-7.5 10.4-7.5 10.4Z" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" /></svg>;
}

export function WishlistButton({ productKey }: { productKey: string }) {
  const subscribe = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener("rhinory-wishlist-updated", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("rhinory-wishlist-updated", onChange);
    };
  };
  const getSnapshot = () => {
    try {
      const current = JSON.parse(window.localStorage.getItem("rhinory_wishlist") || "[]") as string[];
      return current.includes(productKey);
    } catch {
      return false;
    }
  };
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const current = JSON.parse(window.localStorage.getItem("rhinory_wishlist") || "[]") as string[];
      const next = current.includes(productKey) ? current.filter((item) => item !== productKey) : [...current, productKey];
      window.localStorage.setItem("rhinory_wishlist", JSON.stringify(next));
      window.dispatchEvent(new Event("rhinory-wishlist-updated"));
    } catch {
      return;
    }
  };

  return <button type="button" className={`wishlist ${saved ? "is-saved" : ""}`} aria-label={saved ? "찜하기 해제" : "찜하기"} aria-pressed={saved} onClick={toggle}><HeartIcon /></button>;
}
