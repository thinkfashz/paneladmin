import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  checkoutUrl?: string;
};

export function ProductCard({ product, checkoutUrl }: ProductCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      {product.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image_url} alt={product.name} className="h-48 w-full bg-muted object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-muted/50 text-muted-foreground text-sm">
          Sin imagen
        </div>
      )}
      <CardHeader className="pb-2">
        {product.category && (
          <span className="font-semibold text-primary text-xs uppercase tracking-wider">{product.category}</span>
        )}
        <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-2 text-muted-foreground text-sm">
          {product.description ?? "Sin descripción disponible."}
        </p>
        <p className="mt-4 font-bold text-2xl text-foreground">${Number(product.price).toFixed(0)}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">Agregar al Carrito</Button>
        {checkoutUrl && (
          <Button asChild variant="outline" className="shrink-0">
            <Link href={checkoutUrl}>Comprar</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
