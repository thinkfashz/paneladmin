import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Studio Admin",
  description: "A Next.js admin template with TypeScript & Shadcn UI",
  version: packageJson.version,
  author: {
    name: "Arham Khan",
    url: "https://github.com/arhamkhnz",
  },
  copyright: `${currentYear} Studio Admin`,
};
