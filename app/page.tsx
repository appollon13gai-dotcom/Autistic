"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, BookOpen, TrendingUp, ClipboardList, AlertTriangle, Send, RefreshCw, Play, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { resources, globalKnowledge, getResourcesForLocation, defaultLocation, type Resource, type GlobalKnowledge } from '@/lib/data';
import { rehabActivities, rehabCategories, getActivitiesByCategory, generateDailyPlan, rehabIntro, type RehabActivity } from '@/lib/rehab-program';

// === TYPES ===
interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    id: number;
    name: string;
    type: 'image' | 'file';
    url: string;
  }>;
}

interface TrackerEntry {
  id: number;
  date: string;
  notes: string;
  skillsObserved: string;
  challenges: string;
}

// === MAIN WEB APPLICATION ===
export default function AutismAICompanion() {
  // Location state - flexible for refugees who move often
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [locationInput, setLocationInput] = useState('');
  const [isLocationSet, setIsLocationSet] = useState(true); // Start with Blanes pre-set for demo

  // Filtered resources based on location
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  // AI Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      content: `Hola. Soy tu asistente IA para apoyo a familias con autismo (sospecha de TEA). Estoy configurado inicialmente para **Blanes (Girona, Cataluña, España)**, pero puedes cambiar la ubicación en cualquier momento (ideal si te mudas frecuentemente como refugiado).\n\nPuedo ayudarte con:\n• Recursos locales y en España\n• Base de conocimiento global (prácticas basadas en evidencia)\n• Ideas de actividades diarias para un niño de 5 años\n• Полноценная онлайн-программа реабилитации ("Спортзал навыков" с упражнениями, шагами и описаниями для картинок)\n• Resúmenes de tendencias e intervenciones\n\n**IMPORTANTE (léelo siempre):** Esto es información general y apoyo práctico. NO sustituye diagnóstico, tratamiento médico ni consejo profesional. Consulta siempre con Atención Temprana, pediatras, psicólogos o especialistas. Los datos deben verificarse ya que cambian.`,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simple daily tracker
  const [trackerEntries, setTrackerEntries] = useState<TrackerEntry[]>([]);
  const [trackerNotes, setTrackerNotes] = useState('');
  const [trackerSkills, setTrackerSkills] = useState('');
  const [trackerChallenges, setTrackerChallenges] = useState('');

  // New: Attachments and voice for AI chat
  const [attachments, setAttachments] = useState<Array<{id: number; name: string; type: 'image' | 'file'; url: string}>>([]);
  const [isListening, setIsListening] = useState(false);

  // Rehab program state
  const [rehabCategory, setRehabCategory] = useState<'all' | 'sensory' | 'communication' | 'social-play' | 'motor' | 'self-care' | 'cognitive'>('all');
  const [dailyPlan, setDailyPlan] = useState<RehabActivity[]>([]);

  // Active tab
  const [activeTab, setActiveTab] = useState<'resources' | 'chat' | 'knowledge' | 'tracker' | 'rehab'>('chat');

  // Update filtered resources when location changes
  useEffect(() => {
    const filtered = getResourcesForLocation(currentLocation);
    setFilteredResources(filtered);
  }, [currentLocation]);

  // Load from localStorage on mount (for persistence across moves/refreshes)
  useEffect(() => {
    const savedLocation = localStorage.getItem('autismCompanionLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      setIsLocationSet(true);
    }
    const savedTracker = localStorage.getItem('autismCompanionTracker');
    if (savedTracker) {
      setTrackerEntries(JSON.parse(savedTracker));
    }
  }, []);

  // Save location
  const updateLocation = () => {
    if (!locationInput.trim()) {
      toast.error('Por favor introduce una ubicación (ej: Blanes, Girona, o cualquier ciudad)');
      return;
    }
    const newLoc = locationInput.trim();
    setCurrentLocation(newLoc);
    localStorage.setItem('autismCompanionLocation', newLoc);
    setIsLocationSet(true);
    setLocationInput('');
    toast.success(`Ubicación actualizada a: ${newLoc}. Los recursos y el agente IA se adaptarán.`);
  };

  // Reset to flexible (for frequent moves)
  const resetToFlexible = () => {
    const flexible = 'Ubicación flexible (introduce tu ciudad actual)';
    setCurrentLocation(flexible);
    localStorage.setItem('autismCompanionLocation', flexible);
    toast.info('Modo flexible activado. Introduce cualquier ciudad/región cuando cambies de residencia.');
  };

  // === SIMPLE AI AGENT RESPONSE (demo - location + data aware) ===
  // In production: Replace with real LLM call (Vercel AI SDK + OpenAI/Anthropic/Grok API)
  // or connect to n8n workflow for full agentic RAG + tools.
  // Now supports attachments: voice dictation + photo/file uploads
  const generateAIResponse = (userMessage: string, location: string, attachments: any[] = []): string => {
    const lowerMsg = (userMessage || '').toLowerCase();
    const locContext = `Ubicación actual: ${location}. `;

    // Handle attachments context
    let attachContext = '';
    if (attachments.length > 0) {
      const names = attachments.map((a: any) => a.type === 'image' ? `фото "${a.name}"` : `файл "${a.name}"`).join(', ');
      attachContext = ` [Прикреплено: ${names}] `;
      if (attachments.some((a: any) => a.type === 'image')) {
        attachContext += 'На основе загруженного фото (демо-анализ): Ребёнок проявляет интерес к предметам/игрушкам. Рекомендую использовать это для совместной игры и визуальных расписаний. ';
      }
    }

    // Location-specific quick responses
    if (lowerMsg.includes('blanes') || lowerMsg.includes('girona') || lowerMsg.includes('recurso') || lowerMsg.includes('dónde') || lowerMsg.includes('centro')) {
      const local = filteredResources.slice(0, 3).map(r => `• ${r.title}: ${r.description.substring(0, 120)}... (${r.contact || r.website || 'Ver web'})`).join('\n');
      return `${locContext}${attachContext}Aquí tienes recursos relevantes para tu zona:\n\n${local}\n\nRecomendación fuerte: Contacta **Atención Temprana Girona** a través de tu CAP en Blanes o la web de Salut (salut.gencat.cat). Junts Autisme (juntsautisme.org) ofrece apoyo excelente a familias en Cataluña. Verifica siempre la información actualizada.`;
    }

    if (lowerMsg.includes('actividad') || lowerMsg.includes('juego') || lowerMsg.includes('qué hacer') || lowerMsg.includes('rutina')) {
      return `${locContext}${attachContext}Para un niño de ~5 años con sospecha de autismo, prioriza prácticas basadas en evidencia (NCAEP): Naturalistic Interventions (enseñanza natural durante el juego), Visual Supports (horarios visuales), Parent-Implemented Interventions.\n\nIdea concreta: Crea un horario visual simple con fotos de rutinas diarias (desayuno → parque → comida). Usa refuerzo positivo inmediato. Juega turnos simples con juguetes preferidos del niño. Observa qué le gusta y amplía eso. Registra en el Tracker qué funciona.`;
    }

    if (lowerMsg.includes('tendencia') || lowerMsg.includes('investigación') || lowerMsg.includes('nuevo') || lowerMsg.includes('esdm') || lowerMsg.includes('aba')) {
      const trend = globalKnowledge.find(k => k.id === 'trends-2026');
      return `${locContext}${attachContext}${trend?.summary || ''}\n\nEnfoque principal recomendado: Intervención temprana intensiva basada en evidencia (ESDM, enfoques naturalistas + parent coaching). Evita terapias sin respaldo científico fuerte (revisa ASAT). En España, combina con Atención Temprana pública.`;
    }

    if (lowerMsg.includes('ucrania') || lowerMsg.includes('refugiado') || lowerMsg.includes('diáspora')) {
      return `${locContext}${attachContext}Como familia ucraniana en España: Busca grupos de "Ucranianos Blanes / Girona / Costa Brava" en Telegram y Facebook. Muchas familias comparten experiencias con TEA y ayudan con burocracia. Organizaciones como Autismo España + Junts Autisme pueden orientar sobre derechos y recursos para refugiados. Hay historias de apoyo específico a familias ucranianas con necesidades especiales.`;
    }

    // Global evidence-based default
    const ebp = globalKnowledge.find(k => k.id === 'ebp-28');
    return `${locContext}${attachContext}${ebp?.summary || 'Consulta las 28 prácticas basadas en evidencia de NCAEP (ncaep.fpg.unc.edu) y los módulos AFIRM gratuitos.'}\n\nPregúntame algo más específico sobre tu hijo, rutinas, o recursos en tu nueva ubicación. Puedo adaptar recomendaciones.`;
  };

  // Send message to AI (now supports attachments)
  const sendChatMessage = async () => {
    if (!chatInput.trim() && attachments.length === 0) return;

    const currentAttachments = [...attachments];
    const currentInput = chatInput.trim();

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput || (currentAttachments.length > 0 ? '[Вложение]' : ''),
      timestamp: new Date(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setAttachments([]); // Clear after sending
    setIsTyping(true);

    // Simulate thinking + generate contextual response (with attachments)
    setTimeout(() => {
      const aiResponseText = generateAIResponse(currentInput, currentLocation, currentAttachments);
      
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponseText,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Quick prompt buttons
  const quickPrompts = [
    "Recursos cerca de Blanes / Girona para un niño de 5 años",
    "Ideas de actividades diarias basadas en evidencia para TEA",
    "Resumen de tendencias 2026 en intervención temprana",
    "Apoyo para familias ucranianas/refugiadas con autismo en España"
  ];

  const useQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    // Auto-send after short delay for UX
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: Date.now(),
        role: 'user',
        content: prompt,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsTyping(true);

      setTimeout(() => {
        const aiResponseText = generateAIResponse(prompt, currentLocation);
        const aiMsg: ChatMessage = {
          id: Date.now() + 1,
          role: 'ai',
          content: aiResponseText,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 600);
    }, 100);
  };

  // Simple tracker save
  const saveTrackerEntry = () => {
    if (!trackerNotes.trim() && !trackerSkills.trim() && !trackerChallenges.trim()) {
      toast.error('Añade al menos una nota o observación.');
      return;
    }

    const newEntry: TrackerEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      notes: trackerNotes.trim(),
      skillsObserved: trackerSkills.trim(),
      challenges: trackerChallenges.trim()
    };

    const updated = [newEntry, ...trackerEntries].slice(0, 30); // Keep last 30
    setTrackerEntries(updated);
    localStorage.setItem('autismCompanionTracker', JSON.stringify(updated));

    // Clear form
    setTrackerNotes('');
    setTrackerSkills('');
    setTrackerChallenges('');

    toast.success('Entrada guardada. Estos registros serán muy valiosos para los especialistas cuando tengas cita.');
  };

  // Clear all data (for privacy / new location)
  const clearAllData = () => {
    if (!confirm('¿Borrar todos los datos locales (ubicación y tracker)? Esto no afecta al servidor.')) return;
    localStorage.removeItem('autismCompanionLocation');
    localStorage.removeItem('autismCompanionTracker');
    setCurrentLocation(defaultLocation);
    setTrackerEntries([]);
    setChatMessages([chatMessages[0]]); // Keep initial disclaimer
    toast.success('Datos locales borrados. La app está lista para nueva ubicación.');
  };

  // === NEW FEATURES: Voice dictation + File/Photo upload for AI chat ===

  // Voice dictation using Web Speech API (works in Chrome/Edge)
  const startDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Голосовой ввод не поддерживается в этом браузере. Рекомендуем Chrome или Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU'; // Можно поменять на 'uk-UA' для украинского
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => (prev + ' ' + transcript).trim());
      toast.success('Голос распознан');
    };

    recognition.onerror = (event: any) => {
      toast.error('Ошибка распознавания речи: ' + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);
      toast.info('Говорите... (на русском)');
    } catch (e) {
      toast.error('Не удалось запустить распознавание');
      setIsListening(false);
    }
  };

  // File / Photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newAttachments = files.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? ('image' as const) : ('file' as const),
        url,
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    toast.success(`Добавлено ${files.length} файл(ов). Они будут отправлены с сообщением.`);

    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (id: number) => {
    setAttachments(prev => {
      const toRemove = prev.find(a => a.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.url); // Clean up
      }
      return prev.filter(a => a.id !== id);
    });
  };

  // === REHAB PROGRAM HELPERS ===
  const filteredRehab = rehabCategory === 'all' 
    ? rehabActivities 
    : getActivitiesByCategory(rehabCategory);

  const generateAndSetDailyPlan = () => {
    const plan = generateDailyPlan(5);
    setDailyPlan(plan);
    toast.success('Сгенерирован план на сегодня! 5 упражнений как в спортзале.');
  };

  const addRehabToTracker = (activity: RehabActivity) => {
    const note = `Выполнено: ${activity.title} (${activity.duration}). Цель: ${activity.description}`;
    setTrackerNotes(prev => prev ? `${prev}\n${note}` : note);
    toast.success(`Добавлено в трекер: ${activity.title}. Заполните детали и сохраните.`);
    setActiveTab('tracker'); // Switch to tracker
  };

  const askAIAboutActivity = (activity: RehabActivity) => {
    const prompt = `Расскажи подробнее про упражнение "${activity.title}" для моего 5-летнего сына с подозрением на аутизм в Бланесе. Как адаптировать, сколько раз в неделю, и что делать если ребенок не хочет.`;
    setChatInput(prompt);
    setActiveTab('chat');
    toast.info('Переключено в чат. Нажмите отправить, чтобы спросить ИИ.');
  };

  // Update send to clear attachments after sending
  // (We'll handle in the send function below)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-zinc-900 text-xl font-semibold">🧭</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Compás TEA AI</h1>
              <p className="text-xs text-zinc-500 -mt-1">Компас по аутизму (TEA) с ИИ • Гибкая локация • Голос + фото</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button 
              onClick={clearAllData}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reiniciar datos
            </button>
            <div className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              Enfocado en Blanes + Global
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* STRONG DISCLAIMER */}
        <div className="disclaimer rounded-2xl p-5 mb-8 text-sm leading-relaxed">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>AVISO IMPORTANTE — LÉELO CADA VEZ QUE USES LA APP:</strong><br />
              Esta aplicación web es una herramienta de <strong>información general, apoyo práctico y organización</strong> para padres. 
              <strong>NO es un sustituto de diagnóstico médico, tratamiento, terapia ni consejo profesional.</strong> 
              El autismo requiere evaluación por especialistas cualificados (pediatra, neurólogo infantil, psicólogo clínico, logopeda, etc.).<br />
              Los recursos y recomendaciones se basan en fuentes públicas conocidas (Autismo España, NCAEP, CDC, ASAT, etc.) y deben verificarse siempre. 
              Como familia refugiada que puede mudarse, la app está diseñada para que introduzcas cualquier ubicación. 
              <strong>Actúa en paralelo contactando Atención Temprana en tu zona actual.</strong> El tiempo es valioso, pero la calidad profesional también.
            </div>
          </div>
        </div>

        {/* LOCATION SELECTOR - Core feature for refugees */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4" /> Ubicación actual (cámbiala cuando te mudes)
          </div>
          
          <div className="location-bar rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-1.5">Ciudad / Región actual</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateLocation()}
                placeholder="Ej: Blanes, Girona, Barcelona, Madrid, o cualquier ciudad donde estés ahora"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
              <p className="text-[10px] text-zinc-500 mt-1.5">Diseñado para familias que cambian de residencia frecuentemente. Funciona con cualquier texto.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={updateLocation}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Guardar ubicación
              </button>
              <button 
                onClick={resetToFlexible}
                className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm transition-colors"
              >
                Modo flexible
              </button>
            </div>
          </div>

          {isLocationSet && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Ubicación activa:</span> <span className="text-emerald-700 dark:text-emerald-400">{currentLocation}</span>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'chat' as const, label: 'Agente IA', icon: MessageCircle },
            { id: 'resources' as const, label: 'Recursos locales', icon: MapPin },
            { id: 'knowledge' as const, label: 'Base global + Tendencias', icon: BookOpen },
            { id: 'tracker' as const, label: 'Seguimiento diario', icon: ClipboardList },
            { id: 'rehab' as const, label: 'Программа реабилитации (Спортзал)', icon: Target },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-2xl text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* === CHAT / AI AGENT (Primary for user) === */}
        {activeTab === 'chat' && (
          <div className="max-w-3xl">
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Agente IA — Adaptado a tu ubicación + conocimiento global
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Pregunta en cualquier idioma. El agente tiene contexto de tu ubicación actual y la base global de autismo en niños.</p>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => useQuickPrompt(p)} className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                  {p.length > 55 ? p.substring(0,52) + '...' : p}
                </button>
              ))}
            </div>

            {/* Chat window */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl h-[520px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="chat-scroll">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`chat-message rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      
                      {/* Show attachments in user messages */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.attachments.map((att: any) => (
                            <div key={att.id} className="text-xs">
                              {att.type === 'image' ? (
                                <img src={att.url} alt={att.name} className="max-w-[120px] max-h-20 rounded border object-cover" />
                              ) : (
                                <div className="px-2 py-1 bg-white/20 rounded">📄 {att.name}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-[10px] opacity-50 mt-1.5 text-right">
                        {msg.timestamp.getHours().toString().padStart(2, '0')}:{msg.timestamp.getMinutes().toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="ai-message rounded-2xl px-4 py-3 text-sm">Pensando… (adaptando a {currentLocation})</div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {attachments.map((att) => (
                      <div key={att.id} className="relative flex items-center gap-2 bg-white dark:bg-zinc-800 border rounded-xl px-2 py-1 text-xs">
                        {att.type === 'image' ? (
                          <img src={att.url} alt={att.name} className="w-8 h-8 object-cover rounded" />
                        ) : (
                          <span className="text-lg">📄</span>
                        )}
                        <span className="max-w-[120px] truncate">{att.name}</span>
                        <button 
                          onClick={() => removeAttachment(att.id)} 
                          className="ml-1 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isTyping && sendChatMessage()}
                    placeholder="Напиши на русском/украинском: ресурсы в Бланесе, идеи занятий, анализ фото или сгенерируй текст для врача..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1"
                    disabled={isTyping}
                  />

                  {/* Voice dictation button */}
                  <button 
                    onClick={startDictation} 
                    disabled={isTyping || isListening}
                    className={`px-3 py-3 rounded-2xl border transition-colors flex items-center justify-center ${isListening ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    title="Надиктовать голосом (SpeechRecognition)"
                  >
                    🎤
                  </button>

                  {/* File / Photo upload */}
                  <label className="px-3 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center transition-colors" title="Загрузить фото или файл (для анализа ИИ)">
                    📎
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,.pdf,.txt,.doc,.docx" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  <button 
                    onClick={sendChatMessage} 
                    disabled={(!chatInput.trim() && attachments.length === 0) || isTyping}
                    className="px-6 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-50 text-white flex items-center justify-center transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] text-center text-zinc-400 mt-2">
                  Голос + фото/файлы поддерживаются. В демо ИИ "видит" вложения и даёт советы. Для настоящего vision (Claude/GPT-4o) или RAG подключим позже.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* === RESOURCES (Location filtered) === */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5" /> Recursos para: {currentLocation}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">Filtrados según tu ubicación actual. Siempre verifica los contactos y disponibilidad. Para Blanes priorizamos Cataluña/Girona + nacionales.</p>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <div key={res.id} className="resource-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="uppercase text-[10px] tracking-widest text-emerald-600 dark:text-emerald-500 mb-1">{res.type.toUpperCase()} • {res.location}</div>
                  <h3 className="font-semibold text-lg mb-2">{res.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{res.description}</p>
                  {res.contact && <p className="text-xs mb-1"><strong>Contacto:</strong> {res.contact}</p>}
                  {res.website && <a href={res.website} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mb-1">{res.website}</a>}
                  {res.notes && <p className="text-xs bg-zinc-100 dark:bg-zinc-950 p-2 rounded mt-2">{res.notes}</p>}
                  {res.languages && <div className="text-[10px] mt-2 text-zinc-500">Idiomas: {res.languages.join(' • ')}</div>}
                </div>
              )) : <p>No se encontraron recursos específicos. Prueba con otra ubicación o usa el chat.</p>}
            </div>

            <div className="mt-8 text-xs text-zinc-500">
              Para Blanes: Enfócate primero en Atención Temprana a través del sistema público de Girona y Junts Autisme (apoyo a familias en Cataluña). Usa el mapa de Autismo España para entidades cercanas.
            </div>
          </div>
        )}

        {/* === GLOBAL KNOWLEDGE + TRENDS === */}
        {activeTab === 'knowledge' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Base de conocimiento global (accesible desde cualquier lugar)</h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">Prácticas basadas en evidencia (NCAEP, ASAT, CDC y revisiones internacionales). El agente IA las usa para dar recomendaciones.</p>

            <div className="grid gap-4">
              {globalKnowledge.map(item => (
                <div key={item.id} className="knowledge-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{item.category}</div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    {item.link && <a href={item.link} target="_blank" className="text-xs text-blue-600">Ver fuente →</a>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{item.summary}</p>
                  <div className="text-[10px] mt-3 text-zinc-500">Fuente: {item.source}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-zinc-900 border rounded-2xl text-xs">
              <strong>Consejo:</strong> Las 28 prácticas de NCAEP + módulos AFIRM gratuitos son el estándar oro mundial para intervenciones en niños. Prioriza aquellas que se pueden implementar en casa con entrenamiento de padres. Revisa siempre ASAT para evaluar nuevas "terapias".
            </div>
          </div>
        )}

        {/* === TRACKER === */}
        {activeTab === 'tracker' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Seguimiento diario (registros para los médicos)</h2>
            <p className="text-sm mb-6 text-zinc-600 dark:text-zinc-400">Anota observaciones simples. Estos datos serán oro cuando consigas cita. Se guardan localmente en tu navegador.</p>

            <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-6 space-y-4">
              <div>
                <label className="text-xs text-zinc-500">Notas generales / Qué pasó hoy</label>
                <textarea value={trackerNotes} onChange={e => setTrackerNotes(e.target.value)} className="w-full mt-1 h-20 rounded-xl border p-3 text-sm" placeholder="Ej: Jugó 15 min turnos con bloques. Respondió a su nombre 2 veces..." />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Habilidades nuevas o mejoradas</label>
                <input value={trackerSkills} onChange={e => setTrackerSkills(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder="Ej: Dijo 'mamá' con intención, usó gesto para 'más'" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Desafíos o comportamientos a notar</label>
                <input value={trackerChallenges} onChange={e => setTrackerChallenges(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder="Ej: Mucha sensibilidad al ruido del mar hoy" />
              </div>

              <button onClick={saveTrackerEntry} className="w-full py-3 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-black transition-colors">Guardar entrada del día</button>
            </div>

            {trackerEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-3">Últimas entradas</h3>
                <div className="space-y-3">
                  {trackerEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="text-sm bg-white dark:bg-zinc-900 border rounded-2xl p-4">
                      <div className="text-xs text-zinc-500 mb-1">{entry.date}</div>
                      {entry.notes && <p><strong>Notas:</strong> {entry.notes}</p>}
                      {entry.skillsObserved && <p className="mt-1"><strong>Habilidades:</strong> {entry.skillsObserved}</p>}
                      {entry.challenges && <p className="mt-1 text-orange-600 dark:text-orange-400"><strong>Desafíos:</strong> {entry.challenges}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === REHAB PROGRAM (NEW: Онлайн "Спортзал" для реабилитации) === */}
        {activeTab === 'rehab' && (
          <div className="max-w-5xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3 mb-2">
                <Target className="w-7 h-7 text-emerald-600" /> 
                Онлайн-программа реабилитации (Домашний "Спортзал навыков" для TEA)
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Структура как в специализированных центрах: разные "упражнения" (игры и занятия), с описаниями, шагами и готовыми описаниями для картинок.
              </p>
            </div>

            {/* Strong Disclaimer */}
            <div className="disclaimer rounded-2xl p-5 mb-8 text-sm leading-relaxed">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>КРИТИЧЕСКИ ВАЖНО — ПРОЧИТАЙТЕ ПЕРЕД ИСПОЛЬЗОВАНИЕМ:</strong><br />
                  Эта программа — обобщение доказательных практик из реальных центров (ESDM, TEACCH, NCAEP 28 практик, сенсорная интеграция, логопедия и т.д.). 
                  Она <strong>НЕ ЗАМЕНЯЕТ</strong> профессиональную помощь, индивидуальную программу или консультацию специалистов. 
                  В Испании (Бланес/Жирона) обязательно обращайтесь в <strong>Atención Temprana</strong> через ваш CAP и в Fundació Junts Autisme. 
                  Начинайте с 10-15 минут, наблюдайте за ребенком. Если что-то вызывает стресс — остановитесь. 
                  Адаптируйте под вашего сына. Всегда консультируйтесь с врачами и терапевтами. Данные из публичных источников и могут меняться.
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6 text-sm leading-relaxed">
              <div className="whitespace-pre-wrap">{rehabIntro}</div>
              <p className="mt-3 text-xs text-zinc-500">Источники: NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España, Junts Autisme и практики европейских/американских центров раннего вмешательства.</p>
            </div>

            {/* Daily Plan Generator */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <button 
                onClick={generateAndSetDailyPlan}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-colors"
              >
                <Play className="w-5 h-5" /> Сгенерировать план на сегодня (5 упражнений)
              </button>
              <span className="text-sm text-zinc-500">Как в спортзале: разминка + основные навыки + игра.</span>
            </div>

            {dailyPlan.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-lg">Ваш план на сегодня</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {dailyPlan.map(act => (
                    <div key={act.id} className="bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-sm">
                      <div className="font-medium">{act.title}</div>
                      <div className="text-xs text-emerald-600 mt-1">{act.duration} • {act.category}</div>
                      <button onClick={() => addRehabToTracker(act)} className="mt-2 text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded">Добавить в трекер</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setRehabCategory('all')} className={`px-4 py-1.5 rounded-full text-sm border ${rehabCategory === 'all' ? 'bg-zinc-900 text-white' : 'border-zinc-300'}`}>Все</button>
              {rehabCategories.map(cat => (
                <button 
                  key={cat.key} 
                  onClick={() => setRehabCategory(cat.key as any)}
                  className={`px-4 py-1.5 rounded-full text-sm border flex items-center gap-1 ${rehabCategory === cat.key ? 'bg-zinc-900 text-white' : 'border-zinc-300'}`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Activities Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {filteredRehab.map(activity => (
                <div key={activity.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{activity.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-full whitespace-nowrap ml-2">{activity.duration}</span>
                  </div>

                  <div className="text-xs text-emerald-600 mb-3">{rehabCategories.find(c => c.key === activity.category)?.label}</div>

                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">{activity.description}</p>

                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">Материалы:</div>
                    <div className="text-sm">{activity.materials}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">Как делать (шаги):</div>
                    <ol className="text-sm list-decimal pl-4 space-y-0.5">
                      {activity.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ol>
                  </div>

                  {/* Visual / Picture section - "с картинками" */}
                  <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-2xl">
                    <div className="text-xs font-medium mb-1 flex items-center gap-1">🖼️ Визуал для картинки (скопируй и сгенерируй изображение):</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-snug">{activity.visualDescription}</div>
                    <div className="text-[10px] mt-1 text-emerald-600">Используйте Flux, Midjourney, Leonardo или любой генератор. Распечатайте для мотивации ребенка.</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium mb-1">Советы:</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{activity.tips}</div>
                  </div>

                  <div className="text-[10px] text-zinc-500 mb-3">Основа: {activity.evidence}</div>

                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => addRehabToTracker(activity)}
                      className="flex-1 px-4 py-2 text-sm rounded-2xl border border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                    >
                      Добавить в дневник
                    </button>
                    <button 
                      onClick={() => askAIAboutActivity(activity)}
                      className="flex-1 px-4 py-2 text-sm rounded-2xl bg-zinc-900 text-white hover:bg-black transition-colors"
                    >
                      Спросить ИИ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
              Программа собрана из практик реальных центров. Для Бланеса комбинируйте с местными службами (Atención Temprana, Junts Autisme). 
              Регулярность важнее идеальности. Отслеживайте прогресс в трекере и делитесь фото с ИИ для идей.
            </div>
          </div>
        )}

        {/* Footer / Upgrade info */}
        <div className="mt-12 pt-8 border-t text-xs text-zinc-500 dark:text-zinc-400 max-w-3xl">
          <p><strong>Actualización técnica:</strong> Esta es una aplicación web Next.js funcional con datos curados para Blanes + Cataluña + base global (NCAEP 28 prácticas, ASAT, CDC, Autismo España, Junts Autisme, etc.). El chat es un agente demo consciente de ubicación.</p>
          <p className="mt-2">Para versión completa con agente IA real (RAG sobre documentos globales + búsquedas web actualizadas, herramientas, workflows automáticos): conecta la interfaz a una API de LLM (Claude / GPT / Grok) o a un backend n8n (excelente para agentes agenticos + integraciones). Puedo ayudarte a añadir la ruta /api/chat o workflows de n8n en los siguientes pasos.</p>
          <p className="mt-2">Datos de Blanes/Cataluña basados en fuentes públicas conocidas (Autismo España, Junts Autisme, sistema de Atención Temprana). Siempre verifica y actualiza.</p>
        </div>
      </div>
    </div>
  );
}
