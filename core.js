/**
 * Универсальное ядро «Моя обычная жизнь»
 * character + saves + stage runner
 */

const STORAGE_KEY = 'mol_saves_v1';
const BASE_SLOTS = 3;

function getMaxSlots() {
  try {
    return window.SHOP ? window.SHOP.maxSlots() : BASE_SLOTS;
  } catch {
    return BASE_SLOTS;
  }
}

const DEFAULT_STATS = {
  health: 70,
  happy: 70,
  intel: 40,
  social: 50,
  resilience: 50,
  independence: 30,
  money: 0,
};

function createCharacter({ name, gender, country, income }) {
  return {
    name: name || 'Малыш',
    gender: gender || 'm',
    country: country || 'kz',
    income: income || 'mid',
    ageMonths: 0,
    stageId: '0-3',
    periodIndex: 0,
    stats: { ...DEFAULT_STATS },
    // доход семьи влияет на стартовые условия
    familyMoney: income === 'high' ? 80 : income === 'low' ? 30 : 55,
    relationships: {
      mother: 80,
      father: 75,
    },
    flags: {},
    path: {}, // tag -> weight
    history: [], // краткие записи для биографии
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function applyEffects(char, effects = {}) {
  if (!effects) return;
  if (effects.stats) {
    for (const [k, v] of Object.entries(effects.stats)) {
      if (char.stats[k] === undefined) continue;
      let delta = v;
      // убывающая отдача: не разгонять статы в потолок
      if (v > 0 && char.stats[k] >= 85) delta = Math.max(1, Math.round(v * 0.25));
      else if (v > 0 && char.stats[k] >= 70) delta = Math.max(1, Math.round(v * 0.5));
      // сильные штрафы к деньгам смягчаем
      if (k === 'money' && v < -12) delta = Math.round(v * 0.6);
      // сильные удары по счастью/здоровью не обнуляют жизнь
      if ((k === 'happy' || k === 'health') && v < -6) delta = Math.round(v * 0.7);
      char.stats[k] = clamp(char.stats[k] + delta);
      if (k === 'happy' && char.stats[k] < 12) char.stats[k] = 12;
      if (k === 'health' && char.stats[k] < 15) char.stats[k] = 15;
    }
  }
  if (effects.relationships) {
    for (const [k, v] of Object.entries(effects.relationships)) {
      char.relationships[k] = clamp((char.relationships[k] || 50) + v);
    }
  }
  if (effects.flags) {
    Object.assign(char.flags, effects.flags);
  }
  if (effects.path) {
    for (const [tag, w] of Object.entries(effects.path)) {
      char.path[tag] = (char.path[tag] || 0) + w;
    }
  }
  if (effects.history) {
    char.history.push(effects.history);
  }
  char.updatedAt = Date.now();
}

function getPathTraits(char, minWeight = 2) {
  return Object.entries(char.path)
    .filter(([, w]) => w >= minWeight)
    .map(([tag, w]) => ({ tag, w }))
    .sort((a, b) => b.w - a.w);
}

function ageLabel(months) {
  if (months < 12) return `${months} мес.`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (m === 0) return `${y} ${yearWord(y)}`;
  return `${y} ${yearWord(y)} ${m} мес.`;
}

function yearWord(y) {
  const n = y % 10;
  const n2 = y % 100;
  if (n2 >= 11 && n2 <= 14) return 'лет';
  if (n === 1) return 'год';
  if (n >= 2 && n <= 4) return 'года';
  return 'лет';
}

/* ---------- Saves ---------- */

function loadAllSaves() {
  const max = getMaxSlots();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return Array(max).fill(null);
    const arr = JSON.parse(raw);
    while (arr.length < max) arr.push(null);
    return arr.slice(0, max);
  } catch {
    return Array(max).fill(null);
  }
}

function writeAllSaves(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function saveToSlot(slotIndex, character) {
  const all = loadAllSaves();
  all[slotIndex] = JSON.parse(JSON.stringify(character));
  writeAllSaves(all);
}

function loadFromSlot(slotIndex) {
  const all = loadAllSaves();
  return all[slotIndex] ? JSON.parse(JSON.stringify(all[slotIndex])) : null;
}

function deleteSlot(slotIndex) {
  const all = loadAllSaves();
  all[slotIndex] = null;
  writeAllSaves(all);
}

function findLatestSlot() {
  const all = loadAllSaves();
  let best = -1;
  let bestTime = 0;
  all.forEach((s, i) => {
    if (s && s.updatedAt > bestTime) {
      bestTime = s.updatedAt;
      best = i;
    }
  });
  return best;
}

/* ---------- Stage registry ---------- */

const StageRegistry = {};

function registerStage(stage) {
  StageRegistry[stage.id] = stage;
}

function getStage(id) {
  return StageRegistry[id] || null;
}

/**
 * Универсальный проигрыватель этапа.
 * stage = { id, title, ageStartMonths, stepMonths, periods: [ { events: [...] } ] }
 * event = { id, title, text, scene?, condition?, choices: [{ text, effects, next? }] }
 */
function getAvailableEvents(stage, periodIndex, char) {
  const period = stage.periods[periodIndex];
  if (!period) return [];
  return (period.events || []).filter((ev) => {
    if (!ev.condition) return true;
    return ev.condition(char);
  });
}

/* ---------- Жизненные риски: болезнь, банкротство, стресс, случайность ---------- */

// Базовый шанс «независимой» трагедии за один период — растёт в старости
const STAGE_RISK = {
  '0-3': 0.0006,
  '3-6': 0.0006,
  '6-11': 0.0009,
  '11-16': 0.0013,
  '16-18': 0.0013,
  '18-25': 0.0018,
  '25-40': 0.002,
  '40-60': 0.0032,
  '60-end': 0.02,
};

/**
 * Проверяет, не оборвалась ли жизнь между периодами.
 * Возвращает null (всё в порядке) либо { type, title, text }.
 * Вызывается один раз при переходе к следующему периоду.
 */
function evaluateLifeRisk(char) {
  if (!char || char.flags?.dead) return null;

  // 1. Случайность, не зависящая от решений игрока
  const baseRisk = STAGE_RISK[char.stageId] ?? 0.0015;
  if (Math.random() < baseRisk) {
    return {
      type: 'accident',
      title: '💥 Непредвиденная трагедия',
      text: 'Иногда жизнь обрывается без предупреждения и без всякой связи с тем, что мы делали правильно или неправильно. Так случилось и здесь — от этого никто не застрахован.',
    };
  }

  // 2. Здоровье критически низкое — риск смерти от болезни
  if (char.stats.health <= 12) {
    char._healthCrisisStreak = (char._healthCrisisStreak || 0) + 1;
    const chance = 0.05 + (char._healthCrisisStreak - 1) * 0.07;
    if (Math.random() < chance) {
      return {
        type: 'illness',
        title: '🏥 Здоровье не выдержало',
        text: 'Долгие годы проблем со здоровьем и нехватка заботы о себе взяли своё. Болезнь оказалась сильнее, чем удавалось противостоять.',
      };
    }
  } else {
    char._healthCrisisStreak = 0;
  }

  // 3. Деньги на дне долгое время — банкротство.
  // Применимо только со взрослого возраста: у ребёнка нет личных финансов,
  // money=0 в детстве — это норма, а не долговая яма.
  const ADULT_MONEY_STAGES = ['18-25', '25-40', '40-60', '60-end'];
  if (ADULT_MONEY_STAGES.includes(char.stageId) && char.stats.money <= 4) {
    char._debtStreak = (char._debtStreak || 0) + 1;
    if (char._debtStreak >= 3) {
      const chance = 0.15 + (char._debtStreak - 3) * 0.1;
      if (Math.random() < chance) {
        return {
          type: 'bankrupt',
          title: '📉 Банкротство',
          text: 'Долги росли быстрее, чем находились решения. Финансовая яма оказалась без дна — с этой точки историю этой жизни продолжать больше некуда.',
        };
      }
    }
  } else if (!ADULT_MONEY_STAGES.includes(char.stageId)) {
    char._debtStreak = 0;
  }

  // 4. Счастье и устойчивость на дне одновременно — эмоциональное истощение.
  // Осмысленно начиная с подросткового возраста.
  const BURNOUT_STAGES = ['11-16', '16-18', '18-25', '25-40', '40-60', '60-end'];
  if (BURNOUT_STAGES.includes(char.stageId) && char.stats.happy <= 12 && char.stats.resilience <= 15) {
    char._burnoutStreak = (char._burnoutStreak || 0) + 1;
    if (char._burnoutStreak >= 3) {
      const chance = 0.12 + (char._burnoutStreak - 3) * 0.08;
      if (Math.random() < chance) {
        return {
          type: 'burnout',
          title: '🕯️ Точка надлома',
          text: 'Слишком долго всё держалось на пределе — без опоры и без передышки. Внутренний ресурс закончился, и жизнь потребовала остановки, к которой уже нельзя было вернуться.',
        };
      }
    }
  } else if (!BURNOUT_STAGES.includes(char.stageId)) {
    char._burnoutStreak = 0;
  }

  return null;
}

window.MOL = {
  createCharacter,
  applyEffects,
  getPathTraits,
  ageLabel,
  loadAllSaves,
  saveToSlot,
  loadFromSlot,
  deleteSlot,
  findLatestSlot,
  registerStage,
  getStage,
  getAvailableEvents,
  evaluateLifeRisk,
  clamp,
};
