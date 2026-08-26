import { QrCode, Sparkles, Link2, CreditCard, Globe, Orbit, Camera } from 'lucide-react';
import { NeoBadge, NeoButton } from './ui/neobrutalism';
import type { QRMode, LinkConfig } from '../lib/qris';
import type { CameraViewMode } from './VoxelScene';

interface HeaderProps {
  qrMode: QRMode;
  setQrMode: (mode: QRMode) => void;
  merchantName: string;
  merchantCity: string;
  amount: number;
  linkConfig: LinkConfig;
  cameraMode: CameraViewMode;
  onToggleCameraMode: (mode: CameraViewMode) => void;
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
}: HeaderProps) {
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

      {/* Right: Camera Mode Toggles */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
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
