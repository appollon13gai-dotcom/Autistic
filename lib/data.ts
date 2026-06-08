// autism-ai-companion/lib/data.ts
// Curated data for the AI Companion app.
// Designed for flexible location input (refugees often move).
// Start focused on Blanes (Girona, Catalonia, Spain) + Catalonia/Spain general + global evidence-based resources.

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'center' | 'association' | 'therapy' | 'support' | 'education' | 'aid' | 'community';
  location: string; // Flexible: 'Blanes' | 'Girona' | 'Catalonia' | 'Spain' | 'Global' | specific city
  contact?: string;
  website?: string;
  notes?: string;
  languages?: string[]; // e.g. ['Spanish', 'Catalan', 'Ukrainian/Russian support via diaspora']
}

export interface GlobalKnowledge {
  id: string;
  title: string;
  summary: string;
  source: string;
  link?: string;
  category: 'evidence-based' | 'early-intervention' | 'daily-support' | 'trends' | 'parent-training';
}

// === LOCATION-FLEXIBLE RESOURCES ===
// For Blanes specifically (Costa Brava, Girona province, Catalonia).
// General Spain/Catalonia resources that apply.
// App should ask for location first and filter/search accordingly.
// Always verify current info - things change, especially for refugees.

export const resources: Resource[] = [
  // Blanes / Local Girona area
  {
    id: 'blanes-early',
    title: 'Atención Temprana (Early Intervention) - Girona Province',
    description: 'Public multidisciplinary early support for children under 6 with developmental concerns (including suspected autism). Free or low-cost. Do not always require full diagnosis for initial access.',
    type: 'center',
    location: 'Blanes',
    contact: 'Contact your local CAP (primary health center) in Blanes or Girona health services. Search "Atención Temprana Girona" or call regional social services.',
    website: 'https://salut.gencat.cat (Catalonia Health) or autismo.org.es for nearest entity',
    notes: 'Critical for 5-year-olds. Early access is key even while waiting for diagnosis. Blanes residents fall under Girona regional services.',
    languages: ['Spanish', 'Catalan']
  },
  {
    id: 'junts-autisme',
    title: 'Fundació Junts Autisme - Catalonia Family Support',
    description: 'Comprehensive support for families with autism/ASD in Catalonia: advice, accompaniment, guidance, emotional support. Helps with economic costs, resources, and navigation.',
    type: 'support',
    location: 'Catalonia',
    contact: 'Email: info@juntsautisme.org | Phone: 931 808 926',
    website: 'https://juntsautisme.org',
    notes: 'Excellent for Blanes/Costa Brava families. They explicitly support navigating public systems and specialized resources.',
    languages: ['Spanish', 'Catalan']
  },
  {
    id: 'autismo-espana-catalonia',
    title: 'Autismo España - Catalonia / Girona Entities',
    description: 'National confederation with 193+ member organizations across Spain. Use their map to find nearest in Girona or Barcelona province (very close to Blanes). Information, resources, advocacy, local associations.',
    type: 'association',
    location: 'Spain',
    contact: 'Use interactive map on site',
    website: 'https://autismo.org.es/nosotros/entidades-miembro/',
    notes: 'Start here for Blanes: Search Girona or Barcelona entities. They link to local Atención Temprana, schools, and parent groups. Also has Spanish Autism Center for research/awareness.',
    languages: ['Spanish']
  },
  {
    id: 'blanes-community',
    title: 'Local & Diaspora Support (Blanes / Costa Brava)',
    description: 'Parent support groups, Ukrainian/refugee communities in Blanes, Girona, or Costa Brava. Many families share experiences, resources, and help with integration/schools.',
    type: 'community',
    location: 'Blanes',
    contact: 'Search Telegram/Facebook: "Ucranianos Blanes", "Ucranianos Girona", "Ucranianos Costa Brava", or "Autismo Girona padres". InterNations or local expat groups. General Ukrainian help channels in Spain.',
    website: 'autismo.org.es for official + diaspora networks',
    notes: 'As refugees, connect with Ukrainian groups for practical help (language, bureaucracy, emotional support). Many share autism experiences. Blanes has tourist/international community.',
    languages: ['Ukrainian', 'Russian', 'Spanish']
  },
  {
    id: 'catalonia-schools',
    title: 'Inclusive Education & Specialized Schools (Catalonia)',
    description: 'Public and specialized education options for autistic children. Support for inclusion, IEPs, and specialized centers. Grants and transport help often available after assessment.',
    type: 'education',
    location: 'Catalonia',
    contact: 'Via Junts Autisme or Autismo España + local education department (Departament d\'Educació)',
    website: 'educacio.gencat.cat or autismo.org.es',
    notes: 'Start conversations with schools in Blanes area even before full diagnosis. Many offer support plans.',
    languages: ['Spanish', 'Catalan']
  },
  // Spain general (applies broadly)
  {
    id: 'autismo-espana-main',
    title: 'Confederación Autismo España (National)',
    description: 'Main national organization. Resources, research, advocacy, family guides, map of all entities.',
    type: 'association',
    location: 'Spain',
    website: 'https://autismo.org.es',
    notes: 'Essential starting point for any location in Spain. Includes info on disability certificates, aid, and the Spanish Autism Center.',
    languages: ['Spanish']
  },
  // Global / World resources (accessible from anywhere)
  {
    id: 'ncaep-global',
    title: 'NCAEP - 28 Evidence-Based Practices (Global Gold Standard)',
    description: 'National Clearinghouse on Autism Evidence and Practice (USA, widely used internationally). Identifies 28 practices with strong evidence for children/youth with autism (e.g. Antecedent-Based Interventions, Discrete Trial Teaching, Naturalistic Interventions, Parent Training, Speech Generating Devices, etc.). Free AFIRM modules to learn how to use them.',
    type: 'support',
    location: 'Global',
    website: 'https://ncaep.fpg.unc.edu/ and AFIRM modules',
    notes: 'Core of the global knowledge base. Focus on these for daily work with your child. Many are parent-implementable with training.',
    languages: ['English', 'Some translations']
  },
  {
    id: 'asat-global',
    title: 'ASAT - Association for Science in Autism Treatment',
    description: 'Science-based reviews of treatments: what works, what needs more research, what does not work. Parent guides, treatment summaries (e.g. Early Intensive Behavioral Intervention, ESDM).',
    type: 'support',
    location: 'Global',
    website: 'https://asatonline.org',
    notes: 'Best place to evaluate any "new trend" or therapy. Protects against unproven or harmful approaches.',
    languages: ['English']
  },
  {
    id: 'cdc-act-early',
    title: 'CDC "Learn the Signs. Act Early." + Treatment Resources',
    description: 'Free milestone trackers, fact sheets, "Learn the Signs" materials for parents. Info on early intervention and treatments.',
    type: 'support',
    location: 'Global',
    website: 'https://www.cdc.gov/autism',
    notes: 'Excellent free tools for tracking development at home. Use while waiting for professionals.',
    languages: ['English', 'Some Spanish']
  },
  {
    id: 'esdm-parent',
    title: 'Early Start Denver Model (ESDM) - Parent Resources',
    description: 'Evidence-based early intervention (12-48 months, extendable) combining ABA and developmental approaches. Play-based, focuses on social communication, cognition. Parent involvement is key.',
    type: 'therapy',
    location: 'Global',
    website: 'Search "ESDM parent resources" or official sites',
    notes: 'Highly recommended for 5-year-olds. Many elements parents can use daily at home.',
    languages: ['English']
  }
];

