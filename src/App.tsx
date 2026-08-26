import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MinimalistDock } from './components/MinimalistDock';
import { VoxelCanvas, type CameraPreset } from './components/VoxelCanvas';
import {
  generateSampleQris,
  convertStaticToDynamic,
  generateQRMatrix,
  parseQris,
  type QRMode,
  type LinkConfig,
  type ParsedQris,
  DEFAULT_LINK_CONFIG,
} from './lib/qris';
import { QRScannerModal } from './components/QRScannerModal';
import { GuideModal } from './components/GuideModal';
import { VOXEL_THEMES, type VoxelTheme } from './lib/themes';
export default function App() {
  // Mode State (QRIS Payment vs Link to QR)
  const [qrMode, setQrMode] = useState<QRMode>('qris');

  // Link to QR State
  const [linkConfig, setLinkConfig] = useState<LinkConfig>(DEFAULT_LINK_CONFIG);

  // Merchant State
  const [merchantName, setMerchantName] = useState('');
  const [merchantCity, setMerchantCity] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [invoiceId, setInvoiceId] = useState('');

  // Custom Imported Static QRIS (e.g. from DANA, ShopeePay, BCA)
  const [customStaticQris, setCustomStaticQris] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMerchantSettingsOpen, setIsMerchantSettingsOpen] = useState(false);
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
    if (customStaticQris) {
      return convertStaticToDynamic(customStaticQris, {
        amount: amount > 0 ? amount : undefined,
        invoiceId: invoiceId.trim() || undefined,
      }).dynamicQris;
    }
    return generateSampleQris({
      merchantName: merchantName.trim(),
      merchantCity: merchantCity.trim(),
      amount: amount > 0 ? amount : undefined,
      invoiceId: invoiceId.trim() || undefined,
    });
  }, [qrMode, linkConfig.url, customStaticQris, merchantName, merchantCity, amount, invoiceId]);


  // Parse & Validate Payload
  const parsedQris = useMemo(() => {
    return parseQris(rawPayload);
  }, [rawPayload]);

  // Generate 2D QR Code Matrix
  const matrix = useMemo(() => {
    return generateQRMatrix(rawPayload, 'H');
  }, [rawPayload]);


  const handleImportStaticQris = (rawString: string, parsed: ParsedQris) => {
    setCustomStaticQris(rawString);
    setQrMode('qris');
    if (parsed.merchantName) setMerchantName(parsed.merchantName);
    if (parsed.merchantCity) setMerchantCity(parsed.merchantCity);
    if (parsed.invoiceId) setInvoiceId(parsed.invoiceId);
  };

  const handleResetToDefault = () => {
    setQrMode('qris');
    setCustomStaticQris(null);
    setLinkConfig(DEFAULT_LINK_CONFIG);
    setMerchantName('');
    setMerchantCity('');
    setAmount(0);
    setInvoiceId('');
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
        customStaticQris={customStaticQris}
        parsedQris={parsedQris}
        onOpenGuide={() => setIsGuideOpen(true)}
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
        customStaticQris={customStaticQris}
        onClearCustomStaticQris={() => setCustomStaticQris(null)}
        onOpenScanner={() => setIsScannerOpen(true)}
        isSettingsOpen={isMerchantSettingsOpen}
        setIsSettingsOpen={setIsMerchantSettingsOpen}
      />

      {/* Interactive Guide & How-to-Use Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenMerchant={() => setIsMerchantSettingsOpen(true)}
        currentMode={qrMode}
      />

      {/* Client-Side QRIS Scanner / Uploader Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onImportStaticQris={handleImportStaticQris}
      />
    </div>
  );
}
