"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const EXPO_URL = "exp://uck7kx0-anonymous-8080.exp.direct";

export default function ExpoConnectPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(EXPO_URL, {
      width: 280,
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Gentle Care
          </h1>
          <p className="text-slate-500 font-medium">
            Conecte-se ao app mobile
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Escaneie com o Expo Go
            </h2>
            <p className="text-sm text-slate-500">
              Abra o aplicativo Expo Go no seu celular e escaneie o QR code abaixo
            </p>
          </div>

          <div className="flex justify-center mb-6">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code para Expo Go"
                className="w-64 h-64 rounded-2xl border-2 border-slate-100"
              />
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
                <span className="text-slate-400 text-sm">Gerando QR code...</span>
              </div>
            )}
          </div>

          <div className="bg-[#e8f5f1] rounded-2xl p-4 text-center">
            <p className="text-xs font-mono text-slate-600 break-all">
              {EXPO_URL}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3">
            Como conectar:
          </h3>
          <ol className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#2beeba] rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                1
              </span>
              <span>
                Instale o <strong>Expo Go</strong> no seu celular (disponível na App Store e Google Play)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#2beeba] rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                2
              </span>
              <span>
                Abra o Expo Go e toque em <strong>&quot;Scan QR code&quot;</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#2beeba] rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                3
              </span>
              <span>
                Aponte a câmera para o QR code acima e aguarde o app carregar
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
