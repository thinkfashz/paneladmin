import { Code2, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createGeneratedPageAction } from "../actions/create-generated-page";
import { demoLandingHtml } from "../data";

export function CreateGeneratedPageForm() {
  return (
    <form action={createGeneratedPageAction} className="space-y-4 rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2">
        <Code2 className="size-5" />
        <h2 className="font-semibold text-lg">Crear página HTML</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="title">
            Título
          </label>
          <Input id="title" name="title" defaultValue="Propuesta Premium Demo" />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="clientName">
            Cliente
          </label>
          <Input id="clientName" name="clientName" defaultValue="Cliente demo" />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="niche">
            Nicho
          </label>
          <Input id="niche" name="niche" defaultValue="Negocio local" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="html">
          HTML completo
        </label>
        <Textarea
          id="html"
          name="html"
          className="min-h-[420px] font-mono text-xs"
          defaultValue={demoLandingHtml}
        />
      </div>

      <Button type="submit" className="gap-2">
        <Rocket className="size-4" />
        Guardar y generar link público
      </Button>
    </form>
  );
}
