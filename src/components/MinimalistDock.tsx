import { useState } from 'react';
import {
  Copy,
  CheckCheck,
  Store,
  Image as ImageIcon,
  Box,
  Loader2,
  X,
  Globe,
} from 'lucide-react';
import { THEME_LIST, type VoxelTheme, VOXEL_THEMES } from '../lib/themes';
import {
  type ParsedQris,
  type QRMatrixResult,
  type QRMode,
  type LinkConfig,
} from '../lib/qris';
import { generateScanCardPNG, exportSceneToGLB } from '../lib/exportUtils';
import confetti from 'canvas-confetti';
import { NeoButton, NeoInput, NeoCard } from './ui/neobrutalism';
import { MerchantSettingsModal } from './modals/MerchantSettingsModal';
import { LinkSettingsModal } from './modals/LinkSettingsModal';

interface MinimalistDockProps {
  qrMode: QRMode;
  setQrMode: (mode: QRMode) => void;
  merchantName: string;
  setMerchantName: (val: string) => void;
  merchantCity: string;
  setMerchantCity: (val: string) => void;
  amount: number;
  setAmount: (val: number) => void;
  invoiceId: string;
  setInvoiceId: (val: string) => void;
  linkConfig: LinkConfig;
  setLinkConfig: (cfg: LinkConfig | ((prev: LinkConfig) => LinkConfig)) => void;
  selectedThemeId: VoxelTheme['id'];
  setSelectedThemeId: (id: VoxelTheme['id']) => void;
  rawPayload: string;
  parsedQris: ParsedQris;
  matrix: QRMatrixResult;
  onResetToDefault: () => void;
  customStaticQris?: string | null;
  onClearCustomStaticQris?: () => void;
  onOpenScanner?: () => void;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (open: boolean) => void;
}

const THEME_LABELS: Record<string, string> = {
  'japanese-garden': 'PAGODA',
  'forest-cabin': 'FOREST',
  'modern-villa': 'VILLA',
  'cyberpunk': 'LIGHTHOUSE',
};

