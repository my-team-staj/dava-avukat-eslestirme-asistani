import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Portal from "./Portal";
import "../../index.css"; // ya da App.css – sınıflar orada

export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Seçin…",
}) {
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 0, below: true });

  const list = options
    .map((o) => (typeof o === "string" ? { value: o, label: o } : o))
    .filter((o) => (query ? o.label.toLowerCase().includes(query.toLowerCase()) : true));

  const current = options
    .map((o) => (typeof o === "string" ? { value: o, label: o } : o))
    .find((o) => o.value === value);

  const updateCoords = () => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const below = r.bottom + 260 < vh; // 260px ~ menu height guess
    setCoords({ left: r.left, top: below ? r.bottom : r.top, width: r.width, below });
  };

  useLayoutEffect(() => { if (open) updateCoords(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onScroll = () => updateCoords();
    const onResize = () => updateCoords();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const choose = (val) => {
    onChange?.(val);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="select-root" ref={boxRef}>
      <button
        type="button"
        className="select-control"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        {current?.label || placeholder}
        <span className="select-caret">▾</span>
      </button>

      {open && (
        <Portal>
          <div
            className="select-popover"
            style={{
              position: "fixed",
              zIndex: 10000,
              left: coords.left,
              top: coords.below ? coords.top : undefined,
              bottom: coords.below ? undefined : (window.innerHeight - coords.top),
              width: coords.width,
            }}
            role="listbox"
          >
            <div className="select-search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara…"
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              />
            </div>

            <div className="select-menu">
              {list.length === 0 && <div className="select-empty">Sonuç yok</div>}
              {list.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  className={`select-option${o.value === value ? " selected" : ""}`}
                  onClick={() => choose(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
