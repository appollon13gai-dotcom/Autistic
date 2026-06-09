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

// Simple i18n - default Russian, switchable to EN, UK, ES
const translations: Record<string, Record<string, string>> = {
  ru: {
    header_title: "Компас TEA AI",
    header_subtitle: "Компас по аутизму (TEA) с ИИ • Гибкая локация • Голос + фото",
    clear_data: "Очистить данные",
    focused_label: "Фокус: Глобальные лучшие практики + Локальная помощь",
    disclaimer_title: "ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ — ЧИТАЙТЕ КАЖДЫЙ РАЗ",
    disclaimer_text: "Это приложение — инструмент общей информации, практической поддержки и организации для родителей. НЕ заменяет медицинскую диагностику, лечение, терапию или профессиональную консультацию. Аутизм требует оценки квалифицированных специалистов (педиатр, детский невролог, клинический психолог, логопед и др.). Ресурсы и рекомендации основаны на публичных источниках (NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España и др.) и всегда должны проверяться. Как семья беженцев, которая может часто переезжать, приложение позволяет вводить любую локацию. Действуйте параллельно, обращаясь в местные службы ранней помощи.",
    location_label: "Текущая локация (меняйте при переезде)",
    location_placeholder: "Например: Бланес, Жирона, Барселона, Мадрид или любой город",
    save_location: "Сохранить локацию",
    flexible_mode: "Гибкий режим",
    tab_chat: "Агент ИИ",
    tab_resources: "Локальные ресурсы",
    tab_knowledge: "Глобальная база + Тренды",
    tab_tracker: "Ежедневный трекер",
    tab_rehab: "Глобальная программа реабилитации (Спортзал)",
    generate_plan: "Сгенерировать план на сегодня (5 упражнений)",
    printable_btn: "Printable Version / PDF Template",
    all_categories: "Все",
    // Add more as needed
  },
  en: {
    header_title: "Compás TEA AI",
    header_subtitle: "Autism (TEA) Compass with AI • Flexible location • Voice + photos",
    clear_data: "Clear data",
    focused_label: "Focus: Global best practices + Local support",
    disclaimer_title: "IMPORTANT DISCLAIMER — READ EVERY TIME",
    disclaimer_text: "This web app is a tool for general information, practical support, and organization for parents. It does NOT replace medical diagnosis, treatment, therapy, or professional advice. Autism requires evaluation by qualified specialists (pediatrician, child neurologist, clinical psychologist, speech therapist, etc.). Resources and recommendations are based on public sources (NCAEP, ASAT, CDC, ESDM, TEACCH, etc.) and must always be verified. As a refugee family that may move frequently, the app allows entering any location. Act in parallel by contacting local early intervention services.",
    location_label: "Current location (change when you move)",
    location_placeholder: "E.g.: Blanes, Girona, Barcelona, Madrid or any city",
    save_location: "Save location",
    flexible_mode: "Flexible mode",
    tab_chat: "AI Agent",
    tab_resources: "Local resources",
    tab_knowledge: "Global knowledge + Trends",
    tab_tracker: "Daily tracker",
    tab_rehab: "Global Rehab Program (Skills Gym)",
    generate_plan: "Generate today's plan (5 exercises)",
    printable_btn: "Printable Version / PDF Template",
    all_categories: "All",
  },
  uk: {
    header_title: "Compás TEA AI",
    header_subtitle: "Компас по аутизму (TEA) з ІІ • Гнучка локація • Голос + фото",
    clear_data: "Очистити дані",
    focused_label: "Фокус: Глобальні найкращі практики + Місцева допомога",
    disclaimer_title: "ВАЖЛИВЕ ПОПЕРЕДЖЕННЯ — ЧИТАЙТЕ КОЖНОГО РАЗУ",
    disclaimer_text: "Цей веб-додаток — інструмент загальної інформації, практичної підтримки та організації для батьків. НЕ замінює медичну діагностику, лікування, терапію чи професійну консультацію. Аутизм потребує оцінки кваліфікованих спеціалістів (педіатр, дитячий невролог, клінічний психолог, логопед тощо). Ресурси та рекомендації базуються на публічних джерелах (NCAEP, ASAT, CDC, ESDM, TEACCH тощо) і завжди мають перевірятися. Як сім'я біженців, яка може часто переїжджати, додаток дозволяє вводити будь-яку локацію. Дійте паралельно, звертаючись до місцевих служб ранньої допомоги.",
    location_label: "Поточна локація (змінюйте при переїзді)",
    location_placeholder: "Наприклад: Бланес, Жирона, Барселона, Мадрид або будь-яке місто",
    save_location: "Зберегти локацію",
    flexible_mode: "Гнучкий режим",
    tab_chat: "Агент ШІ",
    tab_resources: "Локальні ресурси",
    tab_knowledge: "Глобальна база + Тренди",
    tab_tracker: "Щоденний трекер",
    tab_rehab: "Глобальна програма реабілітації (Спортзал)",
    generate_plan: "Згенерувати план на сьогодні (5 вправ)",
    printable_btn: "Printable Version / PDF Template",
    all_categories: "Усі",
  },
  es: {
    header_title: "Compás TEA AI",
    header_subtitle: "Brújula TEA con IA • Ubicación flexible • Voz + fotos",
    clear_data: "Borrar datos",
    focused_label: "Enfoque: Mejores prácticas globales + Apoyo local",
    disclaimer_title: "AVISO IMPORTANTE — LÉELO CADA VEZ QUE USES LA APP",
    disclaimer_text: "Esta aplicación web es una herramienta de información general, apoyo práctico y organización para padres. NO sustituye diagnóstico médico, tratamiento, terapia ni consejo profesional. El autismo requiere evaluación por especialistas cualificados (pediatra, neurólogo infantil, psicólogo clínico, logopeda, etc.). Los recursos y recomendaciones se basan en fuentes públicas (NCAEP, ASAT, CDC, ESDM, TEACCH, etc.) y deben verificarse siempre. Como familia refugiada que puede mudarse frecuentemente, la app permite introducir cualquier ubicación. Actúa en paralelo contactando los servicios locales de atención temprana.",
    location_label: "Ubicación actual (cámbiala cuando te mudes)",
    location_placeholder: "Ej: Blanes, Girona, Barcelona, Madrid o cualquier ciudad",
    save_location: "Guardar ubicación",
    flexible_mode: "Modo flexible",
    tab_chat: "Agente IA",
    tab_resources: "Recursos locales",
    tab_knowledge: "Base global + Tendencias",
    tab_tracker: "Seguimiento diario",
    tab_rehab: "Programa global de rehabilitación (Gimnasio de habilidades)",
    generate_plan: "Generar plan de hoy (5 ejercicios)",
    printable_btn: "Printable Version / PDF Template",
    all_categories: "Todos",
  },
};