export function MinimalistDock({
  qrMode,
  merchantName,
  setMerchantName,
  merchantCity,
  setMerchantCity,
  amount,
  setAmount,
  invoiceId,
  setInvoiceId,
  linkConfig,
  setLinkConfig,
  selectedThemeId,
  setSelectedThemeId,
  rawPayload,
  parsedQris,
  matrix,
  onResetToDefault,
  customStaticQris,
  onClearCustomStaticQris,
  onOpenScanner,
  isSettingsOpen,
  setIsSettingsOpen,
}: MinimalistDockProps) {
  const [copied, setCopied] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingGLB, setIsExportingGLB] = useState(false);
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);

  const showSettingsModal = isSettingsOpen !== undefined ? isSettingsOpen : internalSettingsOpen;
  const setShowSettingsModal = setIsSettingsOpen || setInternalSettingsOpen;
  const activeTheme = VOXEL_THEMES[selectedThemeId] || VOXEL_THEMES['japanese-garden'];

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.9 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = async () => {
    setIsExportingPNG(true);
    try {
      await generateScanCardPNG({
        qrMode,
        linkConfig,
        merchantName: merchantName || '',
        merchantCity: merchantCity || '',
        amount,
        invoiceId,
        matrix,
        theme: activeTheme,
        parsedQris,
      });
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleExportGLB = async () => {
    setIsExportingGLB(true);
    try {
      await exportSceneToGLB(matrix, activeTheme, 1.0);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
    } catch (err) {
      console.error('GLB export failed:', err);
    } finally {
      setIsExportingGLB(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Neobrutalism Control Dock */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 max-w-5xl mx-auto z-40 font-mono select-none">
        <NeoCard className="p-2 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-2.5 bg-[#FFFDF5]">
          {/* Section 1: Mode-Specific Input */}
          {qrMode === 'qris' ? (
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <div className="flex-1 sm:w-36 sm:flex-initial">
                <NeoInput
                  prefixLabel="RP"
                  type="number"
                  min="0"
                  step="1000"
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  placeholder="0"
                />
              </div>

              {amount > 0 && (
                <NeoButton
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => setAmount(0)}
                  className="px-2 py-1 text-[11px] sm:text-xs shrink-0"
                  title="Clear Amount"
                >
                  <X className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  <span>CLR</span>
                </NeoButton>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <div className="flex-1 sm:w-72 sm:flex-initial">
                <NeoInput
                  prefixLabel="URL"
                  type="url"
                  value={linkConfig.url}
                  onChange={(e) =>
                    setLinkConfig((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>

              {linkConfig.url.length > 0 && (
                <NeoButton
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    setLinkConfig((prev) => ({ ...prev, url: '' }))
                  }
                  className="px-2 py-1 text-[11px] sm:text-xs shrink-0"
                  title="Clear URL"
                >
                  <X className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  <span>CLR</span>
                </NeoButton>
              )}
            </div>
          )}
          {/* Section 2: Theme Buttons (Smooth Mobile Scroll, Visible on Desktop) */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-center overflow-x-auto sm:overflow-visible max-w-full px-1 py-1 no-scrollbar">
            {THEME_LIST.map((th) => {
              const isSelected = th.id === selectedThemeId;
              const label = THEME_LABELS[th.id] || th.name.toUpperCase();
              return (
                <NeoButton
                  key={th.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'primary' : 'neutral'}
                  onClick={() => setSelectedThemeId(th.id)}
                  className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-black whitespace-nowrap shrink-0"
                >
                  <span>{label}</span>
                </NeoButton>
              );
            })}
          </div>

          {/* Section 3: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 w-full md:w-auto justify-between sm:justify-end">
            {qrMode === 'qris' ? (
              <NeoButton
                type="button"
                size="sm"
                variant="neutral"
                onClick={() => setShowSettingsModal(true)}
                title="Configure Merchant Details"
                className="flex-1 sm:flex-initial px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs"
              >
                <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1 stroke-[2.2]" />
                <span>MERCHANT</span>
              </NeoButton>
            ) : (
              <NeoButton
                type="button"
                size="sm"
                variant="neutral"
                onClick={() => setShowSettingsModal(true)}
                title="Configure Link & Templates"
                className="flex-1 sm:flex-initial px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1 stroke-[2.2]" />
                <span>LINK CFG</span>
              </NeoButton>
            )}

            <NeoButton
              type="button"
              size="sm"
              variant="accent"
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              title="Download Printable PNG Card"
              className="flex-1 sm:flex-initial px-2 sm:px-3 py-1 text-[11px] sm:text-xs"
            >
              {isExportingPNG ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin mr-0.5 sm:mr-1 stroke-[2.2]" />
              ) : (
                <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1 stroke-[2.2]" />
              )}
              <span>PNG</span>
            </NeoButton>

            <NeoButton
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleExportGLB}
              disabled={isExportingGLB}
              title="Export 3D Model (.GLB)"
              className="flex-1 sm:flex-initial px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs"
            >
              {isExportingGLB ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin mr-0.5 sm:mr-1 stroke-[2.2]" />
              ) : (
                <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1 stroke-[2.2]" />
              )}
              <span>GLB</span>
            </NeoButton>

            <NeoButton
              type="button"
              size="sm"
              variant="neutral"
              onClick={handleCopy}
              title="Copy EMVCo Payload"
              className="px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs shrink-0"
            >
              {copied ? (
                <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
              )}
            </NeoButton>
          </div>
        </NeoCard>
      </div>

      {/* Modular Settings Modals (Conditional mounting) */}
      {showSettingsModal &&
        (qrMode === 'qris' ? (
          <MerchantSettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            merchantName={merchantName}
            setMerchantName={setMerchantName}
            merchantCity={merchantCity}
            setMerchantCity={setMerchantCity}
            invoiceId={invoiceId}
            setInvoiceId={setInvoiceId}
            customStaticQris={customStaticQris}
            parsedQris={parsedQris}
            onClearCustomStaticQris={onClearCustomStaticQris}
            onOpenScanner={onOpenScanner}
            onResetToDefault={onResetToDefault}
          />
        ) : (
          <LinkSettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            linkConfig={linkConfig}
            setLinkConfig={setLinkConfig}
          />
        ))}
    </>
  );
}
