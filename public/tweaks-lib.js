// tweaks-lib.js — Panneau de tweaks réutilisable
// API : TweaksPanel({ storageKey, title, sections: [{title, controls:[{type,key,label,...,onChange}]}], defaults: {} })
// Types : slider, select, radio (chips), toggle, swatches, text, button
(function () {
  const STYLES = `
.tw-fab{position:fixed;bottom:20px;right:20px;z-index:99998;background:#0a0a0a;color:#fff;border:1px solid rgba(255,255,255,.15);padding:11px 18px;border-radius:999px;font:500 13px -apple-system,BlinkMacSystemFont,system-ui,sans-serif;cursor:pointer;box-shadow:0 12px 30px -10px rgba(0,0,0,.6);transition:transform .2s,box-shadow .2s;letter-spacing:.04em;display:inline-flex;align-items:center;gap:8px}
.tw-fab:hover{transform:translateY(-2px);box-shadow:0 16px 38px -10px rgba(0,0,0,.7)}
.tw-fab .gear{display:inline-block;animation:tw-spin 8s linear infinite}
@keyframes tw-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.tw-panel{position:fixed;top:14px;right:14px;bottom:14px;width:360px;background:#0a0a0a;border:1px solid rgba(255,255,255,.08);border-radius:14px;z-index:99999;transform:translateX(calc(100% + 30px));transition:transform .4s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;font:13px -apple-system,BlinkMacSystemFont,system-ui,sans-serif;color:#E8E8E8;box-shadow:-20px 30px 60px -20px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02)}
.tw-panel[data-open="1"]{transform:translateX(0)}
.tw-head{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.06);background:linear-gradient(180deg,#161616,#0d0d0d);border-radius:14px 14px 0 0}
.tw-title{font-weight:600;font-size:13px;letter-spacing:-.005em;color:#fff;flex:1}
.tw-title .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#3FCF61;margin-right:7px;box-shadow:0 0 8px #3FCF61}
.tw-reset{font-size:10px;padding:5px 9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#9a9a9a;border-radius:5px;cursor:pointer;letter-spacing:.06em;font-family:inherit}
.tw-reset:hover{color:#fff;border-color:rgba(255,255,255,.2)}
.tw-close{width:26px;height:26px;border-radius:5px;border:1px solid rgba(255,255,255,.08);background:transparent;color:#aaa;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit}
.tw-close:hover{color:#fff;border-color:rgba(255,255,255,.2)}
.tw-body{flex:1;overflow-y:auto;padding:0;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.12) transparent}
.tw-body::-webkit-scrollbar{width:6px}
.tw-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
.tw-sec{padding:18px 18px;border-bottom:1px solid rgba(255,255,255,.04)}
.tw-sec:last-child{border-bottom:none}
.tw-sec-h{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#6a6a6a;margin:0 0 14px;display:flex;align-items:center;gap:8px}
.tw-sec-h::before{content:"";display:inline-block;width:14px;height:1px;background:#3a3a3a}
.tw-row{margin-bottom:13px;display:grid;gap:6px}
.tw-row:last-child{margin-bottom:0}
.tw-label{font-size:11.5px;color:#cfcfcf;font-weight:400;display:flex;align-items:center;justify-content:space-between;gap:8px;line-height:1.2}
.tw-val{font-size:10px;color:#7a7a7a;font-family:"JetBrains Mono",ui-monospace,monospace;background:rgba(255,255,255,.04);padding:2px 6px;border-radius:4px;letter-spacing:.02em}
.tw-row input[type=range]{width:100%;-webkit-appearance:none;appearance:none;background:transparent;height:18px;margin:0;cursor:pointer}
.tw-row input[type=range]::-webkit-slider-runnable-track{height:3px;background:rgba(255,255,255,.1);border-radius:2px}
.tw-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:13px;height:13px;border-radius:50%;background:#fff;margin-top:-5px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}
.tw-row input[type=range]::-moz-range-track{height:3px;background:rgba(255,255,255,.1);border-radius:2px}
.tw-row input[type=range]::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:#fff;border:0;cursor:pointer}
.tw-row select,.tw-row input[type=text]{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#fff;padding:8px 10px;border-radius:6px;font-size:12px;width:100%;outline:none;font-family:inherit}
.tw-row select{cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%23888' d='M0 0l5 6 5-6z'/></svg>");background-repeat:no-repeat;background-position:right 10px center;padding-right:30px}
.tw-row select:focus,.tw-row input[type=text]:focus{border-color:rgba(255,255,255,.22)}
.tw-radio{display:flex;gap:3px;flex-wrap:wrap}
.tw-chip{flex:1;min-width:54px;font-size:10.5px;padding:7px 8px;border-radius:5px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#aaa;cursor:pointer;text-align:center;transition:all .15s;font-family:inherit;letter-spacing:.04em;line-height:1.2}
.tw-chip[data-active="1"]{background:#fff;color:#000;border-color:#fff}
.tw-chip:hover:not([data-active="1"]){border-color:rgba(255,255,255,.2);color:#fff}
.tw-toggle-wrap{display:flex;align-items:center;justify-content:space-between;gap:8px}
.tw-toggle-wrap .tw-label{flex:1}
.tw-toggle{padding:5px 12px;font-size:9.5px;letter-spacing:.18em;border-radius:4px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#777;cursor:pointer;font-family:inherit;font-weight:600}
.tw-toggle[data-on="1"]{background:#3FCF61;border-color:#3FCF61;color:#0a0a0a}
.tw-swatches{display:grid;grid-template-columns:repeat(8,1fr);gap:5px}
.tw-sw{aspect-ratio:1;border-radius:5px;border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:transform .15s,box-shadow .15s;position:relative;padding:0}
.tw-sw[data-active="1"]{box-shadow:0 0 0 2px #0a0a0a inset, 0 0 0 2px #fff;transform:scale(1.08)}
.tw-sw:hover{transform:scale(1.12)}
.tw-btn{padding:9px 12px;font-size:11px;border-radius:6px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#ddd;cursor:pointer;font-family:inherit;letter-spacing:.04em;width:100%}
.tw-btn:hover{background:rgba(255,255,255,.08);color:#fff}

@media(max-width:640px){
  .tw-panel{left:14px;width:auto}
  .tw-fab{padding:10px 14px;font-size:12px}
}
`;

  function el(tag, attrs = {}, kids = []) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "style" && typeof v === "object") Object.assign(e.style, v);
      else if (k === "class") e.className = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "dataset" && typeof v === "object") Object.assign(e.dataset, v);
      else e.setAttribute(k, v);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach((c) => {
      if (c == null || c === false) return;
      e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return e;
  }

  function TweaksPanel(config) {
    const key = config.storageKey || "tweaks";
    let state = {};
    try { state = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}

    const get = (k, def) => (k in state ? state[k] : def);
    const set = (k, v) => { state[k] = v; localStorage.setItem(key, JSON.stringify(state)); };

    if (!document.getElementById("tw-styles")) {
      const s = document.createElement("style");
      s.id = "tw-styles";
      s.textContent = STYLES;
      document.head.appendChild(s);
    }

    const fab = el("button", { class: "tw-fab", title: "Ouvrir les tweaks" }, [
      el("span", { class: "gear" }, "⚙"),
      "Tweaks"
    ]);
    document.body.appendChild(fab);

    const panel = el("aside", { class: "tw-panel", dataset: { open: "0" } });
    document.body.appendChild(panel);

    fab.addEventListener("click", () => {
      panel.dataset.open = panel.dataset.open === "1" ? "0" : "1";
    });

    const head = el("header", { class: "tw-head" }, [
      el("div", { class: "tw-title" }, [el("span", { class: "dot" }), config.title || "Tweaks"]),
      el("button", { class: "tw-reset", onclick: () => { localStorage.removeItem(key); location.reload(); } }, "↺ Reset"),
      el("button", { class: "tw-close", onclick: () => (panel.dataset.open = "0") }, "×"),
    ]);
    panel.appendChild(head);

    const body = el("div", { class: "tw-body" });
    panel.appendChild(body);

    const radioGroups = {};

    function makeControl(ctrl) {
      const cur = get(ctrl.key, ctrl.default);

      if (ctrl.type === "slider") {
        const row = el("div", { class: "tw-row" });
        const out = el("span", { class: "tw-val" }, String(cur) + (ctrl.unit || ""));
        const label = el("div", { class: "tw-label" }, [ctrl.label, out]);
        const input = el("input", { type: "range", min: ctrl.min, max: ctrl.max, step: ctrl.step || 1, value: cur });
        input.addEventListener("input", (e) => {
          const nv = Number(e.target.value);
          set(ctrl.key, nv);
          out.textContent = String(nv) + (ctrl.unit || "");
          ctrl.onChange(nv);
        });
        row.appendChild(label);
        row.appendChild(input);
        return row;
      }

      if (ctrl.type === "select") {
        const row = el("div", { class: "tw-row" });
        row.appendChild(el("div", { class: "tw-label" }, ctrl.label));
        const sel = el("select");
        for (const opt of ctrl.options) {
          const val = typeof opt === "object" ? opt.value : opt;
          const lab = typeof opt === "object" ? opt.label : opt;
          const o = el("option", { value: val });
          o.textContent = lab;
          if (val === cur) o.selected = true;
          sel.appendChild(o);
        }
        sel.addEventListener("change", (e) => {
          set(ctrl.key, e.target.value);
          ctrl.onChange(e.target.value);
        });
        row.appendChild(sel);
        return row;
      }

      if (ctrl.type === "radio") {
        const row = el("div", { class: "tw-row" });
        row.appendChild(el("div", { class: "tw-label" }, ctrl.label));
        const group = el("div", { class: "tw-radio" });
        radioGroups[ctrl.key] = group;
        for (const opt of ctrl.options) {
          const val = typeof opt === "object" ? opt.value : opt;
          const lab = typeof opt === "object" ? opt.label : opt;
          const btn = el("button", { class: "tw-chip", dataset: { active: cur === val ? "1" : "0" } }, lab);
          btn.addEventListener("click", () => {
            set(ctrl.key, val);
            group.querySelectorAll("button").forEach((b) => (b.dataset.active = "0"));
            btn.dataset.active = "1";
            ctrl.onChange(val);
          });
          group.appendChild(btn);
        }
        row.appendChild(group);
        return row;
      }

      if (ctrl.type === "toggle") {
        const row = el("div", { class: "tw-row tw-toggle-wrap" });
        row.appendChild(el("div", { class: "tw-label" }, ctrl.label));
        const t = el("button", { class: "tw-toggle", dataset: { on: cur ? "1" : "0" } }, cur ? "ON" : "OFF");
        t.addEventListener("click", () => {
          const nv = !get(ctrl.key, ctrl.default);
          set(ctrl.key, nv);
          t.dataset.on = nv ? "1" : "0";
          t.textContent = nv ? "ON" : "OFF";
          ctrl.onChange(nv);
        });
        row.appendChild(t);
        return row;
      }

      if (ctrl.type === "swatches") {
        const row = el("div", { class: "tw-row" });
        row.appendChild(el("div", { class: "tw-label" }, ctrl.label));
        const group = el("div", { class: "tw-swatches" });
        for (const opt of ctrl.options) {
          const val = typeof opt === "object" ? opt.value : opt;
          const color = typeof opt === "object" ? opt.color : opt;
          const title = typeof opt === "object" ? opt.label || val : val;
          const btn = el("button", { class: "tw-sw", dataset: { active: cur === val ? "1" : "0" }, style: { background: color }, title });
          btn.addEventListener("click", () => {
            set(ctrl.key, val);
            group.querySelectorAll("button").forEach((b) => (b.dataset.active = "0"));
            btn.dataset.active = "1";
            ctrl.onChange(val);
          });
          group.appendChild(btn);
        }
        row.appendChild(group);
        return row;
      }

      if (ctrl.type === "text") {
        const row = el("div", { class: "tw-row" });
        row.appendChild(el("div", { class: "tw-label" }, ctrl.label));
        const input = el("input", { type: "text", value: cur || "" });
        input.addEventListener("input", (e) => {
          set(ctrl.key, e.target.value);
          ctrl.onChange(e.target.value);
        });
        row.appendChild(input);
        return row;
      }

      if (ctrl.type === "button") {
        const row = el("div", { class: "tw-row" });
        const b = el("button", { class: "tw-btn", onclick: ctrl.onClick }, ctrl.label);
        row.appendChild(b);
        return row;
      }
    }

    for (const sec of config.sections) {
      const secEl = el("section", { class: "tw-sec" });
      secEl.appendChild(el("h4", { class: "tw-sec-h" }, sec.title));
      for (const ctrl of sec.controls) {
        const node = makeControl(ctrl);
        if (node) secEl.appendChild(node);
      }
      body.appendChild(secEl);
    }

    // Apply all defaults / persisted values on init
    for (const sec of config.sections) {
      for (const ctrl of sec.controls) {
        if (ctrl.onChange) ctrl.onChange(get(ctrl.key, ctrl.default));
      }
    }
  }

  window.TweaksPanel = TweaksPanel;
})();
