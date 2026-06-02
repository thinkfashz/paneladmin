import type { BrandTheme } from "../types";

type BrandPreviewProps = {
  brand: BrandTheme;
};

export function BrandPreview({ brand }: BrandPreviewProps) {
  return (
    <section
      className="overflow-hidden rounded-3xl border shadow-sm"
      style={{
        backgroundColor: brand.identity.backgroundColor,
        color: brand.identity.textColor,
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-white/80 shadow-sm">
            {brand.identity.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.identity.logoUrl} alt={brand.identity.name} className="h-10 w-10 object-contain" />
            ) : (
              <span className="font-bold text-xl" style={{ color: brand.identity.secondaryColor }}>
                {brand.identity.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-xl tracking-tight">{brand.identity.name}</h3>
            <p className="text-sm opacity-70">{brand.identity.tagline}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur">
          <p className="font-medium text-sm opacity-70">Vista previa</p>
          <h4 className="mt-2 font-semibold text-2xl">{brand.loading.message}</h4>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: brand.identity.secondaryColor }} />
          </div>
        </div>
      </div>
    </section>
  );
}
