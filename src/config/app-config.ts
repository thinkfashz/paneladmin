import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Omnifix Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Omnifix. Todo tiene solución.`,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://admin-nine.vercel.app",
  meta: {
    title: "Omnifix Admin | Dashboard, tienda y operaciones",
    description:
      "Omnifix Admin centraliza la vitrina e-commerce, clientes, productos, Page Engine, métricas y operaciones técnicas con una experiencia azul, moderna y mobile-first.",
  },
};
