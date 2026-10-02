import React, { useState } from 'react';
import { QrCode, Users, Receipt, RefreshCw, Printer } from 'lucide-react';
import { TableInfo } from '../types';

interface TableBannerProps {
  tableNumber: string;
  setTableNumber: (num: string) => void;
  tables: TableInfo[];
  onOpenComandaModal: () => void;
}

export const TableBanner: React.FC<TableBannerProps> = ({
  tableNumber,
  setTableNumber,
  tables,
  onOpenComandaModal
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const currentTable = tables.find(t => t.number === tableNumber);

  return (
    <div className="bg-[#1F7A8C]/10 dark:bg-[#0F2B38] border-y border-[#C5DAD6] dark:border-[#1E4252] py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Table Indicator */}
        <div className="flex items-center gap-2.5 text-[#0B2B3A] dark:text-[#E6F1EF]">
          <div className="w-8 h-8 rounded-lg bg-[#E8A33D] text-[#0B2B3A] flex items-center justify-center font-bold font-serif text-sm shadow-xs">
            {tableNumber || '??'}
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5">
              <span>Você está fazendo um pedido na <strong>Mesa {tableNumber || 'Não identificada'}</strong></span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                QR Code Ativo
              </span>
            </div>
            <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">
              {currentTable?.name || 'Mesa do Salão'} · Pedidos compartilhados na mesma comanda
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Comanda Button */}
          <button
            onClick={onOpenComandaModal}
            className="flex items-center gap-1.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span>Ver Comanda da Mesa</span>
            {currentTable?.activeComandaTotal ? (
              <span className="bg-[#E8A33D] text-[#0B2B3A] text-[10px] font-bold px-1.5 py-0.2 rounded">
                R$ {currentTable.activeComandaTotal.toFixed(2).replace('.', ',')}
              </span>
            ) : null}
          </button>

          {/* Table Switcher */}
          <button
            onClick={() => setShowTablePicker(true)}
            className="flex items-center gap-1 bg-white dark:bg-[#081C26] text-[#0B2B3A] dark:text-[#E6F1EF] border border-[#C5DAD6] dark:border-[#1E4252] px-2.5 py-1.5 rounded-lg hover:border-[#1F7A8C] transition-colors"
            title="Trocar de mesa ou testar outra"
          >
            <RefreshCw className="w-3 h-3 text-[#1F7A8C]" />
            <span>Trocar Mesa</span>
          </button>

          {/* QR Code Plaque Preview */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1 bg-white dark:bg-[#081C26] text-[#0B2B3A] dark:text-[#E6F1EF] border border-[#C5DAD6] dark:border-[#1E4252] px-2.5 py-1.5 rounded-lg hover:border-[#1F7A8C] transition-colors"
            title="Ver plaquinha de mesa com QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span className="hidden md:inline">Ver Plaquinha QR</span>
          </button>
        </div>
      </div>

      {/* Switch Table Modal */}
      {showTablePicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-serif text-xl font-bold">Selecionar Mesa</h3>
                <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8]">
                  Em produção, o cliente escaneia o QR Code físico na mesa.
                </p>
              </div>
              <button
                onClick={() => setShowTablePicker(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4 max-h-72 overflow-y-auto pr-1">
              {tables.map(tbl => (
                <button
                  key={tbl.id}
                  onClick={() => {
                    setTableNumber(tbl.number);
                    setShowTablePicker(false);
                    // Update URL search query cleanly
                    const url = new URL(window.location.href);
                    url.searchParams.set('mesa', tbl.number);
                    window.history.replaceState({}, '', url.toString());
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tableNumber === tbl.number
                      ? 'border-[#E8A33D] bg-[#E8A33D]/10 ring-2 ring-[#E8A33D]/40'
                      : 'border-[#C5DAD6] dark:border-[#1E4252] hover:border-[#1F7A8C] bg-white dark:bg-[#081C26]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-[#E6F1EF]">
                      Mesa {tbl.number}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${tbl.status === 'occupied' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  </div>
                  <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8] truncate">{tbl.name}</div>
                  <div className="text-[10px] text-[#1F7A8C] mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{tbl.capacity} pessoas</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTablePicker(false)}
              className="w-full py-2.5 bg-[#0B2B3A] dark:bg-[#1F7A8C] text-white rounded-xl font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* QR Code Plaque Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Display Plaque Styled Preview */}
            <div className="border-4 border-[#0B2B3A] dark:border-[#E8A33D] rounded-2xl p-5 bg-gradient-to-b from-white to-[#EAF3F1] dark:from-[#0F2B38] dark:to-[#081C26] shadow-inner mb-4">
              <div className="font-serif text-2xl font-bold text-[#0B2B3A] dark:text-[#E8A33D]">
                Θάλασσα
              </div>
              <div className="text-xs font-semibold text-[#1F7A8C] tracking-widest uppercase mb-3">
                Thalassa · Peruíbe
              </div>

              {/* Dynamic SVG QR Code Simulation */}
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-gray-300 shadow-md flex flex-col items-center justify-center">
                <svg className="w-full h-full text-[#0B2B3A]" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Frame & Finder Patterns */}
                  <rect x="5" y="5" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#0B2B3A" rx="2" />

                  <rect x="67" y="5" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#0B2B3A" rx="2" />

                  <rect x="5" y="67" width="28" height="28" fill="#0B2B3A" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#0B2B3A" rx="2" />

                  {/* Random simulated QR pattern dots */}
                  <rect x="38" y="10" width="8" height="8" fill="#0B2B3A" />
                  <rect x="50" y="12" width="6" height="6" fill="#0B2B3A" />
                  <rect x="42" y="24" width="14" height="6" fill="#0B2B3A" />
                  <rect x="10" y="38" width="6" height="10" fill="#0B2B3A" />
                  <rect x="22" y="42" width="8" height="8" fill="#0B2B3A" />
                  <rect x="36" y="38" width="28" height="28" fill="#1F7A8C" rx="4" />
                  {/* Center table badge */}
                  <text x="50" y="56" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    {tableNumber || '08'}
                  </text>
                  <rect x="70" y="40" width="8" height="8" fill="#0B2B3A" />
                  <rect x="82" y="48" width="8" height="12" fill="#0B2B3A" />
                  <rect x="38" y="72" width="10" height="8" fill="#0B2B3A" />
                  <rect x="52" y="80" width="12" height="8" fill="#0B2B3A" />
                  <rect x="72" y="70" width="18" height="18" fill="#0B2B3A" />
                </svg>
              </div>

              <div className="mt-3">
                <div className="font-serif text-lg font-bold text-[#0B2B3A] dark:text-[#E6F1EF]">
                  MESA {tableNumber}
                </div>
                <div className="text-[11px] text-[#4F6B75] dark:text-[#93B0B8]">
                  Aponte a câmera do seu celular para abrir o cardápio e fazer seu pedido
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#1F7A8C] text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1F7A8C]/80"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Placa</span>
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="py-2.5 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
