// Type definition for parsed Ghostty themes. The actual theme list is
// emitted to ./themes.generated.ts by scripts/build-themes.mjs.

export type Hex = `#${string}`;

export type Theme = {
  name: string;
  palette: Hex[]; // length 16
  background: Hex;
  foreground: Hex;
  cursor: Hex;
  selectionBg: Hex;
  selectionFg: Hex;
};

export { THEMES, FEATURED_COUNT } from "./themes.generated";
