import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, []);

    const removeToast = useCallback(id => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-emerald-600" />;
            case 'error': return <AlertTriangle size={16} className="text-rose-600" />;
            default: return <Info size={16} className="text-indigo-600" />;
        }
    };

    const getBg = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-100 border-emerald-200';
            case 'error': return 'bg-rose-100 border-rose-200';
            default: return 'bg-indigo-100 border-indigo-200';
        }
    };

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto ${getBg(toast.type)}`}
                        >
                            {getIcon(toast.type)}
                            <span className="text-sm font-medium text-slate-800 flex-1">{toast.message}</span>
                            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
