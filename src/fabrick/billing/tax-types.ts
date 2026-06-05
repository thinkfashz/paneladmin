// Tipos tributarios chilenos - SII

export type RegimeTributario = "general" | "14-ter" | "propyme" | "propyme-transparente";

export type TipoDocumentoTributario = "factura" | "boleta" | "nota-credito" | "nota-debito" | "liquidacion";

export type RegistroVenta = {
  id: string;
  folio: string;
  tipo: TipoDocumentoTributario;
  rut_receptor?: string | null;
  razon_social?: string | null;
  fecha: string;
  neto: number;
  iva: number;
  total: number;
  business_id: string;
};

export type RegistroCompra = {
  id: string;
  folio: string;
  tipo: TipoDocumentoTributario;
  rut_emisor: string;
  razon_social: string;
  fecha: string;
  neto: number;
  iva_credito: number;
  total: number;
  business_id: string;
};

export type DeclaracionF29 = {
  periodo: string; // "YYYY-MM"
  ventas_netas: number;
  iva_debito: number;
  compras_netas: number;
  iva_credito: number;
  iva_a_pagar: number;
  remanente_credito_fiscal: number;
  ppm_tasa: number;
  ppm_monto: number;
  total_a_pagar: number;
  estado: "pendiente" | "declarado" | "pagado";
  business_id: string;
};

export type BeneficioTributario = {
  id: string;
  nombre: string;
  descripcion: string;
  ley: string;
  requisito: string;
  ahorro_estimado: string;
  desbloqueado: boolean;
  progreso: number; // 0-100
  categoria: "pyme" | "inversion" | "exportacion" | "innovacion" | "laboral";
};

export type DocumentoSII = {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  estado: "al-dia" | "pendiente" | "no-aplica" | "vencido";
  fecha_limite?: string | null;
  referencia_legal: string;
};

export type ItemCarpetaTributaria = {
  nombre: string;
  completado: boolean;
  puntos: number;
};

export type CreditoFiscal = {
  nombre: string;
  descripcion: string;
  requiere_progreso: number; // porcentaje mínimo de carpeta tributaria
  url_solicitud?: string;
};