// === GLOBAL KNOWLEDGE BASE (for AI agent and Trends section) ===
// Summaries from NCAEP, ASAT, CDC, recent reviews. Always cross-check latest.
export const globalKnowledge: GlobalKnowledge[] = [
  {
    id: 'ebp-28',
    title: '28 Evidence-Based Practices (NCAEP 2020/updated)',
    summary: 'Systematic review of interventions with positive effects for autistic children/youth. Key ones for 5yo: Naturalistic Interventions, Parent-Implemented Interventions, Discrete Trial Training, Prompting, Reinforcement, Social Skills Training, Speech Generating Devices (AAC), Visual Supports, etc. AFIRM modules teach step-by-step implementation.',
    source: 'NCAEP (ncaep.fpg.unc.edu)',
    category: 'evidence-based'
  },
  {
    id: 'early-intervention',
    title: 'Early Intervention is Critical',
    summary: 'Starting support as early as possible (even before formal diagnosis) improves outcomes in communication, social skills, adaptive behavior. Public systems like Spain\'s Atención Temprana exist for this. ESDM and intensive behavioral approaches have strong evidence.',
    source: 'CDC, NCAEP, multiple studies',
    category: 'early-intervention'
  },
  {
    id: 'parent-training',
    title: 'Parent Training & Coaching',
    summary: 'Programs teaching parents strategies (e.g. Incredible Years-ASLD tested in Spain, ESDM parent components) are highly effective. Parents become the primary "therapists" at home. Focus on naturalistic teaching during daily routines.',
    source: 'ASAT, NCAEP, Spanish studies',
    category: 'parent-training'
  },
  {
    id: 'daily-support',
    title: 'Practical Daily Strategies',
    summary: 'Use visual schedules, structured play, clear routines, positive reinforcement, sensory supports. Track what works for YOUR child. AAC (picture exchange or devices) helps non-verbal or emerging speakers. Combine with speech and occupational therapy.',
    source: 'NCAEP AFIRM modules, parent guides',
    category: 'daily-support'
  },
  {
    id: 'trends-2026',
    title: 'Current Trends (2025-2026)',
    summary: 'Growing use of AI for personalized support and screening (e.g. apps for behavior analysis, communication). Telehealth and parent coaching expand access. Emphasis on naturalistic/developmental approaches alongside behavioral. Focus on quality of life, inclusion, and reducing disparities. Always prioritize evidence over hype.',
    source: 'Recent reviews, ASAT, international reports',
    category: 'trends'
  }
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
