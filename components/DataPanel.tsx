import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SHEET_CONFIG, fetchSheetData, MOCK_DATA } from '../services/sheet';

interface DataPanelProps {
  onDataLoaded: (data: string) => void;
  currentData: string | null;
}

export const DataPanel: React.FC<DataPanelProps> = ({ onDataLoaded, currentData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'url' | 'manual'>('url');
  const [manualText, setManualText] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSheetData(DEFAULT_SHEET_CONFIG);
      onDataLoaded(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const loadMockData = () => {
    onDataLoaded(MOCK_DATA);
    setManualText(MOCK_DATA);
    setMode('manual');
    setError(null);
  };

  const handleManualSubmit = () => {
    if(!manualText.trim()) return;
    onDataLoaded(manualText);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-800">
           <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
             <Database size={20} />
           </div>
           <div>
             <h2 className="font-semibold">Fuente de Datos</h2>
             <p className="text-xs text-gray-500">
                {currentData 
                  ? `${currentData.split('\n').length} filas cargadas` 
                  : 'Sin datos cargados'}
             </p>
           </div>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setMode('url')}
             className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'url' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Hoja en Vivo
           </button>
           <button 
             onClick={() => setMode('manual')}
             className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'manual' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
           >
             Manual / CSV
           </button>
        </div>
      </div>

      {mode === 'url' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
             <FileText size={16} className="text-gray-400" />
             <span className="truncate flex-1 text-gray-600 font-mono text-xs">
               ...{DEFAULT_SHEET_CONFIG.sheetId.slice(0, 15)}... / GID: {DEFAULT_SHEET_CONFIG.gid}
             </span>
             <button 
                onClick={handleFetch}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
             >
                {loading ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                {loading ? 'Cargando...' : 'Conectar'}
             </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-700">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold mb-1">Error de Conexión</p>
                <p className="opacity-90">{error}</p>
                <button 
                  onClick={loadMockData}
                  className="mt-2 text-red-800 underline hover:text-red-900 font-medium"
                >
                  Cargar Datos de Demo en su lugar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="space-y-3">
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Pega datos CSV aquí: Tienda, Región, Periodo, Ventas..."
            className="w-full h-24 p-3 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <button 
               onClick={loadMockData}
               className="text-xs text-gray-500 hover:text-indigo-600 underline"
            >
              Usar Datos de Demo
            </button>
            <button 
              onClick={handleManualSubmit}
              className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-black transition-colors"
            >
              Actualizar Contexto
            </button>
          </div>
        </div>
      )}
      
      {currentData && !error && (
        <div className="mt-2 flex items-center gap-1.5 text-green-600 text-xs font-medium">
          <CheckCircle2 size={12} />
          <span>El analista está listo con datos actualizados.</span>
        </div>
      )}
    </div>
  );
};
