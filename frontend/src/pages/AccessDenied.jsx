import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white p-10 rounded-3xl shadow-xl border border-rose-100 flex flex-col items-center max-w-lg w-full text-center relative z-10"
            >
                <div className="w-24 h-24 rounded-2xl bg-rose-100 flex items-center justify-center mb-6 shadow-inner border border-rose-200">
                    <ShieldAlert size={48} className="text-rose-600" />
                </div>
                <h1 className="text-4xl font-bold font-poppins text-slate-800 mb-3 tracking-tight">403</h1>
                <h2 className="text-xl font-bold font-poppins text-slate-700 mb-4">Access Denied</h2>
                <p className="text-slate-500 mb-8 px-4 leading-relaxed">
                    You do not have the required permissions to view this directory.
                    Please contact your workspace administrator to upgrade your role.
                </p>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(-1)}
                    className="bg-slate-800 text-white rounded-xl px-8 py-3.5 flex items-center gap-2 font-semibold shadow-lg hover:bg-slate-900 transition-colors"
                >
                    <ArrowLeft size={18} /> Go Back
                </motion.button>
            </motion.div>
        </div>
    );
}
