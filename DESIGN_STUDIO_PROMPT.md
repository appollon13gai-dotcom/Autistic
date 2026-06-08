# Compás TEA AI — Product & Design Specification

## Project summary
Build a web application called "Compás TEA AI" — a daily skill-training 
gym for children aged 5 with autism (ASD/TEA suspicion). Primary users: 
Russian-speaking families including refugees. The app supplements 
professional therapy (Atención Temprana etc.), it does not replace it.

## Research & Evidence Base (must inform all design decisions)
The design must be grounded in evidence-based practices for young children with autism and neurodiversity-friendly UX research:

- **Otsimo** (autism education apps): Uses highly visual, icon-based interfaces, PECS-style communication, gamified levels with immediate rewards, predictable routines, and special-interest customization. Research-backed for improving engagement, language, and social skills in preschoolers with ASD through simple, low-text, high-visual designs. See Otsimo case studies and founder interviews (e.g., "Why is Gamification an Effective Tool for Autistic Students?" ResearchAutism 2021; Otsimo official research citations including Ganz 2015 on AAC).

- **Hopebridge** (ABA centers): Emphasizes play-based learning, visual schedules, token economies (themed rewards), structured environments, and immediate positive reinforcement ("Happy, Relaxed, Engaged" philosophy). Their programs show strong outcomes in attention, skill acquisition, and motivation when visuals are clear, consistent, and tied to the child's interests. (Hopebridge resources on visual supports and token systems; ABA studies showing 73% average increase in target behaviors with token economies.)

- **Visual Supports research** (TEACCH program, NCAEP 28 Evidence-Based Practices, studies by Odom et al. and others): Visual supports (schedules, choice boards, icons paired with text) are among the strongest evidence-based interventions for improving communication, behavior, independence, and task completion in autistic children. They reduce anxiety through predictability. Key: high-contrast, simple icons; consistent placement; minimal clutter. (TEACCH official; "Using Visual Supports in ABA Therapy" articles 2025; meta-analyses in Journal of Autism and Developmental Disorders showing moderate to strong effects on adaptive skills.)

- **Gamification & Engagement for ASD** (research on game-based learning, e.g., "Gamification in Mobile Apps for Children With Disabilities" scoping review JMIR 2024 by Mahmoudi et al.; "Gamification Attributes to Enhance Socio-Vocational Readiness Among People with Autism" 2024; "Using Gamified Learning Apps to Enhance Social Skills in Children with ASD" studies): Levels, scores, achievements, immediate feedback, cause-and-effect mechanics, and collecting items significantly boost attention spans, motivation, and social/emotional development. Avoid failure states; focus on mastery and progress. Predictable game loops align with preference for routine. Otsimo and similar apps show children voluntarily spending 30-60+ minutes engaged.

- **Sensory & Attention Design** (studies on autistic UX, e.g., from uxdesign.cc "Designing for autistic people — overview of existing research" 2020; sensory integration research; color studies for ASD): Autistic preschoolers are often visual learners but sensitive to luminance/brightness and overload. Prefer muted/subtle colors (blue/green hues with grey undertones), low-arousal environments, slow/controlled animations, large touch targets, and high predictability. Incorporate special interests dramatically increases voluntary engagement and attention (ESDM principles). "Autism Design Principles for Schools" (NEN 2025) and "Aspect Autism Friendly Visual Design Guide" emphasize simplicity, space, and predictability.

- **Special Interests as Core Engagement Trigger** (ESDM, TEACCH, multiple ASD intervention studies; "Special interests in autism" research): When activities and visuals are themed around the child's intense interests (e.g., flags, geography, maps, countries), attention, motivation, and learning outcomes improve significantly. This turns "work" into intrinsically rewarding play. (Studies show 2-5x increase in engagement time; Reddit/parent reports and clinical observations confirm flags/geography as powerful hook for map-loving kids.)

- **Additional case studies**: "Designing UI & UX for Children with Autism in Touch Devices" (Otsimo Medium article); "Gamification in Pediatric Autism Diagnosis and Treatment" insights; "Innovative Framework for Enhanced Gamification in Autism Therapy (PIETI)" 2024; participatory design studies like "A Participatory Design Approach for Autistic Children" ISLS 2025.

