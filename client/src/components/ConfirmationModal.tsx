import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { useTranslation } from 'react-i18next';

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
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  children,
}) => {
  const { t } = useTranslation();

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
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-2">
            {title || t('modal_confirm_title')}
          </h2>

          <p className="text-violet-100 mb-4">{message}</p>

          {children}

          <div className="flex justify-center gap-4">
            <Button onClick={onCancel} className="btn-generic">
              {cancelText || t('modal_cancel')}
            </Button>
            <Button onClick={onConfirm} className="btn-red">
              {confirmText || t('modal_confirm')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};