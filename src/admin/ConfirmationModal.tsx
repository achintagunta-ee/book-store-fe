import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isProcessing?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative overflow-hidden">
        {/* Header with Icon */}
        <div className="bg-red-50 px-6 py-4 flex items-center gap-3 border-b border-red-100">
           <div className="bg-red-100 p-2 rounded-full">
               <AlertTriangle className="text-red-600" size={24} />
           </div>
           <h3 className="text-lg font-bold text-red-900">{title}</h3>
           <button
             onClick={onClose}
             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