Designs must reference and visibly draw from these. Include citations or "inspired by" notes in deliverables. Prioritize visual over verbal, immediate feedback, and interest-based personalization.

## Attention Triggers & Engagement Research (Expanded)
Research on autistic preschoolers (4-6 years) consistently shows these reliable triggers that attract, hold, and deepen attention, leading to voluntary engagement and desire to repeat activities. All design decisions must leverage these:

- **Special Interests (Highest Impact Trigger)**: Intense focus on topics like flags, world maps, countries, geography, dinosaurs, trains, etc. Integrating these into every visual, narrative, reward, and exercise name turns passive attention into active desire to participate. Example: A child obsessed with world flags will stare at, interact with, and request more of flag-themed visuals, maps, and "collect the countries" mechanics far longer than generic content. (Supported by ESDM research on interest-based engagement and multiple studies on special interests increasing motivation 2-5x.)

- **Visual Supports & Predictability** (TEACCH, visual schedules research; NCAEP evidence-based practices): Clear icons, step-by-step picture sequences, consistent layouts, and "what comes next" visuals reduce cognitive load and anxiety, freeing attention for the task. Children often sustain focus 2-3x longer with visual vs. verbal-only instructions. Otsimo and similar apps demonstrate this with PECS-style visuals and schedules leading to independent use.

- **Immediate Positive Reinforcement & Gamification** (ABA/ESDM, game-based learning studies from Hopebridge-style programs and "Game-based learning for kids with autism" research): Rewards within seconds of action (visual "ding", collecting items, character celebration, progress bar fill). Levels, streaks, badges, and collecting mechanics (e.g., "flag collection album") create dopamine loops that make children *ask* to continue. Cause-and-effect is highly motivating. Hopebridge data shows token economies and immediate feedback improve attention and skill acquisition significantly.

- **Characters as Companions** (ESDM play-based, social stories research): A consistent, friendly character who "does the activity with you" (not teaches at you) builds emotional connection and models success. When the character shares the child's interest (e.g., a flag-collecting explorer dino), engagement skyrockets. Visual and narrative consistency (Otsimo model) helps.

- **Sensory-Friendly Visuals** (sensory integration + UX research; studies on autistic UX from uxdesign.cc and color research): Muted but joyful color palettes (blues/greens with accents, grey undertones), high contrast without brightness overload, rounded shapes, slow gentle animations, plenty of white space. Avoid clutter, flashing, or loud patterns — these scatter attention. Subtle textures or patterns (e.g., map lines) can add interest without overload. Research shows autistic children prefer subtle blue/green hues for focus.

- **Mastery & Choice** (self-determination + positive behavior support): Visible progress (character grows, flag map fills), opportunities to choose activities, and celebrating "you did it!" without pressure. Children with ASD often crave control and competence; seeing themselves as the "hero" who masters flags/geography builds intrinsic motivation.

- **Multi-Modal but Controlled** (OT + app research): Pair strong visuals with optional simple audio (character voice saying the country name) or tactile printables. Repetition of successful routines is soothing and focusing.

These triggers, when combined (especially special interest + visuals + immediate win), frequently result in children independently initiating or requesting the activities — exactly the "desire to want to engage" goal.

**Incorporate the child's passion for world flags and country locations as the primary special interest example throughout** (exercise themes, character adventures "collecting flags", map-based progress visuals, geography games, flag-matching, "travel the world" narratives, etc.). This is a powerful, real-world hook for attention and learning — use real simplified maps, flag icons, outlines, and basic facts (e.g., "This flag is from the country with the Eiffel Tower!"). Turn the companion into a "flag-collecting explorer" who "travels" with the child. Printable maps and flag cards become highly motivating collectibles. Research (including interest-based interventions) shows this can dramatically extend voluntary engagement time.

---

## Core concept: "Спортзал Суперзверей" (Supercreature Gym)

The child is the HERO and COACH. The companion character trains alongside 
the child — not a teacher, not a doctor, a teammate.

### Character system
- On first launch, parent selects a companion: dinosaur / fox / bear / cat
- Character has a name chosen by the child
- Character GROWS with the child: gains accessories, new emotions, new size
- Character speaks in the child's interest language (if dino lover → 
  character roars, uses dino metaphors everywhere)
