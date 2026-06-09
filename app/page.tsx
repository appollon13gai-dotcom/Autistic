"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, MessageCircle, BookOpen, TrendingUp, ClipboardList, AlertTriangle, Send, RefreshCw, Play, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { resources, globalKnowledge, getResourcesForLocation, defaultLocation, localize, type Resource, type GlobalKnowledge } from '@/lib/data';
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
    header_title: "NeuralPath TEA AI",
    header_subtitle: "NeuralPath по аутизму (TEA) с ИИ • Гибкая локация • Голос + фото",
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
    printable_btn: "Версия для печати / PDF шаблон",
    all_categories: "Все",
    active_location: "Активная локация:",
    location_footer: "Разработано для семей, которые часто меняют место жительства. Работает с любым текстом.",
    chat_title: "Агент ИИ — Адаптирован к вашей локации + глобальные знания",
    chat_subtitle: "Задавайте вопросы на любом языке. Агент знает вашу текущую локацию и глобальную базу знаний об аутизме.",
    quick_1: "Ресурсы рядом с Бланесом / Жироной для ребёнка 5 лет",
    quick_2: "Идеи ежедневных занятий на основе доказательств для РАС",
    quick_3: "Тренды 2026 в области раннего вмешательства",
    quick_4: "Поддержка украинских / беженских семей с аутизмом в Испании",
    ai_thinking: "Думаю…",
    chat_placeholder: "Напишите на любом языке: ресурсы, идеи занятий, помощь с документами...",
    chat_footer: "Голос + фото/файлы поддерживаются. В демо ИИ «видит» вложения и даёт советы.",
    voice_tooltip: "Надиктовать голосом",
    upload_tooltip: "Загрузить фото или файл",
    resources_title: "Ресурсы для:",
    resources_subtitle: "Отфильтрованы по вашей текущей локации. Всегда проверяйте контакты и доступность.",
    resources_contact: "Контакт:",
    resources_languages: "Языки:",
    resources_empty: "Не найдено конкретных ресурсов. Попробуйте другую локацию или используйте чат.",
    resources_footer: "Для Бланеса: Сначала сосредоточьтесь на Atención Temprana через государственную систему Жироны и Junts Autisme (поддержка семей в Каталонии). Используйте карту Autismo España для ближайших организаций.",
    knowledge_title: "Глобальная база знаний (доступна из любого места)",
    knowledge_subtitle: "Практики, основанные на доказательствах (NCAEP, ASAT, CDC и международные обзоры). Агент ИИ использует их для рекомендаций.",
    knowledge_source: "Посмотреть источник →",
    knowledge_tip: "Совет: 28 практик NCAEP + бесплатные модули AFIRM — мировой золотой стандарт для вмешательств у детей. Приоритет тем, которые можно реализовать дома с обучением родителей. Всегда проверяйте ASAT для оценки новых «терапий».",
    tracker_title: "Ежедневный трекер (записи для врачей)",
    tracker_subtitle: "Записывайте простые наблюдения. Эти данные будут золотом, когда получите приём. Сохраняются локально в вашем браузере.",
    tracker_notes_label: "Общие заметки / Что произошло сегодня",
    tracker_notes_ph: "Напр.: Играл 15 мин с блоками по очереди. Откликался на имя 2 раза...",
    tracker_skills_label: "Новые или улучшенные навыки",
    tracker_skills_ph: "Напр.: Сказал «мама» с намерением, использовал жест для «ещё»",
    tracker_challenges_label: "Вызовы или поведение, которое стоит отметить",
    tracker_challenges_ph: "Напр.: Сильная чувствительность к шуму моря сегодня",
    tracker_save: "Сохранить запись за день",
    tracker_recent: "Последние записи",
    tracker_label_notes: "Заметки:",
    tracker_label_skills: "Навыки:",
    tracker_label_challenges: "Вызовы:",
    rehab_title: "ГЛОБАЛЬНАЯ ЛУЧШАЯ ПРОГРАММА РЕАБИЛИТАЦИИ (Онлайн «Спортзал навыков» TEA)",
    rehab_subtitle: "Основана на самых эффективных мировых методиках (ESDM, TEACCH, NCAEP 28 практик, parent coaching из топ-центров). Структура как в лучших спеццентрах: разминка, станции навыков, игры.",
    rehab_disclaimer_title: "КРИТИЧЕСКИ ВАЖНО — ПРОЧИТАЙТЕ ПЕРЕД ИСПОЛЬЗОВАНИЕМ:",
    rehab_disclaimer_text: "Это ГЛОБАЛЬНАЯ программа на основе лучших доказательных методик мира (ESDM, TEACCH, NCAEP 28 практик, parent coaching из топ-центров вроде Hopebridge/Lighthouse). Она НЕ ЗАМЕНЯЕТ диагноз, индивидуальную программу или специалистов. Испания (твой контекст): Используй глобальную программу дома ежедневно + обязательно обращайся за местной помощью (Atención Temprana через CAP в Бланесе/Girona, Junts Autisme, Autismo España). Начинай с 10-15 мин, наблюдай. Если distress — стоп. Адаптируй. Консультируйся всегда с врачами.",
    rehab_sources: "Источники: NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España, Junts Autisme и практики европейских/американских центров раннего вмешательства.",
    rehab_gym_desc: "Как в спортзале: разминка + основные навыки + игра.",
    rehab_daily_title: "Ваш план на сегодня",
    rehab_goal_prefix: "Цель: освоить флаг/страну как Рэкс!",
    rehab_add_tracker_btn: "Добавить в трекер",
    rehab_materials: "Материалы:",
    rehab_steps: "Как делать (шаги):",
    rehab_visual_title: "🖼️ Визуал для картинки (флаги + карта + Рэкс; скопируй и сгенерируй изображение):",
    rehab_visual_gen: "Используйте Flux, Midjourney, Leonardo или любой генератор. Распечатайте для мотивации ребёнка.",
    rehab_tips: "Советы:",
    rehab_evidence: "Основа:",
    rehab_add_journal: "Добавить в дневник",
    rehab_ask_ai: "Спросить ИИ",
    rehab_footer: "Программа собрана из практик реальных центров. Для Бланеса комбинируйте с местными службами (Atención Temprana, Junts Autisme). Регулярность важнее идеальности. Отслеживайте прогресс в трекере и делитесь фото с ИИ для идей.",
    spain_title: "Испания / Локальная помощь (Бланес, Каталония)",
    spain_subtitle: "Используй ГЛОБАЛЬНУЮ программу выше как основу дома. Параллельно получай местную поддержку:",
    spain_footer: "Источники: autismo.org.es, juntsautisme.org, государственные данные. Проверяй актуальность.",
    footer_p1: "Техническое примечание: Это функциональное приложение Next.js с тщательно подобранными данными для Бланеса + Каталонии + глобальной базой (NCAEP 28 практик, ASAT, CDC, Autismo España, Junts Autisme и др.). Чат — демо-агент с учётом локации.",
    footer_p2: "Для полной версии с настоящим ИИ-агентом (RAG по глобальным документам + обновлённые веб-поиски, инструменты, автоматические рабочие процессы): подключите интерфейс к API LLM (Claude / GPT / Grok) или бэкенду n8n.",
    footer_p3: "Данные по Бланесу/Каталонии основаны на публичных источниках (Autismo España, Junts Autisme, система Atención Temprana). Всегда проверяйте и обновляйте.",
    toast_location_empty: "Пожалуйста, введите локацию (например: Бланес, Жирона или любой город)",
    toast_location_saved: "Локация обновлена: {loc}. Ресурсы и агент ИИ адаптируются.",
    toast_flexible: "Гибкий режим активирован. Введите любой город/регион при смене места жительства.",
    toast_tracker_empty: "Добавьте хотя бы одну заметку или наблюдение.",
    toast_tracker_saved: "Запись сохранена. Эти заметки будут очень ценны для специалистов.",
    toast_data_cleared: "Локальные данные очищены. Приложение готово к новой локации.",
    toast_voice_unsupported: "Голосовой ввод не поддерживается в этом браузере. Рекомендуем Chrome или Edge.",
    toast_voice_recognized: "Голос распознан",
    toast_voice_error: "Ошибка распознавания речи: ",
    toast_voice_failed: "Не удалось запустить распознавание",
    toast_speaking: "Говорите…",
    toast_files_added: "Добавлено {n} файл(ов). Они будут отправлены с сообщением.",
    toast_plan_generated: "Сгенерирован план на сегодня! 5 упражнений как в спортзале.",
    toast_added_tracker: "Добавлено в трекер: {title}. Заполните детали и сохраните.",
    toast_chat_info: "Переключено в чат. Нажмите отправить, чтобы спросить ИИ.",
    confirm_clear: "Очистить все локальные данные (локацию и трекер)? Это не затронет сервер.",
    printable_close: "Закрыть",
    printable_print: "Печать / Сохранить как PDF",
    printable_disclaimer: "Важно: Это информационная программа на основе лучших мировых доказательных практик (ESDM, TEACCH, NCAEP). Не заменяет специалистов. Используйте в дополнение к профессиональной помощи. В Испании комбинируйте с Atención Temprana.",
    printable_daily_title: "Ваш ежедневный «спортзал» навыков (пример плана)",
    printable_generate_first: "Сгенерируйте план в основной вкладке перед печатью.",
    printable_full_list: "Полный список упражнений по категориям",
    printable_how_to: "Как использовать шаблон: Распечатайте или сохраните как PDF. Добавляйте свои картинки по визуальным описаниям. Отмечайте выполнение. Адаптируйте под ребёнка. Полная версия с интерактивом — в приложении.",
    printable_steps: "Шаги:",
    printable_materials: "Материалы:",
    printable_tips: "Советы:",
    printable_desc: "Описание:",
    attach_label: "[Вложение]",
    lang_spanish: "испанский",
    lang_catalan: "каталанский",
    lang_ukrainian: "украинский",
    lang_russian: "русский",
    lang_english: "английский",
    resources_source: "Источник:",
  },
  en: {
    header_title: "NeuralPath ASD AI",
    header_subtitle: "NeuralPath for autism (ASD) with AI • Flexible location • Voice + photos",
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
    active_location: "Active location:",
    location_footer: "Designed for families who move often. Works with any text.",
    chat_title: "AI Agent — Adapted to your location + global knowledge",
    chat_subtitle: "Ask in any language. The agent has context of your current location and the global autism knowledge base.",
    quick_1: "Resources near Blanes / Girona for a 5-year-old",
    quick_2: "Evidence-based daily activity ideas for ASD",
    quick_3: "2026 trends in early intervention",
    quick_4: "Support for Ukrainian/refugee families with autism in Spain",
    ai_thinking: "Thinking…",
    chat_placeholder: "Ask in any language: resources, activity ideas, help with documents...",
    chat_footer: "Voice + photos/files supported. In demo mode the AI 'sees' attachments and gives suggestions.",
    voice_tooltip: "Voice dictation",
    upload_tooltip: "Upload photo or file",
    resources_title: "Resources for:",
    resources_subtitle: "Filtered by your current location. Always verify contacts and availability.",
    resources_contact: "Contact:",
    resources_languages: "Languages:",
    resources_empty: "No specific resources found. Try a different location or use the chat.",
    resources_footer: "For Blanes: Focus first on Atención Temprana through Girona's public system and Junts Autisme (family support in Catalonia). Use the Autismo España map for nearby organizations.",
    knowledge_title: "Global Knowledge Base (accessible from anywhere)",
    knowledge_subtitle: "Evidence-based practices (NCAEP, ASAT, CDC and international reviews). The AI agent uses these for recommendations.",
    knowledge_source: "View source →",
    knowledge_tip: "Tip: NCAEP's 28 practices + free AFIRM modules are the world gold standard for child interventions. Prioritize those that can be implemented at home with parent training. Always check ASAT to evaluate new 'therapies'.",
    tracker_title: "Daily Tracker (notes for doctors)",
    tracker_subtitle: "Record simple observations. These notes will be invaluable when you get an appointment. Stored locally in your browser.",
    tracker_notes_label: "General notes / What happened today",
    tracker_notes_ph: "E.g.: Played 15 min with blocks taking turns. Responded to name 2 times...",
    tracker_skills_label: "New or improved skills",
    tracker_skills_ph: "E.g.: Said 'mama' with intent, used gesture for 'more'",
    tracker_challenges_label: "Challenges or behaviours worth noting",
    tracker_challenges_ph: "E.g.: Strong sensitivity to sea noise today",
    tracker_save: "Save today's entry",
    tracker_recent: "Recent entries",
    tracker_label_notes: "Notes:",
    tracker_label_skills: "Skills:",
    tracker_label_challenges: "Challenges:",
    rehab_title: "GLOBAL BEST REHAB PROGRAM (Online ASD 'Skills Gym')",
    rehab_subtitle: "Based on the world's most effective methods (ESDM, TEACCH, NCAEP 28 practices, parent coaching from top centres). Structure like the best specialist centres: warm-up, skill stations, play.",
    rehab_disclaimer_title: "CRITICALLY IMPORTANT — READ BEFORE USE:",
    rehab_disclaimer_text: "This is a GLOBAL program based on the world's best evidence-based methods (ESDM, TEACCH, NCAEP 28 practices, parent coaching from top centres like Hopebridge/Lighthouse). It does NOT REPLACE diagnosis, individual programme, or specialists. Spain (your context): Use the global programme daily at home + always seek local support (Atención Temprana via CAP in Blanes/Girona, Junts Autisme, Autismo España). Start with 10-15 min, observe. If distress — stop. Adapt. Always consult doctors.",
    rehab_sources: "Sources: NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España, Junts Autisme and European/American early intervention centres.",
    rehab_gym_desc: "Like a gym: warm-up + core skills + play.",
    rehab_daily_title: "Your plan for today",
    rehab_goal_prefix: "Goal: explore a flag/country like Rex!",
    rehab_add_tracker_btn: "Add to tracker",
    rehab_materials: "Materials:",
    rehab_steps: "How to do it (steps):",
    rehab_visual_title: "🖼️ Visual for picture card (flags + map + Rex; copy and generate image):",
    rehab_visual_gen: "Use Flux, Midjourney, Leonardo or any generator. Print for child motivation.",
    rehab_tips: "Tips:",
    rehab_evidence: "Based on:",
    rehab_add_journal: "Add to journal",
    rehab_ask_ai: "Ask AI",
    rehab_footer: "Programme compiled from real centre practices. For Blanes combine with local services (Atención Temprana, Junts Autisme). Consistency matters more than perfection. Track progress and share photos with the AI for ideas.",
    spain_title: "Spain / Local support (Blanes, Catalonia)",
    spain_subtitle: "Use the GLOBAL programme above as your home foundation. In parallel, get local support:",
    spain_footer: "Sources: autismo.org.es, juntsautisme.org, public data. Always verify.",
    footer_p1: "Technical note: This is a functional Next.js app with curated data for Blanes + Catalonia + global base (NCAEP 28 practices, ASAT, CDC, Autismo España, Junts Autisme, etc.). The chat is a location-aware demo agent.",
    footer_p2: "For a full version with a real AI agent (RAG over global docs + updated web searches, tools, automated workflows): connect the interface to an LLM API (Claude / GPT / Grok) or an n8n backend.",
    footer_p3: "Blanes/Catalonia data based on public sources (Autismo España, Junts Autisme, Atención Temprana system). Always verify and update.",
    toast_location_empty: "Please enter a location (e.g.: Blanes, Girona or any city)",
    toast_location_saved: "Location updated: {loc}. Resources and AI agent will adapt.",
    toast_flexible: "Flexible mode activated. Enter any city/region when you change residence.",
    toast_tracker_empty: "Add at least one note or observation.",
    toast_tracker_saved: "Entry saved. These notes will be very valuable for specialists.",
    toast_data_cleared: "Local data cleared. App ready for a new location.",
    toast_voice_unsupported: "Voice input is not supported in this browser. We recommend Chrome or Edge.",
    toast_voice_recognized: "Voice recognised",
    toast_voice_error: "Speech recognition error: ",
    toast_voice_failed: "Could not start recognition",
    toast_speaking: "Speaking…",
    toast_files_added: "{n} file(s) added. They will be sent with the message.",
    toast_plan_generated: "Today's plan generated! 5 exercises like in a gym.",
    toast_added_tracker: "Added to tracker: {title}. Fill in details and save.",
    toast_chat_info: "Switched to chat. Press send to ask the AI.",
    confirm_clear: "Clear all local data (location and tracker)? This will not affect the server.",
    printable_close: "Close",
    printable_print: "Print / Save as PDF",
    printable_disclaimer: "Important: This is an informational programme based on the world's best evidence-based practices (ESDM, TEACCH, NCAEP). Does not replace specialists. Use in addition to professional support. In Spain combine with Atención Temprana.",
    printable_daily_title: "Your daily 'skills gym' (sample plan)",
    printable_generate_first: "Generate a plan on the main tab before printing.",
    printable_full_list: "Full list of exercises by category",
    printable_how_to: "How to use the template: Print or save as PDF. Add your own pictures using the visual descriptions. Mark completion. Adapt to your child. Full interactive version — in the app.",
    printable_steps: "Steps:",
    printable_materials: "Materials:",
    printable_tips: "Tips:",
    printable_desc: "Description:",
    attach_label: "[Attachment]",
    lang_spanish: "Spanish",
    lang_catalan: "Catalan",
    lang_ukrainian: "Ukrainian",
    lang_russian: "Russian",
    lang_english: "English",
    resources_source: "Source:",
  },
  uk: {
    header_title: "NeuralPath РАС AI",
    header_subtitle: "NeuralPath по аутизму (РАС) з ШІ • Гнучка локація • Голос + фото",
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
    printable_btn: "Версія для друку / PDF шаблон",
    all_categories: "Усі",
    active_location: "Активна локація:",
    location_footer: "Розроблено для сімей, які часто переїжджають. Працює з будь-яким текстом.",
    chat_title: "Агент ШІ — Адаптований до вашої локації + глобальні знання",
    chat_subtitle: "Питайте будь-якою мовою. Агент знає вашу поточну локацію та глобальну базу знань про аутизм.",
    quick_1: "Ресурси поблизу Бланеса / Жирони для дитини 5 років",
    quick_2: "Ідеї щоденних занять на основі доказів для РАС",
    quick_3: "Тренди 2026 у ранньому втручанні",
    quick_4: "Підтримка українських / біженських сімей з аутизмом в Іспанії",
    ai_thinking: "Думаю…",
    chat_placeholder: "Напишіть будь-якою мовою: ресурси, ідеї занять, допомога з документами...",
    chat_footer: "Голос + фото/файли підтримуються. У демо ШІ «бачить» вкладення та дає поради.",
    voice_tooltip: "Надиктувати голосом",
    upload_tooltip: "Завантажити фото або файл",
    resources_title: "Ресурси для:",
    resources_subtitle: "Відфільтровано за вашою поточною локацією. Завжди перевіряйте контакти та доступність.",
    resources_contact: "Контакт:",
    resources_languages: "Мови:",
    resources_empty: "Конкретних ресурсів не знайдено. Спробуйте іншу локацію або скористайтесь чатом.",
    resources_footer: "Для Бланеса: Спочатку зосередьтесь на Atención Temprana через державну систему Жирони та Junts Autisme (підтримка сімей у Каталонії). Використовуйте карту Autismo España для найближчих організацій.",
    knowledge_title: "Глобальна база знань (доступна з будь-якого місця)",
    knowledge_subtitle: "Практики, засновані на доказах (NCAEP, ASAT, CDC та міжнародні огляди). Агент ШІ використовує їх для рекомендацій.",
    knowledge_source: "Переглянути джерело →",
    knowledge_tip: "Порада: 28 практик NCAEP + безкоштовні модулі AFIRM — світовий золотий стандарт для втручань у дітей. Пріоритет тим, що можна реалізувати вдома з навчанням батьків. Завжди перевіряйте ASAT для оцінки нових «терапій».",
    tracker_title: "Щоденний трекер (записи для лікарів)",
    tracker_subtitle: "Записуйте прості спостереження. Ці дані будуть золотом, коли отримаєте прийом. Зберігаються локально у вашому браузері.",
    tracker_notes_label: "Загальні нотатки / Що сталося сьогодні",
    tracker_notes_ph: "Напр.: Грав 15 хв з блоками по черзі. Відгукувався на ім'я 2 рази...",
    tracker_skills_label: "Нові або покращені навички",
    tracker_skills_ph: "Напр.: Сказав «мама» з наміром, використав жест для «ще»",
    tracker_challenges_label: "Виклики або поведінка, яку варто відзначити",
    tracker_challenges_ph: "Напр.: Сильна чутливість до шуму моря сьогодні",
    tracker_save: "Зберегти запис за день",
    tracker_recent: "Останні записи",
    tracker_label_notes: "Нотатки:",
    tracker_label_skills: "Навички:",
    tracker_label_challenges: "Виклики:",
    rehab_title: "ГЛОБАЛЬНА НАЙКРАЩА ПРОГРАМА РЕАБІЛІТАЦІЇ (Онлайн «Спортзал навичок» РАС)",
    rehab_subtitle: "Заснована на найефективніших світових методиках (ESDM, TEACCH, NCAEP 28 практик, parent coaching з топ-центрів). Структура як у найкращих спеццентрах: розминка, станції навичок, ігри.",
    rehab_disclaimer_title: "КРИТИЧНО ВАЖЛИВО — ПРОЧИТАЙТЕ ПЕРЕД ВИКОРИСТАННЯМ:",
    rehab_disclaimer_text: "Це ГЛОБАЛЬНА програма на основі найкращих доказових методик світу (ESDM, TEACCH, NCAEP 28 практик, parent coaching з топ-центрів типу Hopebridge/Lighthouse). Вона НЕ ЗАМІНЮЄ діагноз, індивідуальну програму або спеціалістів. Іспанія (ваш контекст): Використовуйте глобальну програму вдома щодня + обов'язково звертайтесь за місцевою допомогою (Atención Temprana через CAP у Бланесі/Жироні, Junts Autisme, Autismo España). Починайте з 10-15 хв, спостерігайте. Якщо дистрес — стоп. Адаптуйте. Консультуйтеся завжди з лікарями.",
    rehab_sources: "Джерела: NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España, Junts Autisme та практики європейських/американських центрів раннього втручання.",
    rehab_gym_desc: "Як у спортзалі: розминка + основні навички + гра.",
    rehab_daily_title: "Ваш план на сьогодні",
    rehab_goal_prefix: "Ціль: освоїти прапор/країну як Рекс!",
    rehab_add_tracker_btn: "Додати до трекера",
    rehab_materials: "Матеріали:",
    rehab_steps: "Як робити (кроки):",
    rehab_visual_title: "🖼️ Візуал для картинки (прапори + карта + Рекс; скопіюйте та згенеруйте зображення):",
    rehab_visual_gen: "Використовуйте Flux, Midjourney, Leonardo або будь-який генератор. Роздрукуйте для мотивації дитини.",
    rehab_tips: "Поради:",
    rehab_evidence: "Основа:",
    rehab_add_journal: "Додати до щоденника",
    rehab_ask_ai: "Запитати ШІ",
    rehab_footer: "Програма зібрана з практик реальних центрів. Для Бланеса комбінуйте з місцевими службами (Atención Temprana, Junts Autisme). Регулярність важливіша за ідеальність. Відстежуйте прогрес у трекері та діліться фото з ШІ для ідей.",
    spain_title: "Іспанія / Місцева допомога (Бланес, Каталонія)",
    spain_subtitle: "Використовуйте ГЛОБАЛЬНУ програму вище як основу вдома. Паралельно отримуйте місцеву підтримку:",
    spain_footer: "Джерела: autismo.org.es, juntsautisme.org, державні дані. Перевіряйте актуальність.",
    footer_p1: "Технічна примітка: Це функціональний додаток Next.js з ретельно підібраними даними для Бланеса + Каталонії + глобальною базою (NCAEP 28 практик, ASAT, CDC, Autismo España, Junts Autisme тощо). Чат — демо-агент з урахуванням локації.",
    footer_p2: "Для повної версії з реальним ШІ-агентом (RAG по глобальних документах + оновлені веб-пошуки, інструменти, автоматичні робочі процеси): підключіть інтерфейс до API LLM (Claude / GPT / Grok) або бекенду n8n.",
    footer_p3: "Дані по Бланесу/Каталонії засновані на публічних джерелах (Autismo España, Junts Autisme, система Atención Temprana). Завжди перевіряйте та оновлюйте.",
    toast_location_empty: "Будь ласка, введіть локацію (наприклад: Бланес, Жирона або будь-яке місто)",
    toast_location_saved: "Локацію оновлено: {loc}. Ресурси та агент ШІ адаптуються.",
    toast_flexible: "Гнучкий режим активовано. Введіть будь-яке місто/регіон при зміні місця проживання.",
    toast_tracker_empty: "Додайте хоча б одну нотатку або спостереження.",
    toast_tracker_saved: "Запис збережено. Ці нотатки будуть дуже цінні для спеціалістів.",
    toast_data_cleared: "Локальні дані очищено. Додаток готовий до нової локації.",
    toast_voice_unsupported: "Голосове введення не підтримується в цьому браузері. Рекомендуємо Chrome або Edge.",
    toast_voice_recognized: "Голос розпізнано",
    toast_voice_error: "Помилка розпізнавання мовлення: ",
    toast_voice_failed: "Не вдалося запустити розпізнавання",
    toast_speaking: "Говоріть…",
    toast_files_added: "Додано {n} файл(ів). Вони будуть надіслані з повідомленням.",
    toast_plan_generated: "Згенеровано план на сьогодні! 5 вправ як у спортзалі.",
    toast_added_tracker: "Додано до трекера: {title}. Заповніть деталі та збережіть.",
    toast_chat_info: "Переключено в чат. Натисніть відправити, щоб запитати ШІ.",
    confirm_clear: "Очистити всі локальні дані (локацію та трекер)? Це не торкнеться сервера.",
    printable_close: "Закрити",
    printable_print: "Друк / Зберегти як PDF",
    printable_disclaimer: "Важливо: Це інформаційна програма на основі найкращих світових доказових практик (ESDM, TEACCH, NCAEP). Не замінює спеціалістів. Використовуйте на додаток до професійної допомоги. В Іспанії комбінуйте з Atención Temprana.",
    printable_daily_title: "Ваш щоденний «спортзал» навичок (приклад плану)",
    printable_generate_first: "Згенеруйте план на головній вкладці перед друком.",
    printable_full_list: "Повний список вправ за категоріями",
    printable_how_to: "Як використовувати шаблон: Роздрукуйте або збережіть як PDF. Додавайте свої картинки за візуальними описами. Відмічайте виконання. Адаптуйте під дитину. Повна версія з інтерактивом — у додатку.",
    printable_steps: "Кроки:",
    printable_materials: "Матеріали:",
    printable_tips: "Поради:",
    printable_desc: "Опис:",
    attach_label: "[Вкладення]",
    lang_spanish: "іспанська",
    lang_catalan: "каталанська",
    lang_ukrainian: "українська",
    lang_russian: "російська",
    lang_english: "англійська",
    resources_source: "Джерело:",
  },
  es: {
    header_title: "NeuralPath TEA AI",
    header_subtitle: "NeuralPath TEA con IA • Ubicación flexible • Voz + fotos",
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
    printable_btn: "Versión imprimible / Plantilla PDF",
    all_categories: "Todos",
    active_location: "Ubicación activa:",
    location_footer: "Diseñado para familias que se mudan frecuentemente. Funciona con cualquier texto.",
    chat_title: "Agente IA — Adaptado a tu ubicación + conocimiento global",
    chat_subtitle: "Pregunta en cualquier idioma. El agente tiene contexto de tu ubicación actual y la base global de autismo en niños.",
    quick_1: "Recursos cerca de Blanes / Girona para un niño de 5 años",
    quick_2: "Ideas de actividades diarias basadas en evidencia para TEA",
    quick_3: "Resumen de tendencias 2026 en intervención temprana",
    quick_4: "Apoyo para familias ucranianas/refugiadas con autismo en España",
    ai_thinking: "Pensando…",
    chat_placeholder: "Pregunta en cualquier idioma: recursos, ideas de actividades, ayuda con documentos...",
    chat_footer: "Voz + fotos/archivos admitidos. En modo demo la IA 've' los archivos adjuntos y da sugerencias.",
    voice_tooltip: "Dictar por voz",
    upload_tooltip: "Subir foto o archivo",
    resources_title: "Recursos para:",
    resources_subtitle: "Filtrados por tu ubicación actual. Verifica siempre los contactos y la disponibilidad.",
    resources_contact: "Contacto:",
    resources_languages: "Idiomas:",
    resources_empty: "No se encontraron recursos específicos. Prueba otra ubicación o usa el chat.",
    resources_footer: "Para Blanes: Céntrate primero en Atención Temprana a través del sistema público de Girona y Junts Autisme (apoyo a familias en Cataluña). Usa el mapa de Autismo España para organizaciones cercanas.",
    knowledge_title: "Base de conocimiento global (accesible desde cualquier lugar)",
    knowledge_subtitle: "Prácticas basadas en evidencia (NCAEP, ASAT, CDC y revisiones internacionales). El agente IA las usa para sus recomendaciones.",
    knowledge_source: "Ver fuente →",
    knowledge_tip: "Consejo: Las 28 prácticas de NCAEP + módulos AFIRM gratuitos son el estándar mundial para intervenciones en niños. Prioriza las que se pueden implementar en casa con formación parental. Consulta siempre ASAT para evaluar nuevas 'terapias'.",
    tracker_title: "Seguimiento diario (notas para médicos)",
    tracker_subtitle: "Registra observaciones simples. Estos datos serán oro cuando tengas cita. Se guardan localmente en tu navegador.",
    tracker_notes_label: "Notas generales / Qué pasó hoy",
    tracker_notes_ph: "Ej.: Jugó 15 min con bloques por turnos. Respondió a su nombre 2 veces...",
    tracker_skills_label: "Habilidades nuevas o mejoradas",
    tracker_skills_ph: "Ej.: Dijo 'mamá' con intención, usó el gesto para 'más'",
    tracker_challenges_label: "Desafíos o conductas que vale la pena anotar",
    tracker_challenges_ph: "Ej.: Fuerte sensibilidad al ruido del mar hoy",
    tracker_save: "Guardar entrada del día",
    tracker_recent: "Últimas entradas",
    tracker_label_notes: "Notas:",
    tracker_label_skills: "Habilidades:",
    tracker_label_challenges: "Desafíos:",
    rehab_title: "MEJOR PROGRAMA GLOBAL DE REHABILITACIÓN (Gimnasio de habilidades TEA online)",
    rehab_subtitle: "Basado en los métodos más eficaces del mundo (ESDM, TEACCH, NCAEP 28 prácticas, parent coaching de los mejores centros). Estructura como en los mejores centros especializados: calentamiento, estaciones de habilidades, juego.",
    rehab_disclaimer_title: "CRÍTICO — LEE ANTES DE USAR:",
    rehab_disclaimer_text: "Este es un programa GLOBAL basado en los mejores métodos basados en evidencia del mundo (ESDM, TEACCH, NCAEP 28 prácticas, parent coaching de centros como Hopebridge/Lighthouse). NO SUSTITUYE el diagnóstico, programa individual ni especialistas. España (tu contexto): Usa el programa global en casa a diario + busca siempre apoyo local (Atención Temprana vía CAP en Blanes/Girona, Junts Autisme, Autismo España). Empieza con 10-15 min, observa. Si hay malestar — para. Adapta. Consulta siempre a médicos.",
    rehab_sources: "Fuentes: NCAEP, ASAT, CDC, ESDM, TEACCH, Autismo España, Junts Autisme y centros europeos/americanos de intervención temprana.",
    rehab_gym_desc: "Como en el gimnasio: calentamiento + habilidades principales + juego.",
    rehab_daily_title: "Tu plan para hoy",
    rehab_goal_prefix: "Objetivo: ¡explorar una bandera/país como Rex!",
    rehab_add_tracker_btn: "Añadir al seguimiento",
    rehab_materials: "Materiales:",
    rehab_steps: "Cómo hacerlo (pasos):",
    rehab_visual_title: "🖼️ Visual para la tarjeta (banderas + mapa + Rex; copia y genera imagen):",
    rehab_visual_gen: "Usa Flux, Midjourney, Leonardo o cualquier generador. Imprime para motivar al niño.",
    rehab_tips: "Consejos:",
    rehab_evidence: "Base:",
    rehab_add_journal: "Añadir al diario",
    rehab_ask_ai: "Preguntar a la IA",
    rehab_footer: "Programa compilado de prácticas de centros reales. Para Blanes combina con servicios locales (Atención Temprana, Junts Autisme). La constancia importa más que la perfección. Registra el progreso en el seguimiento y comparte fotos con la IA para ideas.",
    spain_title: "España / Apoyo local (Blanes, Cataluña)",
    spain_subtitle: "Usa el programa GLOBAL de arriba como base en casa. En paralelo, recibe apoyo local:",
    spain_footer: "Fuentes: autismo.org.es, juntsautisme.org, datos públicos. Verifica siempre.",
    footer_p1: "Nota técnica: Esta es una aplicación Next.js funcional con datos curados para Blanes + Cataluña + base global (NCAEP 28 prácticas, ASAT, CDC, Autismo España, Junts Autisme, etc.). El chat es un agente demo consciente de la ubicación.",
    footer_p2: "Para versión completa con agente IA real (RAG sobre documentos globales + búsquedas web actualizadas, herramientas, flujos automáticos): conecta la interfaz a una API de LLM (Claude / GPT / Grok) o a un backend n8n.",
    footer_p3: "Datos de Blanes/Cataluña basados en fuentes públicas (Autismo España, Junts Autisme, sistema de Atención Temprana). Verifica y actualiza siempre.",
    toast_location_empty: "Por favor, introduce una ubicación (ej.: Blanes, Girona o cualquier ciudad)",
    toast_location_saved: "Ubicación actualizada: {loc}. Los recursos y el agente IA se adaptarán.",
    toast_flexible: "Modo flexible activado. Introduce cualquier ciudad/región cuando cambies de residencia.",
    toast_tracker_empty: "Añade al menos una nota u observación.",
    toast_tracker_saved: "Entrada guardada. Estas notas serán muy valiosas para los especialistas.",
    toast_data_cleared: "Datos locales eliminados. App lista para una nueva ubicación.",
    toast_voice_unsupported: "El reconocimiento de voz no está disponible en este navegador. Recomendamos Chrome o Edge.",
    toast_voice_recognized: "Voz reconocida",
    toast_voice_error: "Error de reconocimiento de voz: ",
    toast_voice_failed: "No se pudo iniciar el reconocimiento",
    toast_speaking: "Habla…",
    toast_files_added: "{n} archivo(s) añadido(s). Se enviarán con el mensaje.",
    toast_plan_generated: "¡Plan de hoy generado! 5 ejercicios como en el gimnasio.",
    toast_added_tracker: "Añadido al seguimiento: {title}. Rellena los detalles y guarda.",
    toast_chat_info: "Cambiado al chat. Pulsa enviar para preguntar a la IA.",
    confirm_clear: "¿Borrar todos los datos locales (ubicación y seguimiento)? Esto no afectará al servidor.",
    printable_close: "Cerrar",
    printable_print: "Imprimir / Guardar como PDF",
    printable_disclaimer: "Importante: Este es un programa informativo basado en las mejores prácticas basadas en evidencia del mundo (ESDM, TEACCH, NCAEP). No sustituye a los especialistas. Úsalo como complemento de la ayuda profesional. En España combina con Atención Temprana.",
    printable_daily_title: "Tu 'gimnasio de habilidades' diario (plan de ejemplo)",
    printable_generate_first: "Genera un plan en la pestaña principal antes de imprimir.",
    printable_full_list: "Lista completa de ejercicios por categoría",
    printable_how_to: "Cómo usar la plantilla: Imprime o guarda como PDF. Añade tus propias imágenes usando las descripciones visuales. Marca la realización. Adapta a tu hijo/a. Versión interactiva completa — en la app.",
    printable_steps: "Pasos:",
    printable_materials: "Materiales:",
    printable_tips: "Consejos:",
    printable_desc: "Descripción:",
    attach_label: "[Adjunto]",
    lang_spanish: "español",
    lang_catalan: "catalán",
    lang_ukrainian: "ucraniano",
    lang_russian: "ruso",
    lang_english: "inglés",
    resources_source: "Fuente:",
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
  const getInitialMessage = (l: string) => {
    const msgs: Record<string, string> = {
      ru: `Привет! Я твой ИИ-ассистент по поддержке семей с аутизмом (подозрение на РАС). По умолчанию настроен на глобальные лучшие практики (ESDM, TEACCH, NCAEP и программы ведущих центров мира). Ты можешь ввести любую локацию (идеально для семей, которые часто переезжают).\n\nЯ могу помочь с:\n• Локальными ресурсами (включая Испанию)\n• Глобальной базой знаний (доказательные практики)\n• Идеями ежедневных занятий для ребёнка 5 лет\n• Полноценной онлайн-программой реабилитации («Спортзал навыков»)\n• Обзорами трендов и вмешательств\n\n**ВАЖНО:** Это общая информация и практическая поддержка. НЕ заменяет диагностику, лечение или консультацию специалистов.`,
      en: `Hi! I'm your AI assistant supporting families with autism (ASD suspicion). By default I focus on global best practices (ESDM, TEACCH, NCAEP and programmes from leading centres worldwide). You can enter any location (ideal for families who move often).\n\nI can help with:\n• Local resources (including Spain)\n• Global knowledge base (evidence-based practices)\n• Daily activity ideas for a 5-year-old\n• Full online rehab programme ('Skills Gym')\n• Trend reviews and interventions\n\n**IMPORTANT:** This is general information and practical support. It does NOT replace diagnosis, treatment, or specialist advice.`,
      uk: `Привіт! Я ваш ШІ-асистент з підтримки сімей з аутизмом (підозра на РАС). За замовчуванням налаштований на глобальні найкращі практики (ESDM, TEACCH, NCAEP та програми провідних центрів світу). Ви можете ввести будь-яку локацію (ідеально для сімей, які часто переїжджають).\n\nЯ можу допомогти з:\n• Локальними ресурсами (включаючи Іспанію)\n• Глобальною базою знань (доказові практики)\n• Ідеями щоденних занять для дитини 5 років\n• Повноцінною онлайн-програмою реабілітації («Спортзал навичок»)\n• Оглядами трендів та втручань\n\n**ВАЖЛИВО:** Це загальна інформація та практична підтримка. НЕ замінює діагностику, лікування або консультацію спеціалістів.`,
      es: `¡Hola! Soy tu asistente de IA para familias con autismo (sospecha de TEA). Por defecto estoy configurado con las mejores prácticas globales (ESDM, TEACCH, NCAEP y programas de los principales centros mundiales). Puedes introducir cualquier ubicación (ideal para familias que se mudan con frecuencia).\n\nPuedo ayudarte con:\n• Recursos locales (incluida España)\n• Base de conocimiento global (prácticas basadas en evidencia)\n• Ideas de actividades diarias para un niño de 5 años\n• Programa completo de rehabilitación online ('Gimnasio de habilidades')\n• Revisiones de tendencias e intervenciones\n\n**IMPORTANTE:** Esta es información general y apoyo práctico. NO sustituye diagnóstico, tratamiento ni consulta con especialistas.`,
    };
    return msgs[l] || msgs['ru'];
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      content: getInitialMessage('ru'),
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

  // Save language to localStorage and update initial chat message when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appLang', lang);
    }
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'ai') {
        return [{ ...prev[0], content: getInitialMessage(lang) }];
      }
      return prev;
    });
  }, [lang]);

  // Save location
  const updateLocation = () => {
    if (!locationInput.trim()) {
      toast.error(t(lang, 'toast_location_empty'));
      return;
    }
    const newLoc = locationInput.trim();
    setCurrentLocation(newLoc);
    localStorage.setItem('autismCompanionLocation', newLoc);
    setIsLocationSet(true);
    setLocationInput('');
    toast.success(t(lang, 'toast_location_saved').replace('{loc}', newLoc));
  };

  // Reset to flexible (for frequent moves)
  const resetToFlexible = () => {
    const flexible = t(lang, 'flexible_mode');
    setCurrentLocation(flexible);
    localStorage.setItem('autismCompanionLocation', flexible);
    toast.info(t(lang, 'toast_flexible'));
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
      const local = filteredResources.slice(0, 3).map(r => `• ${localize(r.title, lang)}: ${localize(r.description, lang).substring(0, 120)}... (${localize(r.contact, lang) || r.website || ''})`).join('\n');
      return `${locContext}${attachContext}Aquí tienes recursos relevantes para tu zona:\n\n${local}\n\nRecomendación fuerte: Contacta **Atención Temprana Girona** a través de tu CAP en Blanes o la web de Salut (salut.gencat.cat). Junts Autisme (juntsautisme.org) ofrece apoyo excelente a familias en Cataluña. Verifica siempre la información actualizada.`;
    }

    if (lowerMsg.includes('actividad') || lowerMsg.includes('juego') || lowerMsg.includes('qué hacer') || lowerMsg.includes('rutina')) {
      return `${locContext}${attachContext}Para un niño de ~5 años con sospecha de autismo, prioriza prácticas basadas en evidencia (NCAEP): Naturalistic Interventions (enseñanza natural durante el juego), Visual Supports (horarios visuales), Parent-Implemented Interventions.\n\nIdea concreta: Crea un horario visual simple con fotos de rutinas diarias (desayuno → parque → comida). Usa refuerzo positivo inmediato. Juega turnos simples con juguetes preferidos del niño. Observa qué le gusta y amplía eso. Registra en el Tracker qué funciona.`;
    }

    if (lowerMsg.includes('tendencia') || lowerMsg.includes('investigación') || lowerMsg.includes('nuevo') || lowerMsg.includes('esdm') || lowerMsg.includes('aba')) {
      const trend = globalKnowledge.find(k => k.id === 'trends-2026');
      return `${locContext}${attachContext}${localize(trend?.summary, lang)}\n\nEnfoque principal recomendado: Intervención temprana intensiva basada en evidencia (ESDM, enfoques naturalistas + parent coaching). Evita terapias sin respaldo científico fuerte (revisa ASAT). En España, combina con Atención Temprana pública.`;
    }

    if (lowerMsg.includes('ucrania') || lowerMsg.includes('refugiado') || lowerMsg.includes('diáspora')) {
      return `${locContext}${attachContext}Como familia ucraniana en España: Busca grupos de "Ucranianos Blanes / Girona / Costa Brava" en Telegram y Facebook. Muchas familias comparten experiencias con TEA y ayudan con burocracia. Organizaciones como Autismo España + Junts Autisme pueden orientar sobre derechos y recursos para refugiados. Hay historias de apoyo específico a familias ucranianas con necesidades especiales.`;
    }

    // Global evidence-based default
    const ebp = globalKnowledge.find(k => k.id === 'ebp-28');
    return `${locContext}${attachContext}${localize(ebp?.summary, lang) || 'Consulta las 28 prácticas basadas en evidencia de NCAEP (ncaep.fpg.unc.edu) y los módulos AFIRM gratuitos.'}\n\nPregúntame algo más específico sobre tu hijo, rutinas, o recursos en tu nueva ubicación. Puedo adaptar recomendaciones.`;
  };

  // Send message to AI (now supports attachments)
  const sendChatMessage = async () => {
    if (!chatInput.trim() && attachments.length === 0) return;

    const currentAttachments = [...attachments];
    const currentInput = chatInput.trim();

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: currentInput || (currentAttachments.length > 0 ? t(lang, 'attach_label') : ''),
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

  // Quick prompt buttons (language-aware)
  const quickPrompts = [
    t(lang, 'quick_1'),
    t(lang, 'quick_2'),
    t(lang, 'quick_3'),
    t(lang, 'quick_4'),
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
      toast.error(t(lang, 'toast_tracker_empty'));
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

    toast.success(t(lang, 'toast_tracker_saved'));
  };

  // Clear all data (for privacy / new location)
  const clearAllData = () => {
    if (!confirm(t(lang, 'confirm_clear'))) return;
    localStorage.removeItem('autismCompanionLocation');
    localStorage.removeItem('autismCompanionTracker');
    setCurrentLocation(defaultLocation);
    setTrackerEntries([]);
    setChatMessages([{ id: 1, role: 'ai', content: getInitialMessage(lang), timestamp: new Date() }]);
    toast.success(t(lang, 'toast_data_cleared'));
  };

  // === NEW FEATURES: Voice dictation + File/Photo upload for AI chat ===

  // Voice dictation using Web Speech API (works in Chrome/Edge)
  const startDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(t(lang, 'toast_voice_unsupported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : lang === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => (prev + ' ' + transcript).trim());
      toast.success(t(lang, 'toast_voice_recognized'));
    };

    recognition.onerror = (event: any) => {
      toast.error(t(lang, 'toast_voice_error') + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);
      toast.info(t(lang, 'toast_speaking'));
    } catch (e) {
      toast.error(t(lang, 'toast_voice_failed'));
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
    toast.success(t(lang, 'toast_files_added').replace('{n}', String(files.length)));

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
    toast.success(t(lang, 'toast_plan_generated'));
  };

  const addRehabToTracker = (activity: RehabActivity) => {
    const note = `${activity.title} (${activity.duration}): ${activity.description}`;
    setTrackerNotes(prev => prev ? `${prev}\n${note}` : note);
    toast.success(t(lang, 'toast_added_tracker').replace('{title}', activity.title));
    setActiveTab('tracker');
  };

  const askAIAboutActivity = (activity: RehabActivity) => {
    const prompt = t(lang, 'quick_1').includes('Blanes')
      ? `Tell me more about the exercise "${activity.title}" for my 5-year-old with autism. How to adapt it, how often per week, and what to do if the child refuses.`
      : `Расскажи подробнее про упражнение "${activity.title}" для моего 5-летнего ребёнка с подозрением на аутизм. Как адаптировать, сколько раз в неделю, и что делать если ребёнок не хочет.`;
    setChatInput(activity.title);
    setActiveTab('chat');
    toast.info(t(lang, 'toast_chat_info'));
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
                <span className="font-medium text-emerald-600">Rex • {lang === 'ru' ? 'Флаги' : lang === 'uk' ? 'Прапори' : lang === 'es' ? 'Banderas' : 'Flags'}: 47/195</span>
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
              <p className="text-[10px] text-zinc-500 mt-1.5">{t(lang, 'location_footer')}</p>
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
              <span className="font-medium">{t(lang, 'active_location')}</span> <span className="text-emerald-700 dark:text-emerald-400">{currentLocation}</span>
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
                <MessageCircle className="w-5 h-5" /> {t(lang, 'chat_title')}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{t(lang, 'chat_subtitle')}</p>
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
                    <div className="ai-message rounded-2xl px-4 py-3 text-sm">{t(lang, 'ai_thinking')} ({currentLocation})</div>
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
                    placeholder={t(lang, 'chat_placeholder')}
                    className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1"
                    disabled={isTyping}
                  />

                  {/* Voice dictation button */}
                  <button 
                    onClick={startDictation} 
                    disabled={isTyping || isListening}
                    className={`px-3 py-3 rounded-2xl border transition-colors flex items-center justify-center ${isListening ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    title={t(lang, 'voice_tooltip')}
                  >
                    🎤
                  </button>

                  {/* File / Photo upload */}
                  <label className="px-3 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-center transition-colors" title={t(lang, 'upload_tooltip')}>
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

                <p className="text-[10px] text-center text-zinc-400 mt-2">{t(lang, 'chat_footer')}</p>
              </div>
            </div>
          </div>
        )}

        {/* === RESOURCES (Location filtered) === */}
        {activeTab === 'resources' && (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><MapPin className="w-5 h-5" /> {t(lang, 'resources_title')} {currentLocation}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{t(lang, 'resources_subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredResources.length > 0 ? filteredResources.map(res => (
                <div key={res.id} className="resource-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="uppercase text-[10px] tracking-widest text-emerald-600 dark:text-emerald-500 mb-1">{res.type.toUpperCase()} • {res.location}</div>
                  <h3 className="font-semibold text-lg mb-2">{localize(res.title, lang)}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{localize(res.description, lang)}</p>
                  {res.contact && <p className="text-xs mb-1"><strong>{t(lang, 'resources_contact')}</strong> {localize(res.contact, lang)}</p>}
                  {res.website && <a href={res.website} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mb-1">{res.website}</a>}
                  {res.notes && <p className="text-xs bg-zinc-100 dark:bg-zinc-950 p-2 rounded mt-2">{localize(res.notes, lang)}</p>}
                  {res.languages && <div className="text-[10px] mt-2 text-zinc-500">{t(lang, 'resources_languages')} {res.languages.map(lc => t(lang, 'lang_' + lc)).join(' • ')}</div>}
                </div>
              )) : <p>{t(lang, 'resources_empty')}</p>}
            </div>

            <div className="mt-8 text-xs text-zinc-500">{t(lang, 'resources_footer')}</div>
          </div>
        )}

        {/* === GLOBAL KNOWLEDGE + TRENDS === */}
        {activeTab === 'knowledge' && (
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> {t(lang, 'knowledge_title')}</h2>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">{t(lang, 'knowledge_subtitle')}</p>

            <div className="grid gap-4">
              {globalKnowledge.map(item => (
                <div key={item.id} className="knowledge-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{item.category}</div>
                      <h3 className="font-semibold text-lg">{localize(item.title, lang)}</h3>
                    </div>
                    {item.link && <a href={item.link} target="_blank" className="text-xs text-blue-600">{t(lang, 'knowledge_source')}</a>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{localize(item.summary, lang)}</p>
                  <div className="text-[10px] mt-3 text-zinc-500">{t(lang, 'resources_source')} {localize(item.source, lang)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-zinc-900 border rounded-2xl text-xs">{t(lang, 'knowledge_tip')}</div>
          </div>
        )}

        {/* === TRACKER === */}
        {activeTab === 'tracker' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> {t(lang, 'tracker_title')}</h2>
            <p className="text-sm mb-6 text-zinc-600 dark:text-zinc-400">{t(lang, 'tracker_subtitle')}</p>

            <div className="bg-white dark:bg-zinc-900 border rounded-3xl p-6 space-y-4">
              <div>
                <label className="text-xs text-zinc-500">{t(lang, 'tracker_notes_label')}</label>
                <textarea value={trackerNotes} onChange={e => setTrackerNotes(e.target.value)} className="w-full mt-1 h-20 rounded-xl border p-3 text-sm" placeholder={t(lang, 'tracker_notes_ph')} />
              </div>
              <div>
                <label className="text-xs text-zinc-500">{t(lang, 'tracker_skills_label')}</label>
                <input value={trackerSkills} onChange={e => setTrackerSkills(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder={t(lang, 'tracker_skills_ph')} />
              </div>
              <div>
                <label className="text-xs text-zinc-500">{t(lang, 'tracker_challenges_label')}</label>
                <input value={trackerChallenges} onChange={e => setTrackerChallenges(e.target.value)} className="w-full mt-1 rounded-xl border p-3 text-sm" placeholder={t(lang, 'tracker_challenges_ph')} />
              </div>

              <button onClick={saveTrackerEntry} className="w-full py-3 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-black transition-colors">{t(lang, 'tracker_save')}</button>
            </div>

            {trackerEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium mb-3">{t(lang, 'tracker_recent')}</h3>
                <div className="space-y-3">
                  {trackerEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="text-sm bg-white dark:bg-zinc-900 border rounded-2xl p-4">
                      <div className="text-xs text-zinc-500 mb-1">{entry.date}</div>
                      {entry.notes && <p><strong>{t(lang, 'tracker_label_notes')}</strong> {entry.notes}</p>}
                      {entry.skillsObserved && <p className="mt-1"><strong>{t(lang, 'tracker_label_skills')}</strong> {entry.skillsObserved}</p>}
                      {entry.challenges && <p className="mt-1 text-orange-600 dark:text-orange-400"><strong>{t(lang, 'tracker_label_challenges')}</strong> {entry.challenges}</p>}
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
                {t(lang, 'rehab_title')}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t(lang, 'rehab_subtitle')}</p>
            </div>

            {/* Strong Disclaimer */}
            <div className="disclaimer rounded-2xl p-5 mb-8 text-sm leading-relaxed">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>{t(lang, 'rehab_disclaimer_title')}</strong><br />
                  {t(lang, 'rehab_disclaimer_text')}
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6 text-sm leading-relaxed">
              <div className="whitespace-pre-wrap">{rehabIntro}</div>
              <p className="mt-3 text-xs text-zinc-500">{t(lang, 'rehab_sources')}</p>
            </div>

            {/* Daily Plan Generator */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <button 
                onClick={generateAndSetDailyPlan}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-medium transition-colors"
              >
                <Play className="w-5 h-5" /> {t(lang, 'generate_plan')}
              </button>
              <span className="text-sm text-zinc-500">{t(lang, 'rehab_gym_desc')}</span>
              <button 
                onClick={() => setShowPrintableRehab(true)}
                className="ml-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium no-print"
              >
                {t(lang, 'printable_btn')}
              </button>
            </div>

            {dailyPlan.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3 text-lg">{t(lang, 'rehab_daily_title')}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {dailyPlan.map(act => (
                    <div key={act.id} className="bg-white dark:bg-zinc-900 border rounded-2xl p-4 text-sm border-l-4 border-[var(--theme-accent)]">
                      <div className="font-medium flex items-center gap-2">🇺🇳 {act.title}</div>
                      <div className="text-xs text-emerald-600 mt-1">{act.duration} • {act.category}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">{t(lang, 'rehab_goal_prefix')}</div>
                      <button onClick={() => addRehabToTracker(act)} className="mt-2 text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded">{t(lang, 'rehab_add_tracker_btn')}</button>
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
                    <div className="text-xs font-medium mb-1">{t(lang, 'rehab_materials')}</div>
                    <div className="text-sm">{activity.materials}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">{t(lang, 'rehab_steps')}</div>
                    <ol className="text-sm list-decimal pl-4 space-y-0.5">
                      {activity.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ol>
                  </div>

                  {/* Visual / Picture section - "с картинками" */}
                  <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 border rounded-2xl">
                    <div className="text-xs font-medium mb-1 flex items-center gap-1">{t(lang, 'rehab_visual_title')}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-snug">{activity.visualDescription}</div>
                    <div className="text-[10px] mt-1 text-emerald-600">{t(lang, 'rehab_visual_gen')}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium mb-1">{t(lang, 'rehab_tips')}</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{activity.tips}</div>
                  </div>

                  <div className="text-[10px] text-zinc-500 mb-3">{t(lang, 'rehab_evidence')} {activity.evidence}</div>

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => addRehabToTracker(activity)}
                      className="flex-1 px-4 py-2 text-sm rounded-2xl border border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                    >
                      {t(lang, 'rehab_add_journal')}
                    </button>
                    <button
                      onClick={() => askAIAboutActivity(activity)}
                      className="flex-1 px-4 py-2 text-sm rounded-2xl bg-zinc-900 text-white hover:bg-black transition-colors"
                    >
                      {t(lang, 'rehab_ask_ai')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">{t(lang, 'rehab_footer')}</div>

            {/* Printable / PDF Template Overlay */}
            {showPrintableRehab && (
              <div className="fixed inset-0 bg-white z-[100] overflow-auto p-8 printable-rehab no-print">
                <div className="max-w-[210mm] mx-auto"> {/* A4 width approx */}
                  <div className="flex justify-between items-center mb-6 no-print">
                    <h1 className="text-2xl font-bold flex items-center gap-2">{t(lang, 'tab_rehab')} — Printable / PDF Template <span className="text-3xl">🇺🇳🗺️</span></h1>
                    <div>
                      <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">{t(lang, 'printable_print')}</button>
                      <button onClick={() => setShowPrintableRehab(false)} className="px-4 py-2 border rounded">{t(lang, 'printable_close')}</button>
                    </div>
                  </div>

                  <div className="mb-6 text-xs border p-3">{t(lang, 'printable_disclaimer')}</div>

                  <h2 className="text-xl font-semibold mb-4">{t(lang, 'printable_daily_title')}</h2>
                  {dailyPlan.length > 0 ? (
                    <div className="mb-8">
                      {dailyPlan.map((act, idx) => (
                        <div key={idx} className="activity-card mb-4 p-3 border">
                          <strong>{act.title}</strong> ({act.duration})<br />
                          <em>{t(lang, 'rehab_goal_prefix')}</em> {act.description}<br />
                          <strong>{t(lang, 'printable_steps')}</strong> {act.steps.join(' ')}<br />
                          <strong>{t(lang, 'printable_materials')}</strong> {act.materials}<br />
                          <div className="visual-placeholder my-2 text-center text-xs border-dashed border-2 border-[var(--theme-accent)]">[{act.visualDescription}]</div>
                          <em>{t(lang, 'printable_tips')}</em> {act.tips}
                        </div>
                      ))}
                    </div>
                  ) : <p>{t(lang, 'printable_generate_first')}</p>}

                  <h2 className="text-xl font-semibold mb-4 mt-8">{t(lang, 'printable_full_list')}</h2>
                  {rehabCategories.map(cat => {
                    const acts = getActivitiesByCategory(cat.key);
                    if (acts.length === 0) return null;
                    return (
                      <div key={cat.key} className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">{cat.icon} {cat.label}</h3>
                        {acts.map(act => (
                          <div key={act.id} className="activity-card mb-3 p-3 border text-sm">
                            <strong>{act.title}</strong> — {act.duration}<br />
                            <em>{t(lang, 'printable_desc')}</em> {act.description}<br />
                            <strong>{t(lang, 'printable_steps')}</strong><br />
                            {act.steps.map((s,i) => <div key={i}>{s}</div>)}<br />
                            <strong>{t(lang, 'printable_materials')}</strong> {act.materials}<br />
                            <div className="visual-placeholder my-1 text-xs">[{act.visualDescription}]</div>
                            <em>{t(lang, 'printable_tips')}</em> {act.tips} ({t(lang, 'rehab_evidence')} {act.evidence})
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="mt-8 text-xs">{t(lang, 'printable_how_to')}</div>
                </div>
              </div>
            )}

            {/* Spain Local Context (secondary, as requested) */}
            <div className="mt-10 p-6 bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800 rounded-2xl">
              <h3 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">{t(lang, 'spain_title')}</h3>
              <p className="text-sm mb-4">{t(lang, 'spain_subtitle')}</p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>Atención Temprana</strong>: {lang === 'ru' ? 'Часто доступна даже без полного диагноза. Обратись в местный CAP в Бланесе или региональные службы Girona. Многопрофильная (логопед, OT, психолог). Бесплатно/низкая стоимость.' : lang === 'uk' ? 'Часто доступна навіть без повного діагнозу. Зверніться до місцевого CAP у Бланесі або регіональних служб Жирони. Мультидисциплінарна (логопед, OT, психолог). Безкоштовно/низька вартість.' : lang === 'es' ? 'A menudo disponible incluso sin diagnóstico completo. Ve a tu CAP local en Blanes o los servicios regionales de Girona. Multidisciplinar (logopeda, OT, psicólogo). Gratuita/bajo coste.' : 'Often available even without a full diagnosis. Contact your local CAP in Blanes or Girona regional services. Multidisciplinary (speech therapist, OT, psychologist). Free/low cost.'}</li>
                <li><strong>Fundació Junts Autisme</strong>: {lang === 'ru' ? 'Поддержка семей, навигация по системе, эмоциональная помощь. Тел: 931 808 926, email: info@juntsautisme.org' : lang === 'uk' ? 'Підтримка сімей, навігація системою, емоційна допомога. Тел: 931 808 926, email: info@juntsautisme.org' : lang === 'es' ? 'Apoyo a familias, navegación del sistema, ayuda emocional. Tel: 931 808 926, email: info@juntsautisme.org' : 'Family support, system navigation, emotional help. Tel: 931 808 926, email: info@juntsautisme.org'}</li>
                <li><strong>Autismo España</strong>: {lang === 'ru' ? 'Национальная конфедерация с картой организаций. Ищи по Girona/Barcelona. Инфо, advocacy, ресурсы: autismo.org.es.' : lang === 'uk' ? 'Національна конфедерація з картою організацій. Шукайте по Girona/Barcelona. Інфо, advocacy, ресурси: autismo.org.es.' : lang === 'es' ? 'Confederación nacional con mapa de organizaciones. Busca por Girona/Barcelona. Info, advocacy, recursos: autismo.org.es.' : 'National confederation with organisation map. Search by Girona/Barcelona. Info, advocacy, resources: autismo.org.es.'}</li>
              </ul>
              <p className="text-xs mt-3 text-zinc-500">{t(lang, 'spain_footer')}</p>
            </div>
          </div>
        )}

        {/* Footer / Upgrade info */}
        <div className="mt-12 pt-8 border-t text-xs text-zinc-500 dark:text-zinc-400 max-w-3xl">
          <p>{t(lang, 'footer_p1')}</p>
          <p className="mt-2">{t(lang, 'footer_p2')}</p>
          <p className="mt-2">{t(lang, 'footer_p3')}</p>
        </div>
      </div>
    </div>
  );
}
