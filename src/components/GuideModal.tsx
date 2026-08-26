import { useState } from 'react';
import {
  BookOpen,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Globe,
} from 'lucide-react';
import { NeoButton, NeoCard, NeoBadge } from './ui/neobrutalism';
import type { QRMode } from '../lib/qris';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMerchant?: () => void;
  currentMode?: QRMode;
}

export function GuideModal({ isOpen, onClose, onOpenMerchant, currentMode = 'qris' }: GuideModalProps) {
  const [activeTab, setActiveTab] = useState<QRMode>(currentMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono select-none">
      <NeoCard className="max-w-xl w-full p-5 space-y-4 bg-[#FFFDF5] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-black stroke-[2.5]" />
            <div>
              <h3 className="text-sm font-black uppercase text-black">Panduan dan Cara Penggunaan</h3>
              <p className="text-[10px] text-slate-600 font-bold">
                Generator QRIS Dinamis dan Link QR 3D
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

        {/* Tab Switcher: QRIS vs LINK */}
        <div className="grid grid-cols-2 gap-2 border-2 border-black p-1 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            className={`py-2 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'qris'
                ? 'bg-[#FFDE59] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'border-transparent text-slate-600 hover:bg-amber-50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Mode QRIS Pembayaran</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`py-2 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-[#38BDF8] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'border-transparent text-slate-600 hover:bg-sky-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Mode Link ke QR</span>
          </button>
        </div>

        {/* Modal Body: Step-by-Step Guide */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
          {activeTab === 'qris' ? (
            <>
              {/* Step 1 QRIS */}
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
                  Buka menu <strong>MERCHANT</strong> di dock bawah, lalu pilih <strong>SCAN / UPLOAD QRIS ASLI</strong>. Anda dapat meng-upload screenshot QRIS dari <strong>DANA Bisnis</strong>, <strong>ShopeePay (Shopee Partner)</strong>, <strong>BCA Merchant</strong>, atau bank resmi mana pun.
                </p>
                <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 border border-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sistem otomatis membaca NMID dan mengunci rekening penampung asli toko Anda.</span>
                </div>
              </div>

              {/* Step 2 QRIS */}
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
                  Masukkan nominal harga tagihan di kolom <strong>RP</strong> pada dock bawah (misal <code>Rp 25.000</code>). Nominal akan otomatis disuntikkan ke dalam QRIS (Tag 54) menjadi <strong>QRIS Dinamis</strong>.
                </p>
              </div>

              {/* Step 3 QRIS */}
              <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#90E0EF] border-2 border-black flex items-center justify-center font-black text-[11px]">
                      3
                    </span>
                    <span className="font-black uppercase text-black">
                      Scan Layar atau Unduh Standee Cetak
                    </span>
                  </div>
                  <NeoBadge variant="blue" className="text-[10px]">
                    Langkah 3
                  </NeoBadge>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Pembeli tinggal memindai layar kasir Anda menggunakan aplikasi m-banking atau e-wallet apa pun. Anda juga dapat menekan tombol <strong>PNG</strong> untuk mengunduh standee cetak akrilik siap cetak beresolusi tinggi.
                </p>
              </div>

              {/* Security & Privacy Notice */}
              <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
                  <span className="text-xs font-black text-black uppercase">
                    100% Aman dan Berjalan di Client
                  </span>
                </div>
                <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                  Aplikasi ini berjalan murni di peramban (browser) Anda. Data QRIS tidak pernah dikirim ke server luar. Seluruh pembayaran langsung masuk ke saldo rekening merchant resmi Anda.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Step 1 LINK */}
              <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#38BDF8] border-2 border-black flex items-center justify-center font-black text-[11px]">
                      1
                    </span>
                    <span className="font-black uppercase text-black">
                      Pilih Mode LINK dan Masukkan URL
                    </span>
                  </div>
                  <NeoBadge variant="blue" className="text-[10px]">
                    Langkah 1
                  </NeoBadge>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Aktifkan tombol <strong>LINK</strong> di header atas, lalu ketik alamat tautan website atau media sosial pada kolom <strong>URL</strong> di dock bawah (misal: <code>https://tokoanda.com</code> atau <code>https://instagram.com/akun</code>).
                </p>
              </div>

              {/* Step 2 LINK */}
              <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#FFDE59] border-2 border-black flex items-center justify-center font-black text-[11px]">
                      2
                    </span>
                    <span className="font-black uppercase text-black">
                      Atur Judul Kartu (Menu LINK CFG)
                    </span>
                  </div>
                  <NeoBadge variant="yellow" className="text-[10px]">
                    Langkah 2
                  </NeoBadge>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Klik tombol <strong>LINK CFG</strong> untuk mengatur judul banner dan teks deskripsi kartu (contoh: <code>KATALOG RESMI TOKO</code>).
                </p>
              </div>

              {/* Step 3 LINK */}
              <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#A3E635] border-2 border-black flex items-center justify-center font-black text-[11px]">
                      3
                    </span>
                    <span className="font-black uppercase text-black">
                      Download Kartu atau Tampilkan 3D
                    </span>
                  </div>
                  <NeoBadge variant="green" className="text-[10px]">
                    Langkah 3
                  </NeoBadge>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  QR Code 3D akan otomatis mengarahkan pengunjung ke website tujuan ketika dipindai dengan kamera smartphone biasa atau Google Lens. Anda juga dapat mengunduh kartu cetak <strong>PNG</strong> atau model 3D <strong>GLB</strong>.
                </p>
              </div>
            </>
          )}
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
              <span>{activeTab === 'qris' ? 'BUKA MENU MERCHANT' : 'BUKA LINK CONFIG'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </NeoButton>
          )}
        </div>
      </NeoCard>
    </div>
  );
}
