import { useState } from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Link2,
} from 'lucide-react';
import { NeoButton, NeoCard } from '../ui/neobrutalism';
import type { QRMode } from '../../lib/qris';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMerchant?: () => void;
  currentMode?: QRMode;
}

export function GuideModal({
  isOpen,
  onClose,
  onOpenMerchant,
  currentMode = 'qris',
}: GuideModalProps) {
  const [activeTab, setActiveTab] = useState<QRMode>(currentMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4 font-mono select-none">
      <NeoCard className="max-w-lg w-full p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 bg-[#FFFDF5] max-h-[90dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FFDE59] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
              <BookOpen className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase text-black leading-tight">
                PANDUAN APLIKASI
              </h3>
              <p className="text-[10px] text-slate-600 font-bold hidden sm:block">
                Petunjuk Cepat Penggunaan QRIS Dinamis & Link 3D
              </p>
            </div>
          </div>
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={onClose}
            className="p-1 sm:p-1.5"
            title="Tutup Panduan"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </NeoButton>
        </div>

        {/* Mode Switcher Tabs (Ultra-Compact for Mobile) */}
        <div className="grid grid-cols-2 gap-1.5 border-2 border-black p-1 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            className={`py-1.5 px-2 text-[11px] sm:text-xs font-black uppercase flex items-center justify-center gap-1 border-2 transition-all cursor-pointer ${
              activeTab === 'qris'
                ? 'bg-[#FFDE59] text-black border-black shadow-[2px_2px_0px_0px_#000]'
                : 'border-transparent text-slate-600 hover:bg-amber-50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>QRIS DINAMIS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`py-1.5 px-2 text-[11px] sm:text-xs font-black uppercase flex items-center justify-center gap-1 border-2 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-[#38BDF8] text-black border-black shadow-[2px_2px_0px_0px_#000]'
                : 'border-transparent text-slate-600 hover:bg-sky-50'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>LINK KE QR</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 text-xs">
          {activeTab === 'qris' ? (
            <>
              {/* Step 1 */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FFDE59] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    1
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    IMPORT QRIS TOKO ANDA
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Buka menu <strong>MERCHANT</strong> di dock bawah, lalu pilih <strong>SCAN / UPLOAD QRIS ASLI</strong>. Upload screenshot QRIS dari DANA Bisnis, ShopeePay, BCA, atau bank Anda.
                </p>
                <div className="ml-7 mt-1 p-1.5 bg-emerald-50 border border-emerald-300 text-[9px] sm:text-[10px] text-emerald-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Sistem otomatis mengunci NMID & rekening toko Anda.</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FF90E8] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    2
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    KETIK NOMINAL TRANSAKSI
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Masukkan nominal harga tagihan pada kolom <strong>RP</strong> di dock bawah (misal: <code>25000</code>). Nominal otomatis disuntikkan menjadi <strong>QRIS Dinamis</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#90E0EF] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    3
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    SCAN ATAU DOWNLOAD STANDEE
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Pembeli dapat langsung scan layar Anda menggunakan m-banking atau e-wallet apa pun. Klik tombol <strong>PNG</strong> untuk unduh kartu cetak akrilik meja kasir.
                </p>
              </div>

              {/* Security Banner */}
              <div className="p-2 sm:p-2.5 border-2 border-black bg-amber-50 shadow-[2px_2px_0px_0px_#000] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black shrink-0 stroke-[2.5]" />
                <p className="text-[9px] sm:text-[10px] text-slate-800 font-bold leading-tight">
                  100% Client-Side. Saldo pembayaran langsung masuk ke rekening merchant resmi Anda.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Step 1 Link */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#38BDF8] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    1
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    PILIH MODE LINK & INPUT URL
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Aktifkan tombol <strong>LINK</strong> di header atas, lalu ketik alamat website atau media sosial pada kolom <strong>URL</strong> di dock bawah.
                </p>
              </div>

              {/* Step 2 Link */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#FFDE59] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    2
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    ATUR JUDUL KARTU (LINK CFG)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Klik menu <strong>LINK CFG</strong> untuk mengatur judul banner dan teks deskripsi kartu (contoh: <code>KATALOG RESMI TOKO</code>).
                </p>
              </div>

              {/* Step 3 Link */}
              <div className="p-2.5 sm:p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#A3E635] border-2 border-black flex items-center justify-center font-black text-[10px] shrink-0">
                    3
                  </span>
                  <span className="font-black uppercase text-black text-[11px] sm:text-xs">
                    BAGIKAN ATAU CETAK KARTU
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[10px] sm:text-[11px] pl-7">
                  Pengunjung yang memindai QR code akan langsung dialihkan ke website tujuan. Anda juga dapat mengunduh kartu <strong>PNG</strong> atau model 3D <strong>GLB</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t-2 border-black pt-2.5 shrink-0">
          <NeoButton
            type="button"
            variant="neutral"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto py-1.5 text-xs justify-center"
          >
            TUTUP
          </NeoButton>

          {onOpenMerchant && (
            <NeoButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onOpenMerchant();
              }}
              className="w-full sm:w-auto py-1.5 px-3 text-xs font-black justify-center flex items-center gap-1.5"
            >
              <span>{activeTab === 'qris' ? 'BUKA MENU MERCHANT' : 'BUKA LINK CONFIG'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </NeoButton>
          )}
        </div>
      </NeoCard>
    </div>
  );
}
