"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type CopyEnvTemplateProps = {
  template: string;
};

export function CopyEnvTemplate({ template }: CopyEnvTemplateProps) {
  return (
    <div className="relative">
      <textarea
        readOnly
        value={template}
        rows={16}
        className="w-full resize-none rounded-md border bg-muted/50 p-3 font-mono text-xs"
      />
      <Button
        size="sm"
        variant="secondary"
        className="absolute top-2 right-2"
        onClick={async () => {
          await navigator.clipboard.writeText(template);
          toast.success("Plantilla .env copiada al portapapeles.");
        }}
      >
        <Copy className="size-3.5" /> Copiar plantilla
      </Button>
    </div>
  );
}
