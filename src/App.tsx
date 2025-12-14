import { useState } from 'react';
import { Toaster } from 'sonner';
import { Package, Users, Route as RouteIcon, Settings } from 'lucide-react';
import Dashboard from './components/Dashboard';
import DeliveryPersonList from './components/DeliveryPersonList';
import RouteList from './components/RouteList';
import DataManager from './components/DataManager';
import QRScanner from './components/QRScanner';

type Tab = 'dashboard' | 'deliveryPersons' | 'routes' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Triagem Shopee</h1>
                <p className="text-xs opacity-90">Sistema de Distribuição</p>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Escanear QR
            </button>
          </div>
        </div>
      </header>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner onClose={() => setShowScanner(false)} />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'deliveryPersons' && <DeliveryPersonList />}
        {activeTab === 'routes' && <RouteList />}
        {activeTab === 'settings' && <DataManager />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setActiveTab('deliveryPersons')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'deliveryPersons'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs font-medium">Entregadores</span>
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'routes'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <RouteIcon className="h-5 w-5" />
              <span className="text-xs font-medium">Rotas</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Configurações</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;