- Special interest personalization: parent sets child's top interest 
  (dinosaurs / trains / space / cats / cars / **world flags & geography** / etc.) on onboarding. 
  ALL exercise names, reward language, tips, and character voice adapt 
  to that interest automatically.

### Naming example (interest = world flags & geography, child = Natan):
- Currency: flags / passport stamps (not stars/coins)
- Exercises: "Собираем флаги" / "Карта мира для Рэкса" / "Привет, Флаг Рэкс!"
- Victory phrase: "Ура! Мы добавили флаг [Страны] в коллекцию!"
- Tips written as: "Рэкс говорит: 'Смотри, этот флаг из страны, где живут жирафы!'"
- Progress: "Рэкс посетил 47 стран! Коллекция флагов растёт!"

**Special interest integration note for flags/geography**: Use real (simplified) world maps, flag icons, country outlines, and simple geography facts as the backbone of many exercises and visuals. This is a powerful, authentic attention magnet for the child. Turn the companion into a "flag-collecting explorer" who "travels" with the child. Printable maps and flag cards become highly motivating collectibles.

---

## Color & visual system

### Color philosophy
Color must belong to the child's world, not be generic.
Default (dinosaur theme):
  - Primary dark:   #1A3A1C  (dark jungle green)
  - Primary mid:    #2D6A2F
  - Accent lime:    #7BC42A
  - Accent amber:   #F5A623
  - Accent orange:  #E8621A
  - Background:     #F0FAF0
  - Card bg:        #FFFFFF
  - Bone/reward bg: #FFF8D6

Theme palette switches per special interest:
  - Space theme  → deep indigo #0D0D2B + silver #C0C8D8 + white
  - Trains theme → graphite #2C2C2C + steel blue #4A6FA5 + red #D94F2A
  - Cats theme   → warm cream #FFF8EE + terracotta #C4622D + rose #E8A0A0
  - Default (no strong interest) → lavender #7C5FD4 + mint #2ECC8A

### Typography
Font: Nunito (Google Fonts), weights 400 / 700 / 800 / 900.
Nunito chosen for rounded letterforms — reduces visual anxiety.
Never use: Inter, Roboto, Arial, system fonts.

### Visual rules
- Border radius: 18–22px on cards, 14px on smaller elements, 50% on badges
- Shadows: soft, green-tinted: 0 4px 18px rgba(45,106,47,0.13)
- Animations: slow bounce on companion (3–4s loop), NO flashing, 
  NO rapid transitions. All animations ease-in-out.
- Touch targets: minimum 48px height on all interactive elements
- High contrast text on all colored backgrounds (always darkest shade 
  of same color family, never black on colored bg)
- Background texture: subtle repeating diagonal lines 
  (rgba green 5% opacity) on hero banners — adds depth without noise
- Progress bars: always animated on entry (grow from 0), 
  rounded ends, gradient fill

---

## App structure — 4 main sections

### 1. Home (Главная)
- Hero banner: companion character + child's name tag + greeting in 
  character's voice + XP/level bar
- Streak badge (fire emoji + "N дней подряд!")
- Daily plan: 3 exercise cards in a grid (done state shows green 
  border + checkmark badge)
- Category pills row: 6 skill categories, color-coded, tap to filter
- Companion tip: character says something related to today's exercise, 
  framed in special interest language

### 2. Exercise screen (Тренировка)
Layout for a single exercise:
- Hero banner: dark bg + texture + exercise icon + title + description 
  in character voice + tags (category / duration / XP reward)
- Reward preview box: dashed border, shows what character earns 
  (accessory) + badge name child earns
- Step-by-step instructions: numbered cards, plain language for parent, 
  tips written as character speech
- Companion tip: green left-border callout with character icon
- CTA button: full width, dark green, "Character caught the skill! Done!"
- Celebration state (replaces button on tap): 
  large character emoji + bones/reward row + success message + 
  next exercise button

### 3. Printable schedule card (Карточка / Шаблон)
- White card with colored border, fully print-ready layout
- Header: large companion emoji + child's name + date + 
  color-coded divider bar
- 4×2 grid of schedule boxes: emoji icon + label + checkbox
  (done state = green filled checkbox with ✓)
- Reward tracker: 5 slots at bottom (bone/star/rocket per theme)
  filled slots show earned state
