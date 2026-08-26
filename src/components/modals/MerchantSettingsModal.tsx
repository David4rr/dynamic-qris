import {
  Store,
  X,
  RotateCcw,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import { NeoButton, NeoInput, NeoCard } from '../ui/neobrutalism';
import type { ParsedQris } from '../../lib/qris';
import { detectAcquirerInfo } from '../../lib/qrScanner';

interface MerchantSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantName: string;
  setMerchantName: (val: string) => void;
  merchantCity: string;
  setMerchantCity: (val: string) => void;
  invoiceId: string;
  setInvoiceId: (val: string) => void;
  customStaticQris?: string | null;
  parsedQris?: ParsedQris;
  onClearCustomStaticQris?: () => void;
  onOpenScanner?: () => void;
  onResetToDefault: () => void;
}

export function MerchantSettingsModal({
  isOpen,
  onClose,
  merchantName,
  setMerchantName,
  merchantCity,
  setMerchantCity,
  invoiceId,
  setInvoiceId,
  customStaticQris,
  parsedQris,
  onClearCustomStaticQris,
  onOpenScanner,
  onResetToDefault,
}: MerchantSettingsModalProps) {
  if (!isOpen) return null;

  const acquirerInfo = parsedQris ? detectAcquirerInfo(parsedQris) : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-mono select-none">
      <NeoCard className="max-w-md w-full p-5 space-y-4 bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-black stroke-[2.5]" />
            <h3 className="text-sm font-black uppercase text-black">Merchant Configuration</h3>
          </div>
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </NeoButton>
        </div>

        {/* Active Custom QRIS Status Banner */}
        {customStaticQris && acquirerInfo && (
          <div className="p-2.5 border-2 border-emerald-600 bg-emerald-50 text-xs space-y-1 shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-950 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                {acquirerInfo.acquirerName} Aktif
              </span>
              {onClearCustomStaticQris && (
                <button
                  type="button"
                  onClick={onClearCustomStaticQris}
                  className="text-[10px] text-rose-700 underline font-bold hover:text-rose-900 cursor-pointer"
                >
                  Reset ke Sample
                </button>
              )}
            </div>
            {acquirerInfo.nmid && (
              <p className="text-[10px] text-emerald-900 font-bold">
                NMID: {acquirerInfo.nmid}
              </p>
            )}
            <p className="text-[10px] text-emerald-800">
              Uang akan langsung masuk ke rekening merchant penampung saat di-scan.
            </p>
          </div>
        )}

        {/* Scanner Trigger Button */}
        {onOpenScanner && (
          <div className="pt-1">
            <NeoButton
              type="button"
              variant={customStaticQris ? 'accent' : 'primary'}
              size="sm"
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              className="w-full justify-center text-xs font-black py-2"
            >
              <UploadCloud className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              <span>{customStaticQris ? 'GANTI / SCAN QRIS ASLI LAIN' : 'SCAN / UPLOAD QRIS ASLI ANDA'}</span>
            </NeoButton>
          </div>
        )}

        {/* Inputs */}
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

        {/* Modal Footer */}
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
              onClick={onClose}
            >
              SAVE & CLOSE
            </NeoButton>
          </div>
        </div>
      </NeoCard>
    </div>
  );
}
