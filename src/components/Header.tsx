import { QrCode, Sparkles, Link2, CreditCard, Globe, Orbit, Camera, BookOpen, ShieldCheck } from 'lucide-react';
import { NeoBadge, NeoButton } from './ui/neobrutalism';
import type { QRMode, LinkConfig, ParsedQris } from '../lib/qris';
import type { CameraViewMode } from './VoxelScene';
import { detectAcquirerInfo } from '../lib/qrScanner';

interface HeaderProps {
  qrMode: QRMode;
  setQrMode: (mode: QRMode) => void;
  merchantName: string;
  merchantCity: string;
  amount: number;
  linkConfig: LinkConfig;
  cameraMode: CameraViewMode;
  onToggleCameraMode: (mode: CameraViewMode) => void;
  customStaticQris?: string | null;
  parsedQris?: ParsedQris;
  onOpenGuide?: () => void;
}

export function Header({
  qrMode,
  setQrMode,
  merchantName,
  merchantCity,
  amount,
  linkConfig,
  cameraMode,
  onToggleCameraMode,
  customStaticQris,
  parsedQris,
  onOpenGuide,
}: HeaderProps) {
  const acquirerInfo = parsedQris ? detectAcquirerInfo(parsedQris) : null;
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };
  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0] || 'LINK';
    }
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-40 flex flex-wrap items-center justify-between gap-2 pointer-events-none font-mono">
      {/* Left: Brand + Mode Switcher + Status Badges */}
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
        <NeoBadge variant="yellow" className="text-xs sm:text-sm">
          <QrCode className="w-4 h-4" />
          <span>QRISCAPE 3D</span>
        </NeoBadge>

        {/* Consistent Neobrutalism Mode Switcher */}
        <div className="flex items-center gap-1">
          <NeoButton
            type="button"
            size="sm"
            variant={qrMode === 'qris' ? 'primary' : 'neutral'}
            onClick={() => setQrMode('qris')}
            className="px-2.5 py-1 text-xs font-black"
          >
            <CreditCard className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
            <span>QRIS</span>
          </NeoButton>
          <NeoButton
            type="button"
            size="sm"
            variant={qrMode === 'link' ? 'primary' : 'neutral'}
            onClick={() => setQrMode('link')}
            className="px-2.5 py-1 text-xs font-black"
          >
            <Link2 className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
            <span>LINK</span>
          </NeoButton>
        </div>

        {/* Dynamic Status Badges */}
        {qrMode === 'qris' ? (
          <>
            {merchantName && (
              <NeoBadge variant="white" className="hidden md:inline-flex text-xs">
                <span>{merchantName}</span>
                {merchantCity && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{merchantCity}</span>
                  </>
                )}
              </NeoBadge>
            )}
            {customStaticQris && acquirerInfo && (
              <NeoBadge variant="green" className="hidden lg:inline-flex text-xs font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
                <span>{acquirerInfo.acquirerName}</span>
                {acquirerInfo.nmid && (
                  <span className="text-[10px] opacity-80">({acquirerInfo.nmid})</span>
                )}
              </NeoBadge>
            )}
            {amount > 0 && (
              <NeoBadge variant="green" className="hidden sm:inline-flex text-xs animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{formatIDR(amount)}</span>
              </NeoBadge>
            )}
          </>
        ) : (
          <>
            {linkConfig.title && (
              <NeoBadge variant="blue" className="hidden md:inline-flex text-xs font-bold uppercase">
                <span>{linkConfig.title}</span>
              </NeoBadge>
            )}
            <NeoBadge variant="green" className="hidden sm:inline-flex text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>{getDomain(linkConfig.url)}</span>
            </NeoBadge>
          </>
        )}
      </div>

      {/* Right: Camera Mode Toggles & Scanner Trigger */}
      {/* Right: Guide Button & Camera Mode Toggles */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {onOpenGuide && (
          <NeoButton
            variant="accent"
            size="sm"
            onClick={onOpenGuide}
            title="Panduan & Cara Penggunaan"
            className="px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#FFDE59] text-black"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
            <span>CARA PAKAI</span>
          </NeoButton>
        )}

        <NeoButton
          variant={cameraMode === 'orbit' ? 'primary' : 'neutral'}
          size="sm"
          onClick={() => onToggleCameraMode('orbit')}
          title="3D Free Orbit View"
          className="px-2.5 py-1 text-xs"
        >
          <Orbit className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
          <span>3D ORBIT</span>
        </NeoButton>

        <NeoButton
          variant={cameraMode === 'scan' ? 'accent' : 'neutral'}
          size="sm"
          onClick={() => onToggleCameraMode('scan')}
          title="Perpendicular Top-Down Scan View"
          className="px-2.5 py-1 text-xs"
        >
          <Camera className="w-3.5 h-3.5 mr-1 stroke-[2.5]" />
          <span>SNAP TO SCAN</span>
        </NeoButton>
      </div>
    </header>
  );
}
