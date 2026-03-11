import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { DataPanel } from './components/DataPanel';
import { Message } from './types';
import { sendMessageToGemini } from './services/gemini';

export default function App() {
  const [dataContext, setDataContext] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "¡Hola! Soy tu Analista de Rendimiento Retail. \n\nPor favor, carga los datos de las tiendas arriba para comenzar. Una vez cargados, puedes pedirme que analice el rendimiento anual o mensual, compare regiones o sugiera prioridades.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;
    if (!dataContext) {
      alert("Por favor, conecta con Google Sheets o carga los datos primero.");
      return;
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsSending(true);

    try {
      const responseText = await sendMessageToGemini(messages, input, dataContext);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `**Error**: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">

      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-indigo-700">
          <Sparkles size={24} />
          <h1 className="text-xl font-bold tracking-tight">Analista de KPIs Retail</h1>
        </div>
      </header>

      {/* Main Content Area: Split View for larger screens, Stacked for mobile */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        
        {/* Left Panel: Data & Context Config */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-gray-100/50 md:border-r border-gray-200 overflow-y-auto">
          <DataPanel 
            onDataLoaded={(data) => {
                setDataContext(data);
                if (messages.length === 1) {
                    setMessages(prev => [...prev, {
                        id: 'system-ready',
                        role: 'model',
                        content: "**Datos cargados correctamente.** \n\nAhora puedo ver los datos de Ventas, Tráfico y KPIs. Prueba a preguntar: \n\n*\"Indicar qué prioridades tiene la región sureste.\"*",
                        timestamp: new Date()
                    }]);
                }
            }}
            currentData={dataContext}
          />
          
          <div className="p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Capacidades de Análisis</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></span>
                <span>Rendimiento Anual vs Mensual</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                <span>Benchmarking Regional</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></span>
                <span>Detección de Desviaciones</span>
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>
                <span>Prioridades de Mejora</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="flex-1 flex flex-col relative bg-gray-50/50">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-3xl mx-auto">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isSending && (
                 <div className="flex justify-start mb-6 w-full animate-pulse">
                   <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative flex items-center gap-3">
               {!dataContext && (
                 <div className="absolute -top-12 left-0 right-0 flex justify-center">
                    <div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-1.5 rounded-full border border-yellow-200 flex items-center gap-1.5 shadow-sm">
                        <AlertCircle size={12} />
                        Carga datos para empezar a analizar
                    </div>
                 </div>
               )}
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 disabled={isSending}
                 placeholder="Pregunta sobre rendimiento, desviaciones o prioridades..."
                 className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
               />
               <button
                 type="submit"
                 disabled={!input.trim() || isSending || !dataContext}
                 className="p-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center transform hover:scale-105 active:scale-95"
               >
                 <Send size={20} />
               </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3">
              La IA analiza el conjunto de datos cargado. Verifica las decisiones críticas de negocio de forma independiente.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
