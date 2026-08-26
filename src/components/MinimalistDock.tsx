import { useState } from 'react';
import {
  Copy,
  CheckCheck,
  RotateCcw,
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
  DEFAULT_LINK_CONFIG,
} from '../lib/qris';
import { generateScanCardPNG, exportSceneToGLB } from '../lib/exportUtils';
import confetti from 'canvas-confetti';
import { NeoButton, NeoInput, NeoCard } from './ui/neobrutalism';

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
}: MinimalistDockProps) {
  const [copied, setCopied] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingGLB, setIsExportingGLB] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
      <div className="absolute bottom-4 left-4 right-4 max-w-5xl mx-auto z-40 font-mono select-none">
        <NeoCard className="p-2.5 sm:p-3 flex flex-col md:flex-row items-center justify-between gap-2.5 bg-[#FFFDF5]">
          {/* Section 1: Mode-Specific Input */}
          {qrMode === 'qris' ? (
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <div className="w-32 sm:w-36">
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
                  className="px-2 py-1 text-xs"
                  title="Clear Amount"
                >
                  <X className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  <span>CLR</span>
                </NeoButton>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <div className="w-56 sm:w-72">
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
                  className="px-2 py-1 text-xs"
                  title="Clear URL"
                >
                  <X className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  <span>CLR</span>
                </NeoButton>
              )}
            </div>
          )}

          {/* Section 2: Consistent Single-Line Theme Buttons */}
          <div className="flex items-center gap-1.5 justify-center">
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
                  className="px-2.5 py-1 text-xs font-black whitespace-nowrap"
                >
                  <span>{label}</span>
                </NeoButton>
              );
            })}
          </div>

          {/* Section 3: Action Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
            {qrMode === 'qris' ? (
              <NeoButton
                type="button"
                size="sm"
                variant="neutral"
                onClick={() => setShowSettingsModal(true)}
                title="Configure Merchant Details"
                className="px-2.5 py-1 text-xs"
              >
                <Store className="w-3.5 h-3.5 mr-1 stroke-[2.2]" />
                <span className="hidden sm:inline">MERCHANT</span>
              </NeoButton>
            ) : (
              <NeoButton
                type="button"
                size="sm"
                variant="neutral"
                onClick={() => setShowSettingsModal(true)}
                title="Configure Link & Templates"
                className="px-2.5 py-1 text-xs"
              >
                <Globe className="w-3.5 h-3.5 mr-1 stroke-[2.2]" />
                <span className="hidden sm:inline">LINK CFG</span>
              </NeoButton>
            )}
            <NeoButton
              type="button"
              size="sm"
              variant="accent"
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              title="Download Printable PNG Card"
              className="px-3 py-1 text-xs"
            >
              {isExportingPNG ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 stroke-[2.2]" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 mr-1 stroke-[2.2]" />
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
              className="px-2.5 py-1 text-xs"
            >
              {isExportingGLB ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 stroke-[2.2]" />
              ) : (
                <Box className="w-3.5 h-3.5 mr-1 stroke-[2.2]" />
              )}
              <span>GLB</span>
            </NeoButton>

            <NeoButton
              type="button"
              size="sm"
              variant="neutral"
              onClick={handleCopy}
              title="Copy EMVCo Payload"
              className="px-2.5 py-1 text-xs"
            >
              {copied ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5 stroke-[2.2]" />
              )}
            </NeoButton>
          </div>
        </NeoCard>
      </div>

      {/* Neobrutalism Merchant Profile Modal */}
      {/* Neobrutalism Configuration Modal (QRIS vs LINK) */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-mono">
          {qrMode === 'qris' ? (
            <NeoCard className="max-w-md w-full p-5 space-y-4 bg-white">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-black stroke-[2.5]" />
                  <h3 className="text-sm font-black uppercase text-black">Merchant Configuration</h3>
                </div>
                <NeoButton
                  variant="neutral"
                  size="sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </NeoButton>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    Merchant Name (Tag 59)
                  </label>
                  <NeoInput
                    maxLength={25}
                    value={merchantName}
                    onChange={(e) => setMerchantName(e.target.value)}
                    placeholder="Enter merchant name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    City (Tag 60)
                  </label>
                  <NeoInput
                    maxLength={15}
                    value={merchantCity}
                    onChange={(e) => setMerchantCity(e.target.value)}
                    placeholder="Enter city (optional)"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    Invoice Ref (Tag 62)
                  </label>
                  <NeoInput
                    maxLength={15}
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder="INV-001 (optional)"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-black">
                <NeoButton
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setMerchantName('');
                    setMerchantCity('');
                    setInvoiceId('');
                  }}
                >
                  <X className="w-3 h-3 mr-1 stroke-[2.5]" /> CLEAR ALL
                </NeoButton>

                <div className="flex items-center gap-2">
                  <NeoButton
                    variant="neutral"
                    size="sm"
                    onClick={onResetToDefault}
                  >
                    <RotateCcw className="w-3 h-3 mr-1 stroke-[2.5]" /> RESET
                  </NeoButton>

                  <NeoButton
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    SAVE & CLOSE
                  </NeoButton>
                </div>
              </div>
            </NeoCard>
          ) : (
            <NeoCard className="max-w-lg w-full p-5 space-y-4 bg-white">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-black stroke-[2.5]" />
                  <h3 className="text-sm font-black uppercase text-black">Link & Social Configuration</h3>
                </div>
                <NeoButton
                  variant="neutral"
                  size="sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </NeoButton>
              </div>


              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    Destination URL (Payload)
                  </label>
                  <NeoInput
                    value={linkConfig.url}
                    onChange={(e) =>
                      setLinkConfig((prev) => ({ ...prev, url: e.target.value }))
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    Display Title (Banner)
                  </label>
                  <NeoInput
                    maxLength={35}
                    value={linkConfig.title}
                    onChange={(e) =>
                      setLinkConfig((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. OFFICIAL WEBSITE"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-1">
                    Subtitle / Description Note
                  </label>
                  <NeoInput
                    maxLength={60}
                    value={linkConfig.description}
                    onChange={(e) =>
                      setLinkConfig((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="e.g. Scan to view our creative portfolio"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-black">
                <NeoButton
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setLinkConfig({
                      url: '',
                      title: '',
                      description: '',
                    })
                  }
                >
                  <X className="w-3 h-3 mr-1 stroke-[2.5]" /> CLEAR ALL
                </NeoButton>

                <div className="flex items-center gap-2">
                  <NeoButton
                    variant="neutral"
                    size="sm"
                    onClick={() => setLinkConfig(DEFAULT_LINK_CONFIG)}
                  >
                    <RotateCcw className="w-3 h-3 mr-1 stroke-[2.5]" /> RESET
                  </NeoButton>

                  <NeoButton
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    SAVE & CLOSE
                  </NeoButton>
                </div>
              </div>
            </NeoCard>
          )}
        </div>
      )}
    </>
  );
}
