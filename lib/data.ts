// autism-ai-companion/lib/data.ts
// Curated data for the AI Companion app.
// Designed for flexible location input (refugees often move).
// All user-facing text fields are localized (ru | en | uk | es) so the UI
// fully follows the selected language. Default app language is Russian.

// A localized string: either a plain string (no translation needed, e.g. URLs)
// or an object with translations. Use localize() to resolve it.
export type Localized = string | { ru: string; en: string; uk: string; es: string };

export function localize(field: Localized | undefined, lang: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return (field as any)[lang] || field.ru || field.en || '';
}

export interface Resource {
  id: string;
  title: Localized;
  description: Localized;
  type: 'center' | 'association' | 'therapy' | 'support' | 'education' | 'aid' | 'community';
  location: string; // Flexible: 'Blanes' | 'Girona' | 'Catalonia' | 'Spain' | 'Global' | specific city
  contact?: Localized;
  website?: string;
  notes?: Localized;
  languages?: string[]; // language codes/keys, resolved in UI: 'spanish' | 'catalan' | 'ukrainian' | 'russian' | 'english'
}

export interface GlobalKnowledge {
  id: string;
  title: Localized;
  summary: Localized;
  source: Localized;
  link?: string;
  category: 'evidence-based' | 'early-intervention' | 'daily-support' | 'trends' | 'parent-training';
}

