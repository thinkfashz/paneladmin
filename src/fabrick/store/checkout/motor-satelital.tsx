"use client";

import { useState } from "react";

import { CheckCircle, Loader2, MapPin, Satellite } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; lat: number; lng: number; address: string }
  | { status: "error"; message: string };

export function MotorSatelital() {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [manualAddress, setManualAddress] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation({ status: "error", message: "Tu navegador no soporta geolocalización." });
      return;
    }
    setLocation({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const address = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "O"}`;
        setLocation({ status: "success", lat, lng, address });
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Permiso denegado. Ingresa tu dirección manualmente.",
          2: "No se pudo obtener tu ubicación. Verifica tu GPS.",
          3: "Tiempo agotado. Intenta de nuevo.",
        };
        setLocation({ status: "error", message: messages[error.code] ?? "Error de geolocalización." });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Satellite className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Motor Satelital Premium</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            GPS
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">Detecta tu ubicación exacta para entrega de precisión.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {location.status === "idle" && (
          <Button onClick={detectLocation} variant="outline" className="w-full gap-2 border-primary/30">
            <MapPin className="h-4 w-4 text-primary" />
            Detectar mi ubicación automáticamente
          </Button>
        )}

        {location.status === "loading" && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 py-3 text-primary text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Localizando vía satélite…
          </div>
        )}

        {location.status === "success" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-green-700 text-sm dark:text-green-400">Ubicación detectada</p>
                <p className="font-mono text-muted-foreground text-xs">{location.address}</p>
                <p className="text-muted-foreground text-xs">
                  Lat: {location.lat.toFixed(6)} · Lng: {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <Button onClick={detectLocation} variant="ghost" size="sm" className="w-fit text-xs text-muted-foreground">
              Actualizar ubicación
            </Button>
          </div>
        )}

        {location.status === "error" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-amber-700 text-sm dark:text-amber-400">
            {location.message}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="motor-address" className="text-xs text-muted-foreground">
            O ingresa tu dirección manualmente
          </Label>
          <Input
            id="motor-address"
            placeholder="Ej: Av. Providencia 1234, Santiago"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
