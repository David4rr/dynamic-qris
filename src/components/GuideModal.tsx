import {
  BookOpen,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { NeoButton, NeoCard, NeoBadge } from './ui/neobrutalism';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMerchant?: () => void;
}

export function GuideModal({ isOpen, onClose, onOpenMerchant }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono select-none">
      <NeoCard className="max-w-xl w-full p-5 space-y-4 bg-[#FFFDF5] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-black stroke-[2.5]" />
            <div>
              <h3 className="text-sm font-black uppercase text-black">Panduan & Cara Penggunaan</h3>
              <p className="text-[10px] text-slate-600 font-bold">
                Ubah QRIS Statis Toko Menjadi QRIS Dinamis Otomatis
              </p>
            </div>
          </div>
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={onClose}
            className="p-1.5"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </NeoButton>
        </div>

        {/* Modal Body: Step-by-Step Guide */}
        <div className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
          {/* Step 1 */}
          <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#FFDE59] border-2 border-black flex items-center justify-center font-black text-[11px]">
                  1
                </span>
                <span className="font-black uppercase text-black">
                  Import QRIS Toko Anda
                </span>
              </div>
              <NeoBadge variant="yellow" className="text-[10px]">
                Langkah 1
              </NeoBadge>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Buka menu <strong>MERCHANT</strong> di dock bawah, lalu pilih <strong>SCAN / UPLOAD QRIS ASLI</strong>. Anda bisa meng-upload screenshot QRIS dari <strong>DANA Bisnis</strong>, <strong>ShopeePay (Shopee Partner)</strong>, <strong>BCA Merchant</strong>, atau Bank mana pun.
            </p>
            <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 border border-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sistem otomatis mengunci NMID & rekening penampung asli toko Anda.</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#FF90E8] border-2 border-black flex items-center justify-center font-black text-[11px]">
                  2
                </span>
                <span className="font-black uppercase text-black">
                  Ketik Nominal Transaksi
                </span>
              </div>
              <NeoBadge variant="pink" className="text-[10px]">
                Langkah 2
              </NeoBadge>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Masukkan nominal harga pembayaran di kolom <strong>RP</strong> pada dock bawah (misal <code>Rp 25.000</code>). Nominal akan otomatis disuntikkan ke dalam QRIS (Tag 54) dan statusnya berubah menjadi <strong>QRIS Dinamis</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#90E0EF] border-2 border-black flex items-center justify-center font-black text-[11px]">
                  3
                </span>
                <span className="font-black uppercase text-black">
                  Tampilkan atau Download Standee
                </span>
              </div>
              <NeoBadge variant="blue" className="text-[10px]">
                Langkah 3
              </NeoBadge>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Pembeli tinggal scan layar Anda menggunakan aplikasi e-wallet / m-banking apa pun. Anda juga bisa klik tombol <strong>PNG</strong> untuk mengunduh kartu cetak resolusi tinggi siap print.
            </p>
          </div>

          {/* Security & Privacy Notice */}
          <div className="p-3 border-2 border-emerald-600 bg-emerald-50 shadow-[2px_2px_0px_0px_rgba(5,150,105,1)] space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              <span className="text-xs font-black text-emerald-950 uppercase">
                100% Aman & Client-Side
              </span>
            </div>
            <p className="text-[10px] text-emerald-900 leading-relaxed font-medium">
              Aplikasi ini berjalan murni di peramban (browser) Anda. Data QRIS dan rahasia toko tidak pernah dikirim ke server pihak ketiga. Seluruh pembayaran langsung masuk ke saldo rekening Anda.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t-2 border-black pt-3">
          <NeoButton
            type="button"
            variant="neutral"
            size="sm"
            onClick={onClose}
          >
            Tutup
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
              className="px-4 font-black flex items-center gap-1"
            >
              <span>BUKA MENU MERCHANT</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </NeoButton>
          )}
        </div>
      </NeoCard>
    </div>
  );
}