// === LOCATION-FLEXIBLE RESOURCES ===
export const resources: Resource[] = [
  // Blanes / Local Girona area
  {
    id: 'blanes-early',
    title: {
      ru: 'Atención Temprana (Ранняя помощь) — провинция Жирона',
      en: 'Atención Temprana (Early Intervention) — Girona Province',
      uk: 'Atención Temprana (Рання допомога) — провінція Жирона',
      es: 'Atención Temprana (Early Intervention) — Provincia de Girona',
    },
    description: {
      ru: 'Государственная мультидисциплинарная ранняя помощь детям до 6 лет с особенностями развития (включая подозрение на аутизм). Бесплатно или с низкой стоимостью. Полный диагноз для первичного доступа нужен не всегда.',
      en: 'Public multidisciplinary early support for children under 6 with developmental concerns (including suspected autism). Free or low-cost. Does not always require a full diagnosis for initial access.',
      uk: 'Державна мультидисциплінарна рання допомога дітям до 6 років з особливостями розвитку (включно з підозрою на аутизм). Безкоштовно або з низькою вартістю. Повний діагноз для первинного доступу потрібен не завжди.',
      es: 'Apoyo temprano público y multidisciplinar para niños menores de 6 años con preocupaciones de desarrollo (incluida sospecha de autismo). Gratuito o de bajo coste. No siempre requiere diagnóstico completo para el acceso inicial.',
    },
    type: 'center',
    location: 'Blanes',
    contact: {
      ru: 'Обратитесь в местный CAP (поликлинику) в Бланесе или в службы здравоохранения Жироны. Ищите «Atención Temprana Girona» или звоните в региональные социальные службы.',
      en: 'Contact your local CAP (primary health center) in Blanes or Girona health services. Search "Atención Temprana Girona" or call regional social services.',
      uk: 'Зверніться до місцевого CAP (поліклініки) у Бланесі або до служб охорони здоров\'я Жирони. Шукайте «Atención Temprana Girona» або телефонуйте до регіональних соціальних служб.',
      es: 'Contacta con tu CAP (centro de salud) local en Blanes o los servicios de salud de Girona. Busca "Atención Temprana Girona" o llama a los servicios sociales regionales.',
    },
    website: 'https://salut.gencat.cat',
    notes: {
      ru: 'Критично для детей 5 лет. Ранний доступ — ключ, даже пока ждёте диагноз. Жители Бланеса относятся к региональным службам Жироны.',
      en: 'Critical for 5-year-olds. Early access is key even while waiting for diagnosis. Blanes residents fall under Girona regional services.',
      uk: 'Критично для дітей 5 років. Ранній доступ — ключ, навіть поки чекаєте діагноз. Мешканці Бланеса належать до регіональних служб Жирони.',
      es: 'Crítico para niños de 5 años. El acceso temprano es clave incluso mientras se espera el diagnóstico. Los residentes de Blanes dependen de los servicios regionales de Girona.',
    },
    languages: ['spanish', 'catalan'],
  },
  {
    id: 'junts-autisme',
    title: {
      ru: 'Fundació Junts Autisme — поддержка семей в Каталонии',
      en: 'Fundació Junts Autisme — Catalonia Family Support',
      uk: 'Fundació Junts Autisme — підтримка сімей у Каталонії',
      es: 'Fundació Junts Autisme — Apoyo a familias en Cataluña',
    },
    description: {
      ru: 'Комплексная поддержка семей с аутизмом/РАС в Каталонии: консультации, сопровождение, ориентирование, эмоциональная помощь. Помогают с финансовыми расходами, ресурсами и навигацией по системе.',
      en: 'Comprehensive support for families with autism/ASD in Catalonia: advice, accompaniment, guidance, emotional support. Helps with economic costs, resources, and navigation.',
      uk: 'Комплексна підтримка сімей з аутизмом/РАС у Каталонії: консультації, супровід, орієнтування, емоційна допомога. Допомагають з фінансовими витратами, ресурсами та навігацією системою.',
      es: 'Apoyo integral para familias con autismo/TEA en Cataluña: asesoramiento, acompañamiento, orientación, apoyo emocional. Ayuda con costes económicos, recursos y navegación.',
    },
    type: 'support',
    location: 'Catalonia',
    contact: 'Email: info@juntsautisme.org | Phone: 931 808 926',
    website: 'https://juntsautisme.org',
    notes: {
      ru: 'Отлично подходит семьям из Бланеса/Коста-Бравы. Прямо помогают разбираться с государственной системой и специализированными ресурсами.',
      en: 'Excellent for Blanes/Costa Brava families. They explicitly support navigating public systems and specialized resources.',
      uk: 'Чудово підходить сім\'ям з Бланеса/Коста-Брави. Прямо допомагають розбиратися з державною системою та спеціалізованими ресурсами.',
      es: 'Excelente para familias de Blanes/Costa Brava. Apoyan explícitamente la navegación por sistemas públicos y recursos especializados.',
    },
    languages: ['spanish', 'catalan'],
  },
  {
    id: 'autismo-espana-catalonia',
    title: {
      ru: 'Autismo España — организации Каталонии / Жироны',
      en: 'Autismo España — Catalonia / Girona Entities',
      uk: 'Autismo España — організації Каталонії / Жирони',
      es: 'Autismo España — Entidades de Cataluña / Girona',
    },
    description: {
      ru: 'Национальная конфедерация с 193+ организациями-членами по всей Испании. Используйте их карту, чтобы найти ближайшую в провинции Жирона или Барселона (совсем рядом с Бланесом). Информация, ресурсы, защита прав, местные ассоциации.',
      en: 'National confederation with 193+ member organizations across Spain. Use their map to find the nearest in Girona or Barcelona province (very close to Blanes). Information, resources, advocacy, local associations.',
      uk: 'Національна конфедерація з 193+ організаціями-членами по всій Іспанії. Скористайтеся їхньою картою, щоб знайти найближчу в провінції Жирона або Барселона (зовсім поруч із Бланесом). Інформація, ресурси, захист прав, місцеві асоціації.',
      es: 'Confederación nacional con más de 193 organizaciones miembro en toda España. Usa su mapa para encontrar la más cercana en la provincia de Girona o Barcelona (muy cerca de Blanes). Información, recursos, advocacy, asociaciones locales.',
    },
    type: 'association',
    location: 'Spain',
    contact: {
      ru: 'Используйте интерактивную карту на сайте',
      en: 'Use the interactive map on the site',
      uk: 'Скористайтеся інтерактивною картою на сайті',
      es: 'Usa el mapa interactivo del sitio',
    },
    website: 'https://autismo.org.es/nosotros/entidades-miembro/',
    notes: {
      ru: 'Начните отсюда для Бланеса: ищите организации в Жироне или Барселоне. Они дают ссылки на местную Atención Temprana, школы и родительские группы. Также есть Испанский центр аутизма для исследований/информирования.',
      en: 'Start here for Blanes: Search Girona or Barcelona entities. They link to local Atención Temprana, schools, and parent groups. Also has the Spanish Autism Center for research/awareness.',
      uk: 'Почніть звідси для Бланеса: шукайте організації в Жироні або Барселоні. Вони дають посилання на місцеву Atención Temprana, школи та батьківські групи. Також є Іспанський центр аутизму для досліджень/інформування.',
      es: 'Empieza aquí para Blanes: Busca entidades de Girona o Barcelona. Enlazan con la Atención Temprana local, escuelas y grupos de padres. También tiene el Centro Español de Autismo para investigación/concienciación.',
    },
    languages: ['spanish'],
  },
  {
    id: 'blanes-community',
    title: {
      ru: 'Местная поддержка и диаспора (Бланес / Коста-Брава)',
      en: 'Local & Diaspora Support (Blanes / Costa Brava)',
      uk: 'Місцева підтримка та діаспора (Бланес / Коста-Брава)',
      es: 'Apoyo local y diáspora (Blanes / Costa Brava)',
    },
    description: {
      ru: 'Родительские группы поддержки, украинские/беженские сообщества в Бланесе, Жироне или на Коста-Браве. Многие семьи делятся опытом, ресурсами и помогают с интеграцией/школами.',
      en: 'Parent support groups, Ukrainian/refugee communities in Blanes, Girona, or Costa Brava. Many families share experiences, resources, and help with integration/schools.',
      uk: 'Батьківські групи підтримки, українські/біженські спільноти в Бланесі, Жироні або на Коста-Браві. Багато сімей діляться досвідом, ресурсами та допомагають з інтеграцією/школами.',
      es: 'Grupos de apoyo para padres, comunidades ucranianas/refugiadas en Blanes, Girona o Costa Brava. Muchas familias comparten experiencias, recursos y ayuda con la integración/escuelas.',
    },
    type: 'community',
    location: 'Blanes',
    contact: {
      ru: 'Ищите в Telegram/Facebook: «Украинцы Бланес», «Украинцы Жирона», «Украинцы Коста-Брава» или «Autismo Girona padres». Местные группы экспатов и общие каналы помощи украинцам в Испании.',
      en: 'Search Telegram/Facebook: "Ukrainians Blanes", "Ukrainians Girona", "Ukrainians Costa Brava", or "Autismo Girona padres". Local expat groups and general Ukrainian help channels in Spain.',
      uk: 'Шукайте в Telegram/Facebook: «Українці Бланес», «Українці Жирона», «Українці Коста-Брава» або «Autismo Girona padres». Місцеві групи експатів та загальні канали допомоги українцям в Іспанії.',
      es: 'Busca en Telegram/Facebook: "Ucranianos Blanes", "Ucranianos Girona", "Ucranianos Costa Brava" o "Autismo Girona padres". Grupos locales de expatriados y canales generales de ayuda ucraniana en España.',
    },
    website: 'https://autismo.org.es',
    notes: {
      ru: 'Как беженцам — свяжитесь с украинскими группами для практической помощи (язык, бюрократия, эмоциональная поддержка). Многие делятся опытом с аутизмом. В Бланесе есть туристическое/международное сообщество.',
      en: 'As refugees, connect with Ukrainian groups for practical help (language, bureaucracy, emotional support). Many share autism experiences. Blanes has a tourist/international community.',
      uk: 'Як біженцям — зв\'яжіться з українськими групами для практичної допомоги (мова, бюрократія, емоційна підтримка). Багато хто ділиться досвідом з аутизмом. У Бланесі є туристична/міжнародна спільнота.',
      es: 'Como refugiados, conecta con grupos ucranianos para ayuda práctica (idioma, burocracia, apoyo emocional). Muchos comparten experiencias con el autismo. Blanes tiene una comunidad turística/internacional.',
    },
    languages: ['ukrainian', 'russian', 'spanish'],
  },
  {
    id: 'catalonia-schools',
    title: {
      ru: 'Инклюзивное образование и спецшколы (Каталония)',
      en: 'Inclusive Education & Specialized Schools (Catalonia)',
      uk: 'Інклюзивна освіта та спецшколи (Каталонія)',
      es: 'Educación inclusiva y escuelas especializadas (Cataluña)',
    },
    description: {
      ru: 'Государственные и специализированные варианты образования для детей с аутизмом. Поддержка инклюзии, индивидуальных учебных планов и спеццентров. Гранты и помощь с транспортом часто доступны после оценки.',
      en: 'Public and specialized education options for autistic children. Support for inclusion, IEPs, and specialized centers. Grants and transport help often available after assessment.',
      uk: 'Державні та спеціалізовані варіанти освіти для дітей з аутизмом. Підтримка інклюзії, індивідуальних навчальних планів та спеццентрів. Гранти та допомога з транспортом часто доступні після оцінки.',
      es: 'Opciones de educación pública y especializada para niños autistas. Apoyo a la inclusión, PEI y centros especializados. Becas y ayuda de transporte a menudo disponibles tras la evaluación.',
    },
    type: 'education',
    location: 'Catalonia',
    contact: {
      ru: 'Через Junts Autisme или Autismo España + местный департамент образования (Departament d\'Educació)',
      en: 'Via Junts Autisme or Autismo España + local education department (Departament d\'Educació)',
      uk: 'Через Junts Autisme або Autismo España + місцевий департамент освіти (Departament d\'Educació)',
      es: 'A través de Junts Autisme o Autismo España + departamento de educación local (Departament d\'Educació)',
    },
    website: 'https://educacio.gencat.cat',
    notes: {
      ru: 'Начинайте разговоры со школами в районе Бланеса даже до полного диагноза. Многие предлагают планы поддержки.',
      en: 'Start conversations with schools in the Blanes area even before a full diagnosis. Many offer support plans.',
      uk: 'Починайте розмови зі школами в районі Бланеса навіть до повного діагнозу. Багато хто пропонує плани підтримки.',
      es: 'Empieza a hablar con las escuelas de la zona de Blanes incluso antes del diagnóstico completo. Muchas ofrecen planes de apoyo.',
    },
    languages: ['spanish', 'catalan'],
  },
  // Spain general (applies broadly)
  {
    id: 'autismo-espana-main',
    title: {
      ru: 'Confederación Autismo España (Национальная)',
      en: 'Confederación Autismo España (National)',
      uk: 'Confederación Autismo España (Національна)',
      es: 'Confederación Autismo España (Nacional)',
    },
    description: {
      ru: 'Главная национальная организация. Ресурсы, исследования, защита прав, гиды для семей, карта всех организаций.',
      en: 'Main national organization. Resources, research, advocacy, family guides, map of all entities.',
      uk: 'Головна національна організація. Ресурси, дослідження, захист прав, гіди для сімей, карта всіх організацій.',
      es: 'Organización nacional principal. Recursos, investigación, advocacy, guías para familias, mapa de todas las entidades.',
    },
    type: 'association',
    location: 'Spain',
    website: 'https://autismo.org.es',
    notes: {
      ru: 'Обязательная отправная точка для любой локации в Испании. Включает информацию о сертификатах инвалидности, помощи и Испанском центре аутизма.',
      en: 'Essential starting point for any location in Spain. Includes info on disability certificates, aid, and the Spanish Autism Center.',
      uk: 'Обов\'язкова відправна точка для будь-якої локації в Іспанії. Включає інформацію про сертифікати інвалідності, допомогу та Іспанський центр аутизму.',
      es: 'Punto de partida esencial para cualquier ubicación en España. Incluye información sobre certificados de discapacidad, ayudas y el Centro Español de Autismo.',
    },
    languages: ['spanish'],
  },
  // Global / World resources (accessible from anywhere)
  {
    id: 'ncaep-global',
    title: {
      ru: 'NCAEP — 28 доказательных практик (мировой золотой стандарт)',
      en: 'NCAEP — 28 Evidence-Based Practices (Global Gold Standard)',
      uk: 'NCAEP — 28 доказових практик (світовий золотий стандарт)',
      es: 'NCAEP — 28 prácticas basadas en evidencia (estándar mundial)',
    },
    description: {
      ru: 'Национальный центр доказательных практик по аутизму (США, широко используется в мире). Определяет 28 практик с сильной доказательной базой для детей/подростков с аутизмом (например, вмешательства на основе предшествующих факторов, обучение отдельными пробами, натуралистические вмешательства, обучение родителей, устройства, генерирующие речь, и др.). Бесплатные модули AFIRM учат, как их применять.',
      en: 'National Clearinghouse on Autism Evidence and Practice (USA, widely used internationally). Identifies 28 practices with strong evidence for children/youth with autism (e.g. Antecedent-Based Interventions, Discrete Trial Teaching, Naturalistic Interventions, Parent Training, Speech Generating Devices, etc.). Free AFIRM modules teach how to use them.',
      uk: 'Національний центр доказових практик з аутизму (США, широко використовується у світі). Визначає 28 практик із сильною доказовою базою для дітей/підлітків з аутизмом (наприклад, втручання на основі попередніх факторів, навчання окремими пробами, натуралістичні втручання, навчання батьків, пристрої, що генерують мовлення, та ін.). Безкоштовні модулі AFIRM навчають, як їх застосовувати.',
      es: 'Centro Nacional de Evidencia y Práctica en Autismo (EE. UU., ampliamente usado internacionalmente). Identifica 28 prácticas con sólida evidencia para niños/jóvenes con autismo (p. ej. intervenciones basadas en antecedentes, enseñanza por ensayos discretos, intervenciones naturalistas, formación parental, dispositivos generadores de habla, etc.). Los módulos gratuitos AFIRM enseñan a usarlas.',
    },
    type: 'support',
    location: 'Global',
    website: 'https://ncaep.fpg.unc.edu/',
    notes: {
      ru: 'Ядро глобальной базы знаний. Сосредоточьтесь на них в ежедневной работе с ребёнком. Многие из них родители могут применять после обучения.',
      en: 'Core of the global knowledge base. Focus on these for daily work with your child. Many are parent-implementable with training.',
      uk: 'Ядро глобальної бази знань. Зосередьтеся на них у щоденній роботі з дитиною. Багато з них батьки можуть застосовувати після навчання.',
      es: 'Núcleo de la base de conocimiento global. Céntrate en ellas para el trabajo diario con tu hijo/a. Muchas pueden aplicarlas los padres con formación.',
    },
    languages: ['english'],
  },
  {
    id: 'asat-global',
    title: {
      ru: 'ASAT — Ассоциация за научный подход к лечению аутизма',
      en: 'ASAT — Association for Science in Autism Treatment',
      uk: 'ASAT — Асоціація за науковий підхід до лікування аутизму',
      es: 'ASAT — Asociación por la Ciencia en el Tratamiento del Autismo',
    },
    description: {
      ru: 'Научно обоснованные обзоры методов лечения: что работает, что требует дополнительных исследований, что не работает. Гиды для родителей, краткие обзоры методов (например, раннее интенсивное поведенческое вмешательство, ESDM).',
      en: 'Science-based reviews of treatments: what works, what needs more research, what does not work. Parent guides, treatment summaries (e.g. Early Intensive Behavioral Intervention, ESDM).',
      uk: 'Науково обґрунтовані огляди методів лікування: що працює, що потребує додаткових досліджень, що не працює. Гіди для батьків, короткі огляди методів (наприклад, раннє інтенсивне поведінкове втручання, ESDM).',
      es: 'Revisiones basadas en la ciencia de tratamientos: qué funciona, qué necesita más investigación, qué no funciona. Guías para padres, resúmenes de tratamientos (p. ej. Intervención Conductual Intensiva Temprana, ESDM).',
    },
    type: 'support',
    location: 'Global',
    website: 'https://asatonline.org',
    notes: {
      ru: 'Лучшее место, чтобы оценить любой «новый тренд» или терапию. Защищает от недоказанных или вредных подходов.',
      en: 'Best place to evaluate any "new trend" or therapy. Protects against unproven or harmful approaches.',
      uk: 'Найкраще місце, щоб оцінити будь-який «новий тренд» або терапію. Захищає від недоведених або шкідливих підходів.',
      es: 'El mejor lugar para evaluar cualquier "nueva tendencia" o terapia. Protege contra enfoques no probados o dañinos.',
    },
    languages: ['english'],
  },
  {
    id: 'cdc-act-early',
    title: {
      ru: 'CDC «Learn the Signs. Act Early.» + ресурсы по лечению',
      en: 'CDC "Learn the Signs. Act Early." + Treatment Resources',
      uk: 'CDC «Learn the Signs. Act Early.» + ресурси з лікування',
      es: 'CDC "Learn the Signs. Act Early." + Recursos de tratamiento',
    },
    description: {
      ru: 'Бесплатные трекеры этапов развития, информационные листы, материалы «Learn the Signs» для родителей. Информация о раннем вмешательстве и методах лечения.',
      en: 'Free milestone trackers, fact sheets, "Learn the Signs" materials for parents. Info on early intervention and treatments.',
      uk: 'Безкоштовні трекери етапів розвитку, інформаційні листи, матеріали «Learn the Signs» для батьків. Інформація про раннє втручання та методи лікування.',
      es: 'Rastreadores gratuitos de hitos, hojas informativas, materiales "Learn the Signs" para padres. Información sobre intervención temprana y tratamientos.',
    },
    type: 'support',
    location: 'Global',
    website: 'https://www.cdc.gov/autism',
    notes: {
      ru: 'Отличные бесплатные инструменты для отслеживания развития дома. Используйте, пока ждёте специалистов.',
      en: 'Excellent free tools for tracking development at home. Use while waiting for professionals.',
      uk: 'Чудові безкоштовні інструменти для відстеження розвитку вдома. Використовуйте, поки чекаєте на спеціалістів.',
      es: 'Excelentes herramientas gratuitas para seguir el desarrollo en casa. Úsalas mientras esperas a los profesionales.',
    },
    languages: ['english', 'spanish'],
  },
  {
    id: 'esdm-parent',
    title: {
      ru: 'Early Start Denver Model (ESDM) — ресурсы для родителей',
      en: 'Early Start Denver Model (ESDM) — Parent Resources',
      uk: 'Early Start Denver Model (ESDM) — ресурси для батьків',
      es: 'Early Start Denver Model (ESDM) — Recursos para padres',
    },
    description: {
      ru: 'Доказательное раннее вмешательство (12–48 месяцев, с возможностью продления), сочетающее ABA и развивающие подходы. Игровое, фокус на социальной коммуникации и познании. Участие родителей — ключевое.',
      en: 'Evidence-based early intervention (12-48 months, extendable) combining ABA and developmental approaches. Play-based, focuses on social communication, cognition. Parent involvement is key.',
      uk: 'Доказове раннє втручання (12–48 місяців, з можливістю продовження), що поєднує ABA та розвиваючі підходи. Ігрове, фокус на соціальній комунікації та пізнанні. Участь батьків — ключова.',
      es: 'Intervención temprana basada en evidencia (12-48 meses, ampliable) que combina ABA y enfoques de desarrollo. Basada en el juego, se centra en la comunicación social y la cognición. La participación de los padres es clave.',
    },
    type: 'therapy',
    location: 'Global',
    website: 'https://www.esdm.co',
    notes: {
      ru: 'Очень рекомендуется для детей 5 лет. Многие элементы родители могут использовать ежедневно дома.',
      en: 'Highly recommended for 5-year-olds. Many elements parents can use daily at home.',
      uk: 'Дуже рекомендується для дітей 5 років. Багато елементів батьки можуть використовувати щодня вдома.',
      es: 'Muy recomendado para niños de 5 años. Muchos elementos los pueden usar los padres a diario en casa.',
    },
    languages: ['english'],
  },
];

