import { useState } from 'react';
import { LayoutDashboard, Video, Bell, BarChart3, Users, Map, Menu, Shield, X, Camera } from 'lucide-react';
import { DashboardOverview } from '@/app/components/DashboardOverview';
import { LiveMonitoring } from '@/app/components/LiveMonitoring';
import { AlertsPanel } from '@/app/components/AlertsPanel';
import { Analytics } from '@/app/components/Analytics';
import { EmployeeRecords } from '@/app/components/EmployeeRecords';
import { ZoneHeatmap } from '@/app/components/ZoneHeatmap';
import { LiveCCTV } from '@/app/components/LiveCCTV';

type Page = 'dashboard' | 'monitoring' | 'livecctv' | 'alerts' | 'analytics' | 'employees' | 'heatmap';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'monitoring':
        return <LiveMonitoring />;
      case 'livecctv':
        return <LiveCCTV />;
      case 'alerts':
        return <AlertsPanel />;
      case 'analytics':
        return <Analytics />;
      case 'employees':
        return <EmployeeRecords />;
      case 'heatmap':
        return <ZoneHeatmap />;
      default:
        return <DashboardOverview />;
    }
  };

  const navigation = [
    { id: 'dashboard' as Page, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring' as Page, name: 'Live Monitoring', icon: Video },
    { id: 'livecctv' as Page, name: 'Live CCTV', icon: Camera },
    { id: 'alerts' as Page, name: 'Alerts', icon: Bell },
    { id: 'analytics' as Page, name: 'Analytics', icon: BarChart3 },
    { id: 'employees' as Page, name: 'Employee Records', icon: Users },
    { id: 'heatmap' as Page, name: 'Zone Heatmap', icon: Map }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm">SafetyVision AI</h1>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            <div className="flex items-center justify-between mb-2">
              <span>AI Model:</span>
              <span className="text-white font-medium">YOLOv8-L</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tracking:</span>
              <span className="text-white font-medium">BotSORT</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-bold text-gray-900">
                {navigation.find(n => n.id === currentPage)?.name}
              </h2>
              <p className="text-xs text-gray-500">Industrial Safety Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">System Online</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}