- Photo/sticker placeholder: dashed box labeled for child's sticker
- Language switcher: RU / ES / EN / UA buttons
- Print button + "Choose different template" button

### 4. Progress / Records (Рекорды)
- Hero: dark bg + big number (sessions completed) + character growth stat
- Confetti/emoji celebration row
- Skills grid: 2×2 cards, each shows category icon + name + 
  progress bar (color matches category) + session count
- Medals row: earned medals show full color, locked medals show at 40% 
  opacity. Medal icons relate to special interest.
- Character speech bubble at bottom: character comments on progress 
  in special interest language, motivates next session

---

## Skill categories (6 total)
Each has a fixed color and emoji:
1. Сенсорика    — green    #E4F5D4 / #1A5A1C — 👂
2. Общение      — purple   #EDE8FD / #4A2CA0 — 🗣️
3. Социальная игра — green #E4F5D4 / #1A5A1C — 🤝
4. Моторика     — orange   #FDE8D8 / #8A2800 — ✋
5. Познание     — amber    #FFF3C4 / #7A4800 — 🧠
6. Самообслуживание — orange #FDE8D8 / #8A2800 — 🧴
+ Special interest exercises category (themed per child's interest) — 🦖/🚂/🚀

---

## Gamification system
- XP currency: themed per interest (bones / stars / rockets / yarn balls)
- Level titles: themed (Охотник / Космонавт / Машинист / etc.)
- Character growth: visible size/accessory changes at level milestones
- Streak counter: resets if day missed, shown prominently
- Medals: earned on specific achievements (10 greetings / 7-day streak / 
  20 sessions / etc.), always tied to special interest theme
- Reward preview BEFORE exercise (not after) — critical for ASD 
  motivation: child knows exactly what they're working toward
- Immediate celebration on completion — no delay, 1–3 seconds max

---

## Two audiences, two modes
### Parent mode (default)
- Full navigation, settings, exercise instructions in plain adult language
- Progress tracking, notes, AI chat
- Configure child's name, special interest, companion character
- Access to printable templates

### Child-facing screens
- Exercise completion button and celebration screen
- Companion growth/accessories view
- Medal collection view
These screens use largest font (minimum 16px body, 22px+ headings), 
maximum touch targets, minimum text, maximum visual reward.

---

## Language support
Russian (default) / Spanish / English / Ukrainian.
All UI strings externalized. Special interest vocabulary 
(exercise names, character speech) also translatable per language.

---

## Technical requirements
- Web app: desktop + tablet primary, touch-friendly
- Responsive: works on iPad and 1280px+ desktop
- Font: load Nunito from Google Fonts
- No flashing animations (epilepsy / sensory safety)
- All interactive elements minimum 48px touch target
- Printable template: renders cleanly at A4 / Letter when browser 
  print dialog opened (use @media print styles)
- Store child profile locally (name, interest, companion, progress)

---

## Design principles hierarchy (in order of priority)
1. Child wants to come back tomorrow ("хочу ещё поиграть")
2. Special interest is visible everywhere — child recognizes their world
3. Predictability and structure (TEACCH): child always knows what comes next
4. Immediate positive feedback (ABA): reward within 1–3 seconds of action
5. No sensory overload: no flashing, no chaos, calm base + joyful accents
6. Parent has full control and clear information
7. Multilingual without losing personality

---

## What NOT to do
- No medical/clinical language anywhere in child-facing UI
- No "therapy" / "treatment" / "disorder" vocabulary in child screens
- No rapid animations or flashing
- No dark patterns or anxiety-inducing UI (countdown timers, 
  failure states, red X marks)
- No generic purple-gradient-on-white AI aesthetic
- No Inter / Roboto / Arial
- No tiny tap targets
- Never show "wrong" or "failed" — only "not yet" / "try again with Rэкс"
```

---

Несколько комментариев к промпту:

Раздел «What NOT to do» критически важен — большинство агентов без него дрейфуют к generic-решениям. Запрет на клинический язык в детских экранах защищает концепцию «спортзал, не больница».

Раздел приоритетов дизайна нужен потому, что когда агент столкнётся с противоречиями («сделать красиво vs. сделать предсказуемо»), у него есть иерархия для решения.

Если агент поддерживает системный промпт отдельно от задачи — первые два раздела (summary + concept) кидай в system, остальное в user.