// Helper to get translated string
function t(lang: string, key: string): string {
  return (translations[lang] && translations[lang][key]) || translations['ru'][key] || key;
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
      content: `Привет! Я твой ИИ-ассистент по поддержке семей с аутизмом (подозрение на TEA). По умолчанию настроен на глобальные лучшие практики (ESDM, TEACCH, NCAEP и программы ведущих центров мира). Ты можешь ввести любую локацию (идеально для семей, которые часто переезжают).\n\nЯ могу помочь с:\n• Локальными ресурсами (включая Испанию)\n• Глобальной базой знаний (доказательные практики)\n• Идеями ежедневных занятий для ребенка 5 лет\n• Полноценной онлайн-программой реабилитации («Спортзал навыков» с упражнениями, шагами и описаниями для картинок)\n• Обзорами трендов и вмешательств\n\n**ВАЖНО (читай каждый раз):** Это общая информация и практическая поддержка. НЕ заменяет диагностику, лечение или консультацию специалистов. Аутизм требует оценки квалифицированных врачей. Ресурсы основаны на публичных источниках и всегда должны проверяться. Действуй параллельно, обращаясь в местные службы ранней помощи.`,
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
  const [showPrintableRehab, setShowPrintableRehab] = useState(false);

  // Language state - default Russian as requested, persisted in localStorage
  const [lang, setLang] = useState<'ru' | 'en' | 'uk' | 'es'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appLang');
      if (saved && ['ru', 'en', 'uk', 'es'].includes(saved)) {
        return saved as 'ru' | 'en' | 'uk' | 'es';
      }
    }
    return 'ru';
  });

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

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLang', lang);
    }
  }, [lang]);

  // Save location
  const updateLocation = () => {
    if (!locationInput.trim()) {
      toast.error('Пожалуйста, введите локацию (например: Бланес, Жирона или любой город)');
      return;
    }
    const newLoc = locationInput.trim();
    setCurrentLocation(newLoc);
    localStorage.setItem('autismCompanionLocation', newLoc);
    setIsLocationSet(true);
    setLocationInput('');
    toast.success(`Локация обновлена: ${newLoc}. Ресурсы и агент ИИ адаптируются.`);
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

    toast.success('Запись сохранена. Эти заметки будут очень ценны для специалистов, когда у вас будет приём.');
  };

  // Clear all data (for privacy / new location)
  const clearAllData = () => {
    if (!confirm('Очистить все локальные данные (локацию и трекер)? Это не затронет сервер.')) return;
    localStorage.removeItem('autismCompanionLocation');
    localStorage.removeItem('autismCompanionTracker');
    setCurrentLocation(defaultLocation);
    setTrackerEntries([]);
    setChatMessages([chatMessages[0]]); // Keep initial disclaimer
    toast.success('Локальные данные очищены. Приложение готово к новой локации.');
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
    recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : lang === 'es' ? 'es-ES' : 'en-US';
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
      const langLabel = lang === 'ru' ? 'русском' : lang === 'uk' ? 'українській' : lang === 'es' ? 'español' : 'English';
      toast.info(`Говорите... (на ${langLabel})`);
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
              <h1 className="text-2xl font-semibold tracking-tight">{t(lang, 'header_title')}</h1>
              <p className="text-xs text-zinc-500 -mt-1 flex items-center gap-1">
                {t(lang, 'header_subtitle')} 
                <span className="text-lg">🦕</span> 
                <span className="font-medium text-emerald-600">Рэкс-Исследователь • Флаги: 47/195</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {/* Language switcher - default Russian */}
            <div className="flex gap-1 text-xs">
              {(['ru','en','uk','es'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded ${lang === l ? 'bg-zinc-900 text-white' : 'border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                  title={l === 'ru' ? 'Русский (по умолчанию)' : l === 'en' ? 'English' : l === 'uk' ? 'Українська' : 'Español'}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button 
              onClick={clearAllData}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> {t(lang, 'clear_data')}
            </button>
            <div className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              {t(lang, 'focused_label')}
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
              <strong>{t(lang, 'disclaimer_title')}</strong><br />
              {t(lang, 'disclaimer_text')}
            </div>
          </div>
        </div>

        {/* LOCATION SELECTOR - Core feature for refugees */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-4 h-4" /> {t(lang, 'location_label')}
          </div>
          
          <div className="location-bar rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs uppercase tracking-widest text-zinc-500 block mb-1.5">{t(lang, 'location_label')}</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateLocation()}
                placeholder={t(lang, 'location_placeholder')}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
              <p className="text-[10px] text-zinc-500 mt-1.5">Разработано для семей, которые часто меняют место жительства. Работает с любым текстом.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={updateLocation}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" /> {t(lang, 'save_location')}
              </button>
              <button 
                onClick={resetToFlexible}
                className="px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm transition-colors"
              >
                {t(lang, 'flexible_mode')}
              </button>
            </div>
          </div>

          {isLocationSet && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Активная локация:</span> <span className="text-emerald-700 dark:text-emerald-400">{currentLocation}</span>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'chat' as const, label: t(lang, 'tab_chat'), icon: MessageCircle },
            { id: 'resources' as const, label: t(lang, 'tab_resources'), icon: MapPin },
            { id: 'knowledge' as const, label: t(lang, 'tab_knowledge'), icon: BookOpen },
            { id: 'tracker' as const, label: t(lang, 'tab_tracker'), icon: ClipboardList },
            { id: 'rehab' as const, label: t(lang, 'tab_rehab'), icon: Target },
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
                    <div className="ai-message rounded-2xl px-4 py-3 text-sm">Думаю… (адаптирую к {currentLocation})</div>
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
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5" /> Ресурсы для: {currentLocation}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">Отфильтрованы по вашей текущей локации. Всегда проверяйте контакты и доступность. Для Бланеса приоритет — Каталония/Жирона + национальные.</p>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <div key={res.id} className="resource-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="uppercase text-[10px] tracking-widest text-emerald-600 dark:text-emerald-500 mb-1">{res.type.toUpperCase()} • {res.location}</div>
                  <h3 className="font-semibold text-lg mb-2">{res.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{res.description}</p>
                  {res.contact && <p className="text-xs mb-1"><strong>Контакт:</strong> {res.contact}</p>}
                  {res.website && <a href={res.website} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mb-1">{res.website}</a>}
                  {res.notes && <p className="text-xs bg-zinc-100 dark:bg-zinc-950 p-2 rounded mt-2">{res.notes}</p>}
                  {res.languages && <div className="text-[10px] mt-2 text-zinc-500">Языки: {res.languages.join(' • ')}</div>}
                </div>
              )) : <p>Не найдено конкретных ресурсов. Попробуйте другую локацию или используйте чат.</p>}
            </div>

            <div className="mt-8 text-xs text-zinc-500">
              Для Бланеса: Сначала сосредоточьтесь на Atención Temprana через государственную систему Жироны и Junts Autisme (поддержка семей в Каталонии). Используйте карту Autismo España для ближайших организаций.
            </div>
          </div>
        )}

        {/* === GLOBAL KNOWLEDGE + TRENDS === */}
        {activeTab === 'knowledge' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Глобальная база знаний (доступно из любого места)</h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">Практики, основанные на доказательствах (NCAEP, ASAT, CDC и международные обзоры). Агент ИИ использует их для рекомендаций.</p>

            <div className="grid gap-4">
              {globalKnowledge.map(item => (
                <div key={item.id} className="knowledge-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{item.category}</div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    {item.link && <a href={item.link} target="_blank" className="text-xs text-blue-600">Посмотреть источник →</a>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{item.summary}</p>
                  <div className="text-[10px] mt-3 text-zinc-500">Источник: {item.source}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-zinc-900 border rounded-2xl text-xs">
              <strong>Совет:</strong> 28 практик NCAEP + бесплатные модули AFIRM — мировой золотой стандарт для вмешательств у детей. Приоритет тем, которые можно реализовать дома с обучением родителей. Всегда проверяйте ASAT для оценки новых "терапий".
            </div>
          </div>
        )}

        {/* === TRACKER === */}
        {activeTab === 'tracker' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Ежедневный трекер (записи для врачей)</h2>
            <p className="text-sm mb-6 text-zinc-600 dark:text-zinc-400">Записывайте простые наблюдения. Эти данные будут золотом, когда получите приём. Сохраняются локально в вашем браузере.</p>

            <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-6 space-y-4">
              <div>
                <label className="text-xs text-zinc-500">Общие заметки / Что произошло сегодня</label>
                <textarea value={trackerNotes} onChange={e => setTrackerNotes(e.target.value)} className="w-full mt-1 h-20 rounded-xl border p-3 text-sm" placeholder="Напр.: Играл 15 мин с блоками по очереди. Откликался на имя 2 раза..." />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Новые или улучшенные навыки</label>
                <input value={trackerSkills} onChange={e => setTrackerSkills(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder="Напр.: Сказал 'мама' с намерением, использовал жест для 'ещё'" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Вызовы или поведение, которое стоит отметить</label>
                <input value={trackerChallenges} onChange={e => setTrackerChallenges(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder="Напр.: Сильная чувствительность к шуму моря сегодня" />
              </div>

              <button onClick={saveTrackerEntry} className="w-full py-3 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-black transition-colors">Сохранить запись за день</button>
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
                ГЛОБАЛЬНАЯ ЛУЧШАЯ ПРОГРАММА РЕАБИЛИТАЦИИ (Онлайн "Спортзал навыков" TEA)
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Основана на самых эффективных мировых методиках (ESDM, TEACCH, NCAEP 28 практик, parent coaching из топ-центров). Структура как в лучших спеццентрах: разминка, станции навыков, игры. 
                <strong>Испания:</strong> Используй эту глобальную программу дома + местную помощь (см. ниже).
              </p>
            </div>

            {/* Strong Disclaimer */}
            <div className="disclaimer rounded-2xl p-5 mb-8 text-sm leading-relaxed">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>КРИТИЧЕСКИ ВАЖНО — ПРОЧИТАЙТЕ ПЕРЕД ИСПОЛЬЗОВАНИЕМ:</strong><br />
                  Это ГЛОБАЛЬНАЯ программа на основе лучших доказательных методик мира (ESDM, TEACCH, NCAEP 28 практик, parent coaching из топ-центров вроде Hopebridge/Lighthouse). 
                  Она <strong>НЕ ЗАМЕНЯЕТ</strong> диагноз, индивидуальную программу или специалистов. 
                  <strong>Испания (твой контекст):</strong> Используй глобальную программу дома ежедневно + обязательно обращайся за местной помощью (Atención Temprana через CAP в Бланесе/Girona, Junts Autisme, Autismo España). 
                  Начинай с 10-15 мин, наблюдай. Если distress — стоп. Адаптируй. Консультируйся всегда с врачами. Данные публичные, центры индивидуализируют.
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
                <Play className="w-5 h-5" /> {t(lang, 'generate_plan')}
              </button>
              <span className="text-sm text-zinc-500">Как в спортзале: разминка + основные навыки + игра.</span>
              <button 
                onClick={() => setShowPrintableRehab(true)}
                className="ml-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium no-print"
              >
                {t(lang, 'printable_btn')}
              </button>
            </div>

            {dailyPlan.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-lg">Ваш план на сегодня</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {dailyPlan.map(act => (
                    <div key={act.id} className="bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-sm border-l-4 border-[var(--theme-accent)]">
                      <div className="font-medium flex items-center gap-2">🇺🇳 {act.title}</div>
                      <div className="text-xs text-emerald-600 mt-1">{act.duration} • {act.category}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Цель: освоить флаг/страну как Рэкс!</div>
                      <button onClick={() => addRehabToTracker(act)} className="mt-2 text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded">Добавить в трекер</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setRehabCategory('all')} className={`px-4 py-1.5 rounded-full text-sm border ${rehabCategory === 'all' ? 'bg-zinc-900 text-white' : 'border-zinc-300'}`}>{t(lang, 'all_categories')}</button>
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
                <div key={activity.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex flex-col border-l-4" style={{borderLeftColor: 'var(--theme-accent)'}}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight">🇺🇳 {activity.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-full whitespace-nowrap ml-2">{activity.duration}</span>
                  </div>

                  <div className="text-xs text-emerald-600 mb-3 flex items-center gap-1">{rehabCategories.find(c => c.key === activity.category)?.label} <span className="text-base">🗺️</span></div>

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
                    <div className="text-xs font-medium mb-1 flex items-center gap-1">🖼️ Визуал для картинки (флаги + карта + Рэкс; скопируй и сгенерируй изображение):</div>
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

            {/* Printable / PDF Template Overlay */}
            {showPrintableRehab && (
              <div className="fixed inset-0 bg-white z-[100] overflow-auto p-8 printable-rehab no-print">
                <div className="max-w-[210mm] mx-auto"> {/* A4 width approx */}
                  <div className="flex justify-between items-center mb-6 no-print">
                    <h1 className="text-2xl font-bold flex items-center gap-2">{t(lang, 'tab_rehab')} — Printable / PDF Template <span className="text-3xl">🇺🇳🗺️</span></h1>
                    <div>
                      <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">Print / Save as PDF</button>
                      <button onClick={() => setShowPrintableRehab(false)} className="px-4 py-2 border rounded">Close</button>
                    </div>
                  </div>

                  <div className="mb-6 text-xs border p-3">
                    <strong>Важно:</strong> Это информационная программа на основе лучших мировых доказательных практик (ESDM, TEACCH, NCAEP). Не заменяет специалистов. Используйте в дополнение к профессиональной помощи. В Испании комбинируйте с Atención Temprana.
                  </div>

                  <h2 className="text-xl font-semibold mb-4">Ваш ежедневный "спортзал" навыков (пример плана)</h2>
                  {dailyPlan.length > 0 ? (
                    <div className="mb-8">
                      {dailyPlan.map((act, idx) => (
                        <div key={idx} className="activity-card mb-4 p-3 border">
                          <strong>{act.title}</strong> ({act.duration})<br />
                          <em>Цель:</em> {act.description}<br />
                          <strong>Шаги:</strong> {act.steps.join(' ')}<br />
                          <strong>Материалы:</strong> {act.materials}<br />
                          <div className="visual-placeholder my-2 text-center text-xs border-dashed border-2 border-[var(--theme-accent)]"> [Вставьте здесь сгенерированную картинку: Рэкс + флаг страны + карта мира. {act.visualDescription}] </div>
                          <em>Советы:</em> {act.tips}
                        </div>
                      ))}
                    </div>
                  ) : <p>Сгенерируйте план в основной вкладке перед печатью.</p>}

                  <h2 className="text-xl font-semibold mb-4 mt-8">Полный список упражнений по категориям</h2>
                  {rehabCategories.map(cat => {
                    const acts = getActivitiesByCategory(cat.key);
                    if (acts.length === 0) return null;
                    return (
                      <div key={cat.key} className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">{cat.icon} {cat.label}</h3>
                        {acts.map(act => (
                          <div key={act.id} className="activity-card mb-3 p-3 border text-sm">
                            <strong>{act.title}</strong> — {act.duration}<br />
                            <em>Описание:</em> {act.description}<br />
                            <strong>Шаги:</strong><br />
                            {act.steps.map((s,i) => <div key={i}>{s}</div>)}<br />
                            <strong>Материалы:</strong> {act.materials}<br />
                            <div className="visual-placeholder my-1 text-xs"> [Картинка: {act.visualDescription}] </div>
                            <em>Советы:</em> {act.tips} (Основа: {act.evidence})
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="mt-8 text-xs">
                    <strong>Как использовать шаблон:</strong> Распечатайте или сохраните как PDF. Добавляйте свои картинки по визуальным описаниям. Отмечайте выполнение. Адаптируйте под ребенка. 
                    Полная версия с интерактивом — в приложении.
                  </div>
                </div>
              </div>
            )}

            {/* Spain Local Context (secondary, as requested) */}
            <div className="mt-10 p-6 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800 rounded-2xl">
              <h3 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">Испания / Локальная помощь (Бланес, Каталония — твой контекст)</h3>
              <p className="text-sm mb-4">Используй ГЛОБАЛЬНУЮ программу выше как основу дома. Параллельно получай местную поддержку:</p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>Atención Temprana (ранняя помощь до 6 лет)</strong>: Часто доступна даже без полного диагноза. Обратись в местный CAP (поликлиника) в Бланесе или региональные службы Girona. Многопрофильная (логопед, OT, психолог). Бесплатно/низкая стоимость.</li>
                <li><strong>Fundació Junts Autisme (Каталония)</strong>: Поддержка семей, навигация по системе, эмоциональная помощь, советы по ресурсам и образованию. Тел: 931 808 926, email: info@juntsautisme.org, сайт: juntsautisme.org.</li>
                <li><strong>Autismo España + локальные</strong>: Национальная конфедерация с картой организаций. Ищи по Girona/Barcelona (близко к Бланесу). Инфо, advocacy, ресурсы: autismo.org.es.</li>
                <li><strong>Другое</strong>: Гранты/помощь часто привязаны к уровню диагноза (1-3). Школы с поддержкой включения. Проблемы в Испании: задержки диагностики (средний ~5 лет), переполненность центров, funding issues.</li>
                <li><strong>Как комбинировать</strong>: Делай глобальную программу ежедневно дома (20-40 мин). Используй местные службы для оценки, индивидуальной терапии и поддержки. Треки прогресса в приложении — показывай специалистам.</li>
              </ul>
              <p className="text-xs mt-3 text-zinc-500">Источники: autismo.org.es, juntsautisme.org, государственные данные (долгие очереди, фокус на ранней помощи). Проверяй актуальность.</p>
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
