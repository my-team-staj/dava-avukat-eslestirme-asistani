import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Portal from "./Portal";

export default function SearchableMultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Seçin…",
}) {
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ left: 0, top: 0, width: 0, below: true });

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const list = normalized.filter((o) =>
    query ? o.label.toLowerCase().includes(query.toLowerCase()) : true
  );

  const updateCoords = () => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const below = r.bottom + 260 < vh;
    setCoords({ left: r.left, top: r.bottom, width: r.width, below });
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

  const toggle = (val) => {
    const set = new Set(selected);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    onChange?.([...set]);
  };

  const removeChip = (val) => {
    onChange?.(selected.filter((v) => v !== val));
  };

  return (
    <div className="select-root" ref={boxRef}>
      {/* Üstteki kontrol: daima placeholder göster; caret sağda */}
      <button
        type="button"
        className="select-control"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <span className={`select-placeholder${selected.length ? " muted" : ""}`}>
          {placeholder}
        </span>
        <span className="select-caret">▾</span>
      </button>

      {/* Seçili dilleri etiket (chip) olarak kontrolün ALTINDA göster */}
      {selected.length > 0 && (
        <div className="select-chips">
          {selected.map((val) => {
            const label = normalized.find((o) => o.value === val)?.label ?? val;
            return (
              <span key={val} className="chip" title={label}>
                {label}
                <button
                  type="button"
                  className="chip-x"
                  onClick={() => removeChip(val)}
                  aria-label={`${label} sil`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {open && (
        <Portal>
          <div
            className="select-popover"
            style={{
              position: "fixed",
              zIndex: 10000,
              left: coords.left,
              top: coords.top,
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
              {list.map((o) => {
                const checked = selected.includes(o.value);
                return (
                  <label key={o.value} className="select-option">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(o.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{o.label}</span>
                  </label>
                );
              })}
              <div className="select-actions">
                <button type="button" onClick={() => setOpen(false)} className="btn-small">
                  Tamam
                </button>
                <button type="button" onClick={() => onChange?.([])} className="btn-small ghost">
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
