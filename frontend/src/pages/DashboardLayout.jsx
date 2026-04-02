import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#F6F8FB] font-inter">
            {/* Sidebar - fixed width 64 units = 256px */}
            <Sidebar />

            {/* Main Content Area - calculated width, marginLeft for sidebar */}
            <div className="ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <TopNav />

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative" style={{ minHeight: 0 }}>
                    {/* Subtle background decoration for the dashboard */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
