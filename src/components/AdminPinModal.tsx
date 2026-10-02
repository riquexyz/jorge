import React, { useState } from 'react';
import { Lock, ChefHat, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  target?: 'admin' | 'kitchen';
  title?: string;
  subtitle?: string;
  expectedPin?: string;
  storageKey?: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  target = 'admin',
  title,
  subtitle,
  expectedPin,
  storageKey
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const isKitchen = target === 'kitchen';
  const effectiveExpectedPin = expectedPin || (isKitchen ? '0000' : '1234');
  const effectiveStorageKey = storageKey || (isKitchen ? 'thalassa_kitchen_auth' : 'thalassa_admin_auth');
  const effectiveTitle = title || (isKitchen ? 'Senha da Cozinha (KDS)' : 'Senha de Administrador');
  const effectiveSubtitle = subtitle || (isKitchen ? 'Digite o PIN da cozinha para visualizar os pedidos' : 'Digite o PIN para gerenciar o restaurante e faturamento');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (code: string) => {
    if (code === effectiveExpectedPin) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(effectiveStorageKey, 'true');
      }
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setPin(''), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F2B38] text-[#0B2B3A] dark:text-[#E6F1EF] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#C5DAD6] dark:border-[#1E4252] text-center space-y-4">
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#4F6B75] dark:text-[#93B0B8] font-bold">
            {isKitchen ? 'Área de Preparo' : 'Acesso Restrito'}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`w-12 h-12 rounded-2xl ${isKitchen ? 'bg-[#E8A33D] text-[#0B2B3A]' : 'bg-[#0B2B3A] dark:bg-[#1F7A8C] text-[#E8A33D]'} mx-auto flex items-center justify-center shadow-md`}>
          {isKitchen ? <ChefHat className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>

        <div>
          <h3 className="font-serif text-xl font-bold">{effectiveTitle}</h3>
          <p className="text-xs text-[#4F6B75] dark:text-[#93B0B8] mt-1">
            {effectiveSubtitle}
          </p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all ${
                pin.length > idx
                  ? error
                    ? 'bg-rose-500 scale-110'
                    : 'bg-[#E8A33D] scale-110'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-xs text-rose-500 font-semibold flex items-center justify-center gap-1 animate-shake">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Senha incorreta. Tente novamente.</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="w-16 h-14 rounded-2xl bg-[#EAF3F1] dark:bg-[#081C26] hover:bg-[#1F7A8C] hover:text-white text-lg font-bold transition-all active:scale-90 flex items-center justify-center shadow-xs cursor-pointer"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="w-16 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center text-gray-500 cursor-pointer"
          >
            Limpar
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="w-16 h-14 rounded-2xl bg-[#EAF3F1] dark:bg-[#081C26] hover:bg-[#1F7A8C] hover:text-white text-lg font-bold transition-all active:scale-90 flex items-center justify-center shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center text-gray-500 cursor-pointer"
          >
            ⌫
          </button>
        </div>

        <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          Senha padrão da {isKitchen ? 'cozinha' : 'administração'}:{' '}
          <strong className="text-[#0B2B3A] dark:text-white font-mono">
            {effectiveExpectedPin}
          </strong>
        </div>
      </div>
    </div>
  );
};
