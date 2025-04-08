import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 flex justify-center items-center transition-colors z-50 ${
          isOpen ? 'visible bg-violet-950/50' : 'invisible'
        }`}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-violet-700 p-6 rounded-2xl shadow-lg w-96 text-center"
          // reikia sustabdyti is tevo
          // paveldeta onclik funkcija
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-2">{title}</h2>

          <p className="text-violet-100 mb-4">{message}</p>

          {children}
          
          <div className="flex justify-center gap-4">
            <Button onClick={onCancel} className="btn-generic">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className="btn-red">
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
