import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  UploadCloud,
  Camera,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { NeoButton, NeoCard, NeoBadge } from '../ui/neobrutalism';
import { parseQris, type ParsedQris } from '../../lib/qris';
import {
  scanQRCodeFromImage,
  scanQRCodeFromVideo,
  detectAcquirerInfo,
  type ScanQRResult,
} from '../../lib/qrScanner';
import confetti from 'canvas-confetti';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStaticQris: (rawString: string, parsed: ParsedQris) => void;
}

type ScanTab = 'upload' | 'camera' | 'paste';

export function QRScannerModal({ isOpen, onClose, onImportStaticQris }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<ScanTab>('upload');
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<ScanQRResult | null>(null);
  const [pasteInput, setPasteInput] = useState('');

  // Camera references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Stop camera stream & cleanup animation loop
  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningImage(true);
    setErrorMessage(null);
    setScannedResult(null);

    try {
      const result = await scanQRCodeFromImage(file);
      if (!result.isQris) {
        setErrorMessage('QR Code terbaca, namun bukan format QRIS standar (EMVCo).');
      } else {
        setScannedResult(result);
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membaca gambar QR Code';
      setErrorMessage(msg);
    } finally {
      setIsScanningImage(false);
      // Reset file input value
      e.target.value = '';
    }
  };

  const handleStartCamera = async () => {
    setErrorMessage(null);
    setScannedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        requestScanFrame();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Izin kamera ditolak atau kamera tidak ditemukan';
      setErrorMessage(msg);
      setIsCameraActive(false);
    }
  };

  const requestScanFrame = () => {
    const scan = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const result = scanQRCodeFromVideo(videoRef.current, canvasRef.current);
        if (result) {
          if (result.isQris) {
            setScannedResult(result);
            stopCamera();
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
            return;
          } else {
            setErrorMessage('QR Code terdeteksi, tetapi bukan format QRIS (EMVCo).');
          }
        }
      }
      animationFrameIdRef.current = requestAnimationFrame(scan);
    };
    animationFrameIdRef.current = requestAnimationFrame(scan);
  };

  const handlePasteChange = (val: string) => {
    setPasteInput(val);
    setErrorMessage(null);
    setScannedResult(null);

    const clean = val.trim();
    if (!clean) return;

    const parsed = parseQris(clean);
    if (!parsed.isValid) {
      setErrorMessage('Format string tidak valid sesuai spesifikasi QRIS / EMVCo.');
    } else {
      setScannedResult({
        raw: clean,
        isQris: true,
        parsed,
      });
    }
  };

  const handleConfirmImport = () => {
    if (scannedResult && scannedResult.parsed) {
      onImportStaticQris(scannedResult.raw, scannedResult.parsed);
      stopCamera();
      onClose();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const acquirerInfo = scannedResult?.parsed ? detectAcquirerInfo(scannedResult.parsed) : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-4 font-mono select-none">
      <NeoCard className="max-w-lg w-full p-3.5 sm:p-5 space-y-3 sm:space-y-4 bg-[#FFFDF5] max-h-[92dvh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
            <div>
              <h3 className="text-sm font-black uppercase text-black">Scan / Upload QRIS Asli</h3>
              <p className="text-[10px] text-slate-600 font-bold">
                Import QRIS DANA Bisnis, ShopeePay, BCA, atau Merchant Anda
              </p>
            </div>
          </div>
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </NeoButton>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 border-2 border-black p-1 bg-amber-50">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`py-1.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#FFDE59] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'border-transparent text-slate-700 hover:bg-amber-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
            }}
            className={`py-1.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-[#FFDE59] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'border-transparent text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Kamera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('paste');
            }}
            className={`py-1.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-[#FFDE59] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'border-transparent text-slate-700 hover:bg-amber-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Paste Raw</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {activeTab === 'upload' && (
            <div className="space-y-2">
              <label className="border-2 border-dashed border-black rounded-none p-6 flex flex-col items-center justify-center bg-white hover:bg-amber-50 cursor-pointer transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isScanningImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-black stroke-[2.5]" />
                    <span className="text-xs font-black text-black uppercase">Membaca QR Code...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <UploadCloud className="w-8 h-8 text-black stroke-[2.5]" />
                    <span className="text-xs font-black text-black uppercase">
                      Klik atau Drag Screenshot / Foto QRIS
                    </span>
                    <span className="text-[10px] text-slate-600">
                      Mendukung screenshot dari DANA Bisnis, ShopeePay, BCA, dll.
                    </span>
                  </div>
                )}
              </label>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-2">
              <div className="relative border-2 border-black bg-black aspect-video flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <Camera className="w-8 h-8 text-amber-400 stroke-[2.5]" />
                    <p className="text-xs text-white font-bold">
                      Arahkan kamera ke QRIS fisik atau layar HP lain
                    </p>
                    <NeoButton
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleStartCamera}
                    >
                      Buka Kamera
                    </NeoButton>
                  </div>
                )}

                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-amber-400 border-dashed animate-pulse rounded-lg flex items-center justify-center">
                      <span className="text-[10px] text-amber-300 font-bold bg-black/70 px-2 py-0.5">
                        Posisikan QRIS di sini
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-black">
                Paste Raw String QRIS (Diawali 000201...)
              </label>
              <textarea
                rows={4}
                value={pasteInput}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder="00020101021126570011ID.DANA.WWW..."
                className="w-full p-2.5 text-xs font-mono border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 border-2 border-rose-600 bg-rose-50 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="font-bold">{errorMessage}</span>
            </div>
          )}

          {/* Scanned QRIS Details Preview */}
          {scannedResult && scannedResult.parsed && (
            <div className="p-3 border-2 border-emerald-600 bg-emerald-50 space-y-2.5 shadow-[2px_2px_0px_0px_rgba(5,150,105,1)]">
              <div className="flex items-center justify-between border-b border-emerald-300 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                  <span className="text-xs font-black text-emerald-950 uppercase">
                    QRIS Terverifikasi
                  </span>
                </div>
                {acquirerInfo && (
                  <NeoBadge variant="green">
                    {acquirerInfo.acquirerName}
                  </NeoBadge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Merchant Name
                  </span>
                  <span className="font-black text-black">
                    {scannedResult.parsed.merchantName || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Kota
                  </span>
                  <span className="font-black text-black">
                    {scannedResult.parsed.merchantCity || 'N/A'}
                  </span>
                </div>

                {acquirerInfo?.nmid && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      NMID (National Merchant ID)
                    </span>
                    <span className="font-black text-black font-mono text-[11px]">
                      {acquirerInfo.nmid}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <p className="text-[10px] text-emerald-900 leading-tight font-medium">
                  Saldo pembayaran akan langsung masuk ke akun <strong>{acquirerInfo?.acquirerName || 'Merchant'}</strong> Anda saat di-scan oleh pembeli.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t-2 border-black pt-3">
          <NeoButton
            type="button"
            variant="neutral"
            size="sm"
            onClick={() => {
              stopCamera();
              onClose();
            }}
          >
            Batal
          </NeoButton>

          <NeoButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirmImport}
            disabled={!scannedResult || !scannedResult.parsed}
            className="px-4 font-black"
          >
            <span>GUNAKAN QRIS INI</span>
          </NeoButton>
        </div>
      </NeoCard>
    </div>
  );
}
