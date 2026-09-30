import React from 'react';
import { SpriteInfo, BackdropInfo, SpriteId, BackdropId } from '../types/scratch';
import { Trash2, CheckCircle2, Image as ImageIcon, Sparkles, User, Bot, GraduationCap } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpriteTrayProps {
  sprites: SpriteInfo[];
  backdrops: BackdropInfo[];
  selectedHostId: SpriteId;
  selectedBackdropId: BackdropId;
  onSelectHost: (id: SpriteId) => void;
  onSelectBackdrop: (id: BackdropId) => void;
  onDeleteCat: () => void;
  catDeleted: boolean;
}

export const SpriteTray: React.FC<SpriteTrayProps> = ({
  sprites,
  backdrops,
  selectedHostId,
  selectedBackdropId,
  onSelectHost,
  onSelectBackdrop,
  onDeleteCat,
  catDeleted,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprites Area */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Phase 1 · Stage Sprites
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Host Character Selection</span>
            </div>
            <span className="text-xs text-slate-400">
              Active Host: <strong className="text-emerald-400 capitalize">{selectedHostId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* The Default Cat Sprite with trash icon */}
            {!catDeleted ? (
              <div className="relative group border-2 border-amber-500/50 bg-amber-950/20 rounded-lg p-2 flex flex-col items-center justify-between text-center transition-all hover:border-amber-400">
                <button
                  onClick={() => {
                    sound.playPop();
                    onDeleteCat();
                  }}
                  title="Delete the default cat sprite"
                  className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-12 h-12 flex items-center justify-center bg-amber-500/10 rounded-full mb-1">
                  {/* Scratch Cat Icon representation */}
                  <svg className="w-9 h-9 text-amber-400" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="55" r="32" />
                    <polygon points="26,30 35,5 50,30" />
                    <polygon points="74,30 65,5 50,30" />
                    <circle cx="38" cy="50" r="5" fill="#0f172a" />
                    <circle cx="62" cy="50" r="5" fill="#0f172a" />
                    <polygon points="46,60 54,60 50,65" fill="#0f172a" />
                    <path d="M 40,70 Q 50,78 60,70" stroke="#0f172a" strokeWidth="3" fill="none" />
                  </svg>
                </div>
                <div className="text-[11px] font-semibold text-amber-200">Default Cat</div>
                <span className="text-[9px] text-rose-300 font-medium mt-0.5">Click trash to delete</span>
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 bg-slate-950/40 rounded-lg p-2 flex flex-col items-center justify-center text-center text-slate-500 opacity-60">
                <Trash2 className="w-5 h-5 text-slate-600 mb-1" />
                <span className="text-[10px] line-through">Cat Sprite</span>
                <span className="text-[9px] text-emerald-400 mt-0.5">Deleted ✓</span>
              </div>
            )}

            {/* Other Host Options: Robo-Professor, Avery, Nano, Professor Owl */}
            {sprites
              .filter((s) => s.id !== 'cat')
              .map((sprite) => {
                const isSelected = selectedHostId === sprite.id;
                return (
                  <button
                    key={sprite.id}
                    onClick={() => {
                      sound.playPop();
                      onSelectHost(sprite.id);
                    }}
                    className={`relative border-2 rounded-lg p-2 flex flex-col items-center justify-between text-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-md shadow-emerald-900/20'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full bg-slate-800/80 mb-1">
                      {sprite.avatarUrl ? (
                        <img
                          src={sprite.avatarUrl}
                          alt={sprite.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : sprite.id === 'robot' ? (
                        <Bot className="w-7 h-7 text-cyan-400" />
                      ) : sprite.id === 'avery' ? (
                        <User className="w-7 h-7 text-indigo-400" />
                      ) : sprite.id === 'nano' ? (
                        <Sparkles className="w-7 h-7 text-purple-400" />
                      ) : (
                        <GraduationCap className="w-7 h-7 text-amber-400" />
                      )}
                    </div>

                    <div className="text-[11px] font-semibold truncate max-w-full">{sprite.name}</div>
                    <span className="text-[9px] text-slate-400 truncate max-w-full">{sprite.role}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Backdrops Area */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Stage Backdrop
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">Educational Environment</span>
            </div>
            <span className="text-xs text-slate-400">
              Active: <strong className="text-cyan-300 capitalize">{selectedBackdropId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {backdrops.map((backdrop) => {
              const isSelected = selectedBackdropId === backdrop.id;
              return (
                <button
                  key={backdrop.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectBackdrop(backdrop.id);
                  }}
                  className={`group relative border-2 rounded-lg p-2 text-left transition-all overflow-hidden ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-900/20'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 z-10 bg-cyan-500 text-slate-950 rounded-full p-0.5 shadow">
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className="w-full h-12 rounded overflow-hidden mb-1.5 bg-slate-800 relative">
                    {backdrop.imageUrl ? (
                      <img
                        src={backdrop.imageUrl}
                        alt={backdrop.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center border border-slate-700">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] font-semibold truncate">{backdrop.name}</div>
                  <div className="text-[9px] text-slate-400 truncate">{backdrop.theme}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
