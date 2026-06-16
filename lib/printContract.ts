export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_PX = (A4_WIDTH_MM * 96) / 25.4;
export const A4_HEIGHT_PX = (A4_HEIGHT_MM * 96) / 25.4;

type StyleValues = Record<string, string>;

type StyleSnapshot = {
  el: HTMLElement;
  keys: string[];
  previous: StyleValues;
};

/** Reset preview scaling so print/PDF capture matches the on-screen A4 layout. */
export function prepareContractForCapture(root: HTMLElement): () => void {
  const snapshots: StyleSnapshot[] = [];

  function apply(el: HTMLElement, values: StyleValues) {
    const previous: StyleValues = {};
    for (const [key, value] of Object.entries(values)) {
      previous[key] = el.style.getPropertyValue(key);
      el.style.setProperty(key, value);
    }
    snapshots.push({ el, keys: Object.keys(values), previous });
  }

  apply(root, {
    width: `${A4_WIDTH_MM}mm`,
    "max-width": `${A4_WIDTH_MM}mm`,
    padding: "0",
    margin: "0",
    background: "white",
    overflow: "visible",
  });

  const viewport = root.querySelector<HTMLElement>(".contract-preview__viewport");
  if (viewport) {
    apply(viewport, {
      width: `${A4_WIDTH_MM}mm`,
      "max-width": `${A4_WIDTH_MM}mm`,
      margin: "0",
      overflow: "visible",
    });
  }

  const content = root.querySelector<HTMLElement>(".contract-preview__content");
  if (content) {
    apply(content, {
      transform: "none",
      width: `${A4_WIDTH_MM}mm`,
      "max-width": `${A4_WIDTH_MM}mm`,
      margin: "0",
      "margin-bottom": "0",
    });
  }

  const pages = root.querySelector<HTMLElement>(".contract-pages");
  if (pages) {
    apply(pages, {
      width: `${A4_WIDTH_MM}mm`,
      "max-width": `${A4_WIDTH_MM}mm`,
      gap: "0",
    });
  }

  root.querySelectorAll<HTMLElement>(".a4-page").forEach((page) => {
    apply(page, {
      width: `${A4_WIDTH_MM}mm`,
      "max-width": `${A4_WIDTH_MM}mm`,
      "min-width": `${A4_WIDTH_MM}mm`,
      "min-height": `${A4_HEIGHT_MM}mm`,
      "box-sizing": "border-box",
      margin: "0",
      "box-shadow": "none",
    });
  });

  return () => {
    for (const snapshot of snapshots.reverse()) {
      for (const key of snapshot.keys) {
        if (snapshot.previous[key]) {
          snapshot.el.style.setProperty(key, snapshot.previous[key]);
        } else {
          snapshot.el.style.removeProperty(key);
        }
      }
    }
  };
}
