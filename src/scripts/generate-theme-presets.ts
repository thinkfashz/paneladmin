/**
 * Node script — run once to scaffold theme-preset CSS files.
 *
 * Usage:  npx ts-node -P tsconfig.node.json src/scripts/generate-theme-presets.ts
 *
 * For each preset defined below the script writes (or overwrites)
 *   src/styles/presets/<name>.css
 * containing the full set of shadcn/ui CSS-variable overrides.
 */

import * as fs from "fs";
import * as path from "path";

interface ThemeTokens {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius: string;
}

interface Preset {
  name: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

const presets: Preset[] = [
  {
    name: "tangerine",
    light: {
      background: "30 100% 98%",
      foreground: "20 14% 10%",
      card: "0 0% 100%",
      "card-foreground": "20 14% 10%",
      popover: "0 0% 100%",
      "popover-foreground": "20 14% 10%",
      primary: "25 95% 53%",
      "primary-foreground": "0 0% 100%",
      secondary: "30 60% 94%",
      "secondary-foreground": "25 50% 30%",
      muted: "30 40% 96%",
      "muted-foreground": "25 20% 45%",
      accent: "30 60% 94%",
      "accent-foreground": "25 50% 30%",
      destructive: "0 84% 60%",
      "destructive-foreground": "0 0% 98%",
      border: "30 30% 88%",
      input: "30 30% 88%",
      ring: "25 95% 53%",
      radius: "0.5rem",
    },
    dark: {
      background: "20 14% 9%",
      foreground: "30 20% 95%",
      card: "20 14% 12%",
      "card-foreground": "30 20% 95%",
      popover: "20 14% 12%",
      "popover-foreground": "30 20% 95%",
      primary: "25 95% 53%",
      "primary-foreground": "0 0% 100%",
      secondary: "20 14% 18%",
      "secondary-foreground": "30 20% 85%",
      muted: "20 14% 16%",
      "muted-foreground": "30 15% 60%",
      accent: "20 14% 18%",
      "accent-foreground": "30 20% 85%",
      destructive: "0 62% 30%",
      "destructive-foreground": "0 0% 98%",
      border: "20 14% 20%",
      input: "20 14% 20%",
      ring: "25 95% 53%",
      radius: "0.5rem",
    },
  },
];

function tokensToCSS(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

function presetToCSS(preset: Preset): string {
  return [
    `/* Auto-generated — do not edit by hand. Re-run generate-theme-presets.ts */`,
    `.theme-${preset.name} {`,
    tokensToCSS(preset.light),
    `}`,
    ``,
    `.dark.theme-${preset.name} {`,
    tokensToCSS(preset.dark),
    `}`,
    ``,
  ].join("\n");
}

const outDir = path.resolve(__dirname, "../styles/presets");
fs.mkdirSync(outDir, { recursive: true });

for (const preset of presets) {
  const filePath = path.join(outDir, `${preset.name}.css`);
  const css = presetToCSS(preset);
  fs.writeFileSync(filePath, css, "utf-8");
  console.log(`Wrote ${filePath}`);
}

console.log("Done.");
