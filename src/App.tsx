import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MinimalistDock } from './components/MinimalistDock';
import { VoxelCanvas, type CameraPreset } from './components/VoxelCanvas';
import {
  generateSampleQris,
  generateQRMatrix,
  parseQris,
  type QRMode,
  type LinkConfig,
  DEFAULT_LINK_CONFIG,
} from './lib/qris';
import { VOXEL_THEMES, type VoxelTheme } from './lib/themes';

export default function App() {
  // Mode State (QRIS Payment vs Link to QR)
  const [qrMode, setQrMode] = useState<QRMode>('qris');

  // Link to QR State
  const [linkConfig, setLinkConfig] = useState<LinkConfig>(DEFAULT_LINK_CONFIG);

  // Merchant State
  const [merchantName, setMerchantName] = useState('WARUNG KOPI SENJA');
  const [merchantCity, setMerchantCity] = useState('JAKARTA');
  const [amount, setAmount] = useState<number>(75000);
  const [invoiceId, setInvoiceId] = useState('INV-2026-001');

  // 3D Voxel Scene State
  const [selectedThemeId, setSelectedThemeId] = useState<VoxelTheme['id']>('japanese-garden');
  const [cameraMode, setCameraMode] = useState<CameraPreset>('orbit');

  // Active Theme
  const currentTheme = VOXEL_THEMES[selectedThemeId] || VOXEL_THEMES['japanese-garden'];

  // Pure Client-Side Dynamic Payload Generation (QRIS vs Link)
  const rawPayload = useMemo(() => {
    if (qrMode === 'link') {
      return linkConfig.url.trim() || 'https://github.com';
    }
    return generateSampleQris({
      merchantName: merchantName.trim(),
      merchantCity: merchantCity.trim(),
      amount: amount > 0 ? amount : undefined,
      invoiceId: invoiceId.trim() || undefined,
    });
  }, [qrMode, linkConfig.url, merchantName, merchantCity, amount, invoiceId]);


  // Parse & Validate Payload
  const parsedQris = useMemo(() => {
    return parseQris(rawPayload);
  }, [rawPayload]);

  // Generate 2D QR Code Matrix
  const matrix = useMemo(() => {
    return generateQRMatrix(rawPayload, 'H');
  }, [rawPayload]);


  const handleResetToDefault = () => {
    setQrMode('qris');
    setLinkConfig(DEFAULT_LINK_CONFIG);
    setMerchantName('WARUNG KOPI SENJA');
    setMerchantCity('JAKARTA');
    setAmount(75000);
    setInvoiceId('INV-2026-001');
    setSelectedThemeId('japanese-garden');
    setCameraMode('orbit');
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-slate-900 font-mono select-none">
      {/* Floating Top Minimalist Pixel Header */}
      <Header
        qrMode={qrMode}
        setQrMode={setQrMode}
        merchantName={merchantName}
        merchantCity={merchantCity}
        amount={amount}
        linkConfig={linkConfig}
        cameraMode={cameraMode}
        onToggleCameraMode={setCameraMode}
      />

      {/* Hero 3D Voxel QRIS Canvas - 100% Full Viewport */}
      <main className="w-full h-full">
        <VoxelCanvas
          matrix={matrix}
          theme={currentTheme}
          cameraMode={cameraMode}
        />
      </main>

      {/* Floating Bottom Minimalist Pixel Control Dock */}
      <MinimalistDock
        qrMode={qrMode}
        setQrMode={setQrMode}
        merchantName={merchantName}
        setMerchantName={setMerchantName}
        merchantCity={merchantCity}
        setMerchantCity={setMerchantCity}
        amount={amount}
        setAmount={setAmount}
        invoiceId={invoiceId}
        setInvoiceId={setInvoiceId}
        linkConfig={linkConfig}
        setLinkConfig={setLinkConfig}
        selectedThemeId={selectedThemeId}
        setSelectedThemeId={setSelectedThemeId}
        rawPayload={rawPayload}
        parsedQris={parsedQris}
        matrix={matrix}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
