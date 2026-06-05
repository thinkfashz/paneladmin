import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DOCS = [
  {
    nombre: "Libro de Ventas (Electrónico)",
    descripcion: "Registro de todas las facturas y boletas electrónicas emitidas del período mensual.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 59 DL 825/1974",
  },
  {
    nombre: "Libro de Compras (Electrónico)",
    descripcion: "Registro de facturas recibidas de proveedores para acreditar el crédito fiscal IVA.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 23 y 59 DL 825/1974",
  },
  {
    nombre: "Declaración F29 (Mensual)",
    descripcion: "Formulario de IVA + PPM. Se declara mensualmente en el portal SII. Multa si no se declara.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 de cada mes",
    ley: "Art. 64 DL 825/1974 · Art. 97 N°11 CT",
  },
  {
    nombre: "Declaración F22 (Anual)",
    descripcion: "Declaración anual de renta. Incluye todos los ingresos y gastos del año tributario.",
    obligatorio: true,
    estado: "al-dia",
    plazo: "30 de Abril de cada año",
    ley: "Art. 65 Ley de Renta",
  },
  {
    nombre: "Boletas y Facturas Electrónicas",
    descripcion: "DTEs emitidos y recibidos. Obligatorio desde 2022. Se gestionan vía SII o software certificado.",
    obligatorio: true,
    estado: "al-dia",
    plazo: "En tiempo real",
    ley: "Res. Ex. SII N°45/2019",
  },
  {
    nombre: "DDJJ 1945 – Honorarios Pagados",
    descripcion: "Declaración jurada anual de honorarios pagados a personas naturales durante el año anterior.",
    obligatorio: false,
    estado: "pendiente",
    plazo: "15 de Marzo",
    ley: "Art. 101 LIR",
  },
  {
    nombre: "Libro de Remuneraciones",
    descripcion: "Si tienes trabajadores con contrato, el libro debe mantenerse actualizado y firmado mensualmente.",
    obligatorio: false,
    estado: "no-aplica",
    plazo: "Mensual",
    ley: "Art. 62 Código del Trabajo",
  },
  {
    nombre: "Declaración Jurada F50 (Retenciones)",
    descripcion: "Para empresas que retienen impuesto a trabajadores independientes (honorarios). Mensual.",
    obligatorio: false,
    estado: "no-aplica",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 74 Ley de Renta",
  },
];

const badgeEstado = (estado: string) => {
  if (estado === "al-dia") {
    return (
      <Badge className="bg-green-500/10 text-green-700 border-green-500/30 text-xs" variant="outline">
        Al día ✓
      </Badge>
    );
  }
  if (estado === "pendiente") {
    return (
      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs" variant="outline">
        Pendiente
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      No aplica
    </Badge>
  );
};

export function DocumentosRequeridos() {
  const pendientes = DOCS.filter((d) => d.estado === "pendiente").length;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Documentos y Obligaciones Tributarias</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Guía legal completa de documentos requeridos por el SII y organismos fiscales.
            </p>
          </div>
          {pendientes > 0 && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/30 shrink-0">
              {pendientes} pendientes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS.map((doc) => (
            <div key={doc.nombre} className="rounded-xl border bg-card p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm leading-tight flex-1">{doc.nombre}</p>
                <div className="shrink-0">{badgeEstado(doc.estado)}</div>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed flex-1">{doc.descripcion}</p>
              <div className="pt-2 border-t flex flex-col gap-1">
                <p className="text-xs">
                  <span className="text-muted-foreground">Plazo:</span> {doc.plazo}
                </p>
                <p className="text-primary/50 text-xs">{doc.ley}</p>
                {doc.obligatorio && (
                  <Badge variant="outline" className="w-fit text-xs py-0 h-4 mt-1">
                    Obligatorio
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
