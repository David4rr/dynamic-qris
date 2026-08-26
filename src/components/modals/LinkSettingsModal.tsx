import {
  Globe,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NeoButton, NeoInput, NeoCard } from '../ui/neobrutalism';
import { type LinkConfig, DEFAULT_LINK_CONFIG } from '../../lib/qris';

interface LinkSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkConfig: LinkConfig;
  setLinkConfig: (cfg: LinkConfig | ((prev: LinkConfig) => LinkConfig)) => void;
}

const LINK_PRESETS: { title: string; desc: string; url: string }[] = [
  { title: 'INSTAGRAM', desc: 'Follow our official Instagram account', url: 'https://instagram.com/' },
  { title: 'WHATSAPP', desc: 'Chat directly with our team on WhatsApp', url: 'https://wa.me/' },
  { title: 'WEBSITE', desc: 'Visit our official online website', url: 'https://' },
  { title: 'MENU & CATALOG', desc: 'View complete digital food menu & prices', url: 'https://' },
];

export function LinkSettingsModal({
  isOpen,
  onClose,
  linkConfig,
  setLinkConfig,
}: LinkSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-mono select-none">
      <NeoCard className="max-w-lg w-full p-5 space-y-4 bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-black stroke-[2.5]" />
            <h3 className="text-sm font-black uppercase text-black">Link & Social Configuration</h3>
          </div>
          <NeoButton
            variant="neutral"
            size="sm"
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </NeoButton>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-[10px] font-black uppercase text-black mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 stroke-[2.5]" />
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {LINK_PRESETS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() =>
                  setLinkConfig({
                    title: preset.title,
                    description: preset.desc,
                    url: preset.url,
                  })
                }
                className="p-2 border-2 border-black text-left bg-amber-50 hover:bg-[#FFDE59] transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <div className="text-[11px] font-black text-black">{preset.title}</div>
                <div className="text-[9px] text-slate-600 truncate">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
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
              Description (Subtitle)
            </label>
            <NeoInput
              maxLength={60}
              value={linkConfig.description}
              onChange={(e) =>
                setLinkConfig((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="e.g. Scan with smartphone camera to connect"
            />
          </div>
        </div>

        {/* Modal Footer */}
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
