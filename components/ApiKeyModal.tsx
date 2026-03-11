import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    // Check if env var exists (for dev convenience) or localStorage
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) setKey(stored);
    else if (process.env.API_KEY) setKey(process.env.API_KEY);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key);
      onSave(key);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4 text-blue-600">
          <div className="p-3 bg-blue-100 rounded-full">
            <Key size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">API Key Requerida</h2>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">
          Para analizar los datos de tus hojas de cálculo con Gemini, por favor proporciona tu clave de API de Google GenAI.
          La clave se guarda localmente en tu navegador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clave de API de Gemini
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Comenzar Análisis
          </button>
        </form>
        
        <div className="mt-4 text-xs text-center text-gray-400">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 underline">
            Obtén una clave de API aquí
          </a>
        </div>
      </div>
    </div>
  );
};
