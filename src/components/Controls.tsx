import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  MapPin,
  FileText,
  Palette,
  RotateCcw,
  Check,
  Copy,
  Plus,
  Coins,
  Receipt,
  Flower2,
  TreePine,
  Building2,
  Cpu,
  Download,
  Image as ImageIcon,
  Box as BoxIcon,
  Loader2,
} from 'lucide-react';
import { THEME_LIST, type VoxelTheme, VOXEL_THEMES } from '../lib/themes';
import type { ParsedQris, QRMatrixResult } from '../lib/qris';
import { generateScanCardPNG, exportSceneToGLB } from '../lib/exportUtils';
import confetti from 'canvas-confetti';

interface ControlsProps {
  merchantName: string;
  setMerchantName: (val: string) => void;
  merchantCity: string;
  setMerchantCity: (val: string) => void;
  amount: number;
  setAmount: (val: number) => void;
  invoiceId: string;
  setInvoiceId: (val: string) => void;
  selectedThemeId: VoxelTheme['id'];
  setSelectedThemeId: (id: VoxelTheme['id']) => void;
  rawPayload: string;
  parsedQris: ParsedQris;
  matrix: QRMatrixResult;
  onResetToDefault: () => void;
}


const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

const themeIconMap = {
  Flower2: Flower2,
  TreePine: TreePine,
  Building2: Building2,
  Cpu: Cpu,
};

export function Controls({
  merchantName,
  setMerchantName,
  merchantCity,
  setMerchantCity,
  amount,
  setAmount,
  invoiceId,
  setInvoiceId,
  selectedThemeId,
  setSelectedThemeId,
  rawPayload,
  parsedQris,
  matrix,
  onResetToDefault,
}: ControlsProps) {
  const [copied, setCopied] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [isExportingGLB, setIsExportingGLB] = useState(false);


  const activeTheme = VOXEL_THEMES[selectedThemeId] || VOXEL_THEMES['japanese-garden'];

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPayload);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#0f172a', '#475569', '#10b981'],
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPreset = (addVal: number) => {
    setAmount(amount + addVal);
  };

  const handleDownloadPNG = async () => {
    setIsExportingPNG(true);
    try {
      await generateScanCardPNG({
        merchantName: merchantName || 'WARUNG KOPI SENJA',
        merchantCity: merchantCity || 'JAKARTA',
        amount,
        invoiceId,
        matrix,
        theme: activeTheme,
        parsedQris,
      });
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleExportGLB = async () => {
    setIsExportingGLB(true);
    try {
      await exportSceneToGLB(matrix, activeTheme, 1.0);
      confetti({

        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to export GLB:', err);
    } finally {
      setIsExportingGLB(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 text-slate-800 font-mono text-xs">
      {/* 1. Merchant Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Merchant Profile</h3>
              <p className="text-[10px] text-slate-500">ASPI / EMVCo Specification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
            title="Reset form"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
              Merchant Name
            </label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="WARUNG KOPI SENJA"
              maxLength={25}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 uppercase transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> City
            </label>
            <input
              type="text"
              value={merchantCity}
              onChange={(e) => setMerchantCity(e.target.value)}
              placeholder="JAKARTA"
              maxLength={15}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 uppercase transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Dynamic Transaction Amount */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Dynamic Amount (Tag 54)</h3>
              <p className="text-[10px] text-slate-500">Real-time instant QRIS calculation</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono">
            {formatIDR(amount)}
          </span>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              Rp
            </span>
            <input
              type="number"
              min="0"
              max="10000000"
              step="1000"
              value={amount === 0 ? '' : amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value || '0', 10)))}
              placeholder="0"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-all font-mono"
            />
          </div>
        </div>

        {/* Quick Add Presets */}
        <div>
          <p className="text-[10px] font-bold text-slate-600 mb-1.5 uppercase">Quick Add Nominal:</p>
          <div className="grid grid-cols-3 gap-1.5">
            {PRESET_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAddPreset(val)}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3 text-slate-400" />
                <span>{val >= 1000 ? `${val / 1000}k` : val}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Invoice ID / Reference (Tag 62) */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
            <Receipt className="w-3 h-3 text-slate-400" /> Invoice Reference (Tag 62)
          </label>
          <input
            type="text"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            placeholder="INV-2026-001"
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-900 transition-all uppercase"
          />
        </div>
      </motion.div>

      {/* 3. 3D Voxel Themes & Quality */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-3"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">3D Architectural Theme</h3>
            <p className="text-[10px] text-slate-500">Procedural 3D Pagoda & Landmark styles</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {THEME_LIST.map((theme) => {
            const isSelected = theme.id === selectedThemeId;
            const ThemeIcon = themeIconMap[theme.iconName] || Flower2;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedThemeId(theme.id)}
                className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-slate-100 border-slate-900 ring-1 ring-slate-900'
                    : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <ThemeIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                  )}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase">{theme.name}</h4>
                  <div className="flex gap-1 mt-1">
                    <span
                      className="w-3 h-3 rounded-xs border border-slate-300"
                      style={{ backgroundColor: theme.darkPalette.roof }}
                    />
                    <span
                      className="w-3 h-3 rounded-xs border border-slate-300"
                      style={{ backgroundColor: theme.darkPalette.foliage }}
                    />
                    <span
                      className="w-3 h-3 rounded-xs border border-slate-300"
                      style={{ backgroundColor: theme.lightPalette.ground }}
                    />
                    <span
                      className="w-3 h-3 rounded-xs border border-slate-300"
                      style={{ backgroundColor: theme.lightPalette.water }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Theme Preview Colors */}
        <div className="pt-2 border-t border-slate-200">
          <p className="text-[10px] text-slate-500">Selected: {activeTheme.name} Architectural Diorama</p>
        </div>
      </motion.div>


      {/* 4. Export Suite & Payload Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-4 rounded-xl bg-white border border-slate-300 shadow-2xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Export & Share Suite</h3>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold border border-slate-300">
            CRC: {parsedQris.rawTags['63'] || 'VALID'}
          </span>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={isExportingPNG}
            className="py-2 px-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-98 uppercase"
          >
            {isExportingPNG ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            <span>Download PNG Card</span>
          </button>

          <button
            type="button"
            onClick={handleExportGLB}
            disabled={isExportingGLB}
            className="py-2 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-98 uppercase"
          >
            {isExportingGLB ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
            ) : (
              <BoxIcon className="w-3.5 h-3.5" />
            )}
            <span>Export 3D Model (.GLB)</span>
          </button>
        </div>

        {/* EMVCo Raw Payload */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" /> EMVCo Payload
            </span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-300 font-mono text-[10px] text-slate-700 break-all max-h-16 overflow-y-auto select-all leading-relaxed">
            {rawPayload}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-1.5 px-2.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 uppercase"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy Payload String</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