// === GLOBAL KNOWLEDGE BASE (for AI agent and Trends section) ===
export const globalKnowledge: GlobalKnowledge[] = [
  {
    id: 'ebp-28',
    title: {
      ru: '28 доказательных практик (NCAEP 2020/обновлено)',
      en: '28 Evidence-Based Practices (NCAEP 2020/updated)',
      uk: '28 доказових практик (NCAEP 2020/оновлено)',
      es: '28 prácticas basadas en evidencia (NCAEP 2020/actualizado)',
    },
    summary: {
      ru: 'Систематический обзор вмешательств с положительным эффектом для детей/подростков с аутизмом. Ключевые для 5 лет: натуралистические вмешательства, вмешательства с участием родителей, обучение отдельными пробами, подсказки, подкрепление, тренинг социальных навыков, устройства для генерации речи (AAC), визуальные опоры и др. Модули AFIRM учат пошаговому внедрению.',
      en: 'Systematic review of interventions with positive effects for autistic children/youth. Key ones for 5yo: Naturalistic Interventions, Parent-Implemented Interventions, Discrete Trial Training, Prompting, Reinforcement, Social Skills Training, Speech Generating Devices (AAC), Visual Supports, etc. AFIRM modules teach step-by-step implementation.',
      uk: 'Систематичний огляд втручань з позитивним ефектом для дітей/підлітків з аутизмом. Ключові для 5 років: натуралістичні втручання, втручання за участю батьків, навчання окремими пробами, підказки, підкріплення, тренінг соціальних навичок, пристрої для генерації мовлення (AAC), візуальні опори та ін. Модулі AFIRM навчають покрокового впровадження.',
      es: 'Revisión sistemática de intervenciones con efectos positivos para niños/jóvenes autistas. Clave para los 5 años: intervenciones naturalistas, intervenciones aplicadas por padres, enseñanza por ensayos discretos, prompting, refuerzo, entrenamiento en habilidades sociales, dispositivos generadores de habla (CAA), apoyos visuales, etc. Los módulos AFIRM enseñan la implementación paso a paso.',
    },
    source: 'NCAEP (ncaep.fpg.unc.edu)',
    category: 'evidence-based',
  },
  {
    id: 'early-intervention',
    title: {
      ru: 'Раннее вмешательство критически важно',
      en: 'Early Intervention is Critical',
      uk: 'Раннє втручання критично важливе',
      es: 'La intervención temprana es crítica',
    },
    summary: {
      ru: 'Начало поддержки как можно раньше (даже до формального диагноза) улучшает результаты в коммуникации, социальных навыках, адаптивном поведении. Для этого существуют государственные системы вроде испанской Atención Temprana. ESDM и интенсивные поведенческие подходы имеют сильную доказательную базу.',
      en: 'Starting support as early as possible (even before formal diagnosis) improves outcomes in communication, social skills, adaptive behavior. Public systems like Spain\'s Atención Temprana exist for this. ESDM and intensive behavioral approaches have strong evidence.',
      uk: 'Початок підтримки якомога раніше (навіть до формального діагнозу) покращує результати в комунікації, соціальних навичках, адаптивній поведінці. Для цього існують державні системи на кшталт іспанської Atención Temprana. ESDM та інтенсивні поведінкові підходи мають сильну доказову базу.',
      es: 'Comenzar el apoyo lo antes posible (incluso antes del diagnóstico formal) mejora los resultados en comunicación, habilidades sociales y conducta adaptativa. Para esto existen sistemas públicos como la Atención Temprana española. ESDM y los enfoques conductuales intensivos tienen evidencia sólida.',
    },
    source: {
      ru: 'CDC, NCAEP, множество исследований',
      en: 'CDC, NCAEP, multiple studies',
      uk: 'CDC, NCAEP, безліч досліджень',
      es: 'CDC, NCAEP, múltiples estudios',
    },
    category: 'early-intervention',
  },
  {
    id: 'parent-training',
    title: {
      ru: 'Обучение и коучинг родителей',
      en: 'Parent Training & Coaching',
      uk: 'Навчання та коучинг батьків',
      es: 'Formación y coaching parental',
    },
    summary: {
      ru: 'Программы, обучающие родителей стратегиям (например, Incredible Years-ASLD, протестированная в Испании, родительские компоненты ESDM), очень эффективны. Родители становятся главными «терапевтами» дома. Акцент на натуралистическом обучении во время ежедневных рутин.',
      en: 'Programs teaching parents strategies (e.g. Incredible Years-ASLD tested in Spain, ESDM parent components) are highly effective. Parents become the primary "therapists" at home. Focus on naturalistic teaching during daily routines.',
      uk: 'Програми, що навчають батьків стратегій (наприклад, Incredible Years-ASLD, протестована в Іспанії, батьківські компоненти ESDM), дуже ефективні. Батьки стають головними «терапевтами» вдома. Акцент на натуралістичному навчанні під час щоденних рутин.',
      es: 'Los programas que enseñan estrategias a los padres (p. ej. Incredible Years-ASLD probado en España, componentes parentales de ESDM) son muy eficaces. Los padres se convierten en los "terapeutas" principales en casa. Énfasis en la enseñanza naturalista durante las rutinas diarias.',
    },
    source: {
      ru: 'ASAT, NCAEP, испанские исследования',
      en: 'ASAT, NCAEP, Spanish studies',
      uk: 'ASAT, NCAEP, іспанські дослідження',
      es: 'ASAT, NCAEP, estudios españoles',
    },
    category: 'parent-training',
  },
  {
    id: 'daily-support',
    title: {
      ru: 'Практические ежедневные стратегии',
      en: 'Practical Daily Strategies',
      uk: 'Практичні щоденні стратегії',
      es: 'Estrategias prácticas diarias',
    },
    summary: {
      ru: 'Используйте визуальные расписания, структурированную игру, чёткие рутины, положительное подкрепление, сенсорную поддержку. Отслеживайте, что работает именно для ВАШЕГО ребёнка. AAC (обмен картинками или устройства) помогает неговорящим или начинающим говорить. Сочетайте с логопедией и эрготерапией.',
      en: 'Use visual schedules, structured play, clear routines, positive reinforcement, sensory supports. Track what works for YOUR child. AAC (picture exchange or devices) helps non-verbal or emerging speakers. Combine with speech and occupational therapy.',
      uk: 'Використовуйте візуальні розклади, структуровану гру, чіткі рутини, позитивне підкріплення, сенсорну підтримку. Відстежуйте, що працює саме для ВАШОЇ дитини. AAC (обмін картинками або пристрої) допомагає тим, хто не говорить або починає говорити. Поєднуйте з логопедією та ерготерапією.',
      es: 'Usa horarios visuales, juego estructurado, rutinas claras, refuerzo positivo, apoyos sensoriales. Registra lo que funciona para TU hijo/a. La CAA (intercambio de imágenes o dispositivos) ayuda a quienes no hablan o están empezando. Combina con logopedia y terapia ocupacional.',
    },
    source: {
      ru: 'Модули NCAEP AFIRM, гиды для родителей',
      en: 'NCAEP AFIRM modules, parent guides',
      uk: 'Модулі NCAEP AFIRM, гіди для батьків',
      es: 'Módulos NCAEP AFIRM, guías para padres',
    },
    category: 'daily-support',
  },
  {
    id: 'trends-2026',
    title: {
      ru: 'Актуальные тренды (2025–2026)',
      en: 'Current Trends (2025-2026)',
      uk: 'Актуальні тренди (2025–2026)',
      es: 'Tendencias actuales (2025-2026)',
    },
    summary: {
      ru: 'Растущее использование ИИ для персонализированной поддержки и скрининга (например, приложения для анализа поведения, коммуникации). Телемедицина и коучинг родителей расширяют доступ. Акцент на натуралистических/развивающих подходах наряду с поведенческими. Фокус на качестве жизни, инклюзии и сокращении неравенства. Всегда отдавайте приоритет доказательствам, а не хайпу.',
      en: 'Growing use of AI for personalized support and screening (e.g. apps for behavior analysis, communication). Telehealth and parent coaching expand access. Emphasis on naturalistic/developmental approaches alongside behavioral. Focus on quality of life, inclusion, and reducing disparities. Always prioritize evidence over hype.',
      uk: 'Зростаюче використання ШІ для персоналізованої підтримки та скринінгу (наприклад, додатки для аналізу поведінки, комунікації). Телемедицина та коучинг батьків розширюють доступ. Акцент на натуралістичних/розвиваючих підходах поряд з поведінковими. Фокус на якості життя, інклюзії та зменшенні нерівності. Завжди надавайте перевагу доказам, а не хайпу.',
      es: 'Uso creciente de la IA para apoyo personalizado y cribado (p. ej. apps de análisis de conducta, comunicación). La telesalud y el coaching parental amplían el acceso. Énfasis en enfoques naturalistas/del desarrollo junto a los conductuales. Foco en calidad de vida, inclusión y reducción de desigualdades. Prioriza siempre la evidencia sobre el hype.',
    },
    source: {
      ru: 'Свежие обзоры, ASAT, международные отчёты',
      en: 'Recent reviews, ASAT, international reports',
      uk: 'Свіжі огляди, ASAT, міжнародні звіти',
      es: 'Revisiones recientes, ASAT, informes internacionales',
    },
    category: 'trends',
  },
];

// Helper: Filter resources by flexible location string
export function getResourcesForLocation(userLocation: string): Resource[] {
  const loc = userLocation.toLowerCase().trim();

  if (!loc) return resources.filter(r => r.location === 'Global' || r.location === 'Spain');

  return resources.filter(r => {
    const rLoc = r.location.toLowerCase();
    if (loc.includes('blanes') || loc.includes('girona') || loc.includes('costa brava')) {
      return rLoc.includes('blanes') || rLoc.includes('girona') || rLoc.includes('catalonia') || rLoc.includes('spain');
    }
    if (loc.includes('catalonia') || loc.includes('barcelona')) {
      return rLoc.includes('catalonia') || rLoc.includes('spain') || rLoc.includes('blanes');
    }
    if (loc.includes('spain') || loc.includes('españa')) {
      return rLoc.includes('spain') || rLoc.includes('catalonia');
    }
    // Global + matching
    return rLoc.includes('global') || rLoc.includes(loc) || r.location === 'Spain';
  });
}

// Initial default for Blanes
export const defaultLocation = 'Blanes, Girona, Spain (Catalonia)';
