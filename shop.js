/**
 * Магазин, Stars, косметика, достижения, премиум-контент
 * В браузере без Telegram — тестовый режим (покупки бесплатно после подтверждения)
 */
(function () {
  const META_KEY = 'mol_meta_v1';

  const CATALOG = {
    theme_night: {
      id: 'theme_night',
      type: 'theme',
      title: 'Тема «Ночь»',
      desc: 'Тёмный интерфейс с холодным свечением',
      price: 50,
      cssClass: 'theme-night',
    },
    theme_warm: {
      id: 'theme_warm',
      type: 'theme',
      title: 'Тема «Плёнка»',
      desc: 'Тёплые тона, ретро-карточки',
      price: 50,
      cssClass: 'theme-warm',
    },
    theme_minimal: {
      id: 'theme_minimal',
      type: 'theme',
      title: 'Тема «Минимал»',
      desc: 'Светлый чистый вид',
      price: 40,
      cssClass: 'theme-minimal',
    },
    avatars_alt: {
      id: 'avatars_alt',
      type: 'avatar',
      title: 'Альтернативные аватары',
      desc: 'Другой набор эмодзи-возрастов',
      price: 75,
    },
    slot_4: {
      id: 'slot_4',
      type: 'slot',
      title: '4-й слот сохранения',
      desc: 'Ещё одна жизнь параллельно',
      price: 100,
    },
    bio_card: {
      id: 'bio_card',
      type: 'feature',
      title: 'Красивая открытка биографии',
      desc: 'Оформленный финал для шеринга',
      price: 30,
    },
    branch_abroad: {
      id: 'branch_abroad',
      type: 'branch',
      title: 'Ветка «Жизнь за границей»',
      desc: 'Эксклюзивные события переезда',
      price: 120,
    },
    branch_art: {
      id: 'branch_art',
      type: 'branch',
      title: 'Ветка «Творческий путь»',
      desc: 'Искусство вместо стандартной карьеры',
      price: 100,
    },
    branch_second: {
      id: 'branch_second',
      type: 'branch',
      title: 'Ветка «Второй шанс после 40»',
      desc: 'Перезапуск карьеры в среднем возрасте',
      price: 100,
    },
    undo_pack: {
      id: 'undo_pack',
      type: 'consumable',
      title: 'Отмена выбора (3 шт.)',
      desc: 'Откатить последний выбор в этапе',
      price: 40,
      amount: 3,
    },
    quiz_retry: {
      id: 'quiz_retry',
      type: 'consumable',
      title: 'Доп. попытка викторины',
      desc: 'Ещё один шанс в школьной мини-игре',
      price: 25,
      amount: 1,
    },
    skip_stage: {
      id: 'skip_stage',
      type: 'consumable',
      title: 'Пропустить этап',
      desc: 'Мгновенно завершить оставшиеся события этапа',
      price: 60,
      amount: 1,
    },
    rewind_stage: {
      id: 'rewind_stage',
      type: 'consumable',
      title: 'Переиграть этап',
      desc: 'Вернуться к началу только что пройденного этапа с другими решениями',
      price: 80,
      amount: 1,
    },
    second_chance: {
      id: 'second_chance',
      type: 'consumable',
      title: 'Второй шанс',
      desc: 'Спасти персонажа прямо в момент смерти — дешевле, чем переигрывать весь этап',
      price: 20,
      amount: 1,
    },
  };

  const ACHIEVEMENTS = [
    { id: 'born', title: 'Рождение', desc: 'Начать первую жизнь', check: (c) => c.ageMonths >= 0 },
    { id: 'school', title: 'Школьник', desc: 'Дойти до школы', check: (c) => c.ageMonths >= 72 },
    { id: 'adult', title: 'Взрослый', desc: 'Дожить до 25', check: (c) => c.ageMonths >= 300 },
    { id: 'elder', title: 'Седина', desc: 'Дожить до 60', check: (c) => c.ageMonths >= 720 },
    { id: 'complete', title: 'Полная жизнь', desc: 'Дойти до финала', check: (c) => c.flags?.life_complete },
    { id: 'parent', title: 'Родитель', desc: 'Завести ребёнка', check: (c) => c.flags?.has_children },
    { id: 'business', title: 'Своё дело', desc: 'Открыть бизнес', check: (c) => c.flags?.business_owner },
    { id: 'healthy', title: 'Крепкий', desc: 'Финал с health ≥ 70', check: (c) => c.flags?.life_complete && c.stats.health >= 70 },
    { id: 'socialite', title: 'Душа компании', desc: 'social ≥ 85 в финале', check: (c) => c.flags?.life_complete && c.stats.social >= 85 },
    { id: 'scholar', title: 'Умник', desc: 'intel ≥ 80 в финале', check: (c) => c.flags?.life_complete && c.stats.intel >= 80 },
  ];

  const ENDING_TYPES = [
    { id: 'natural', title: '🌅 Полная жизнь', desc: 'Пройти весь путь от рождения до старости' },
    { id: 'accident', title: '💥 Непредвиденная трагедия', desc: 'Жизнь оборвалась случайно, независимо от решений' },
    { id: 'illness', title: '🏥 Здоровье не выдержало', desc: 'Финал из-за долгих проблем со здоровьем' },
    { id: 'bankrupt', title: '📉 Банкротство', desc: 'Финал из-за глубокой финансовой ямы' },
    { id: 'burnout', title: '🕯️ Точка надлома', desc: 'Финал из-за эмоционального истощения' },
  ];

  const PROFESSION_BADGES = [
    { id: 'medicine', title: '🩺 Медицина', desc: 'Пройти жизнь врачом' },
    { id: 'engineering', title: '⚙️ Инженерия', desc: 'Пройти жизнь инженером' },
    { id: 'it', title: '💻 IT', desc: 'Пройти жизнь в технической специальности' },
    { id: 'business', title: '💼 Бизнес', desc: 'Пройти жизнь в бизнесе' },
    { id: 'law', title: '⚖️ Право', desc: 'Пройти жизнь юристом' },
    { id: 'arts', title: '🎨 Творчество', desc: 'Пройти жизнь в творческой специальности' },
    { id: 'trade', title: '🔧 Рабочая специальность', desc: 'Пройти жизнь с рабочей профессией' },
  ];

  function defaultMeta() {
    return {
      owned: {}, // id -> true or amount for consumable
      activeTheme: null,
      avatarsAlt: false,
      extraSlots: 0,
      undos: 0,
      achievements: {}, // id -> unlockedAt
      quizRetries: 0,
      testMode: true, // в браузере покупки через confirm
      livesArchive: [], // [{name, gender, country, ageMonths, cause, major, ironman, endedAt}]
      endingsSeen: {}, // cause -> true
      professionsSeen: {}, // major -> true
      streak: { lastDate: null, count: 0, claimedToday: false },
      ironmanCompleted: false,
    };
  }

  function archiveLife(char, cause) {
    if (!char) return;
    const m = loadMeta();
    m.livesArchive = m.livesArchive || [];
    m.endingsSeen = m.endingsSeen || {};
    m.professionsSeen = m.professionsSeen || {};
    const c = cause || 'natural';
    m.livesArchive.unshift({
      name: char.name,
      gender: char.gender,
      country: char.country,
      ageMonths: char.ageMonths,
      cause: c,
      major: char.flags?.major || null,
      ironman: !!char.ironman,
      endedAt: Date.now(),
    });
    if (m.livesArchive.length > 30) m.livesArchive.length = 30;
    m.endingsSeen[c] = true;
    if (char.flags?.major) m.professionsSeen[char.flags.major] = true;
    if (char.ironman && c === 'natural') m.ironmanCompleted = true;
    saveMeta(m);
  }

  /* ---------- Ежедневный стрик ---------- */
  // Награда не эмулирует Stars (это реальная платёжная валюта Telegram) —
  // выдаём бесплатные предметы напрямую, честно, без имитации денег.
  const STREAK_REWARDS = {
    1: { undos: 1, label: '+1 бесплатная отмена выбора' },
    2: { undos: 1, label: '+1 бесплатная отмена выбора' },
    3: { owned: 'quiz_retry', label: 'Бесплатная попытка викторины/экзамена' },
    4: { undos: 2, label: '+2 бесплатные отмены выбора' },
    5: { owned: 'quiz_retry', label: 'Бесплатная попытка викторины/экзамена' },
    6: { undos: 2, label: '+2 бесплатные отмены выбора' },
    7: { owned: 'bio_card', label: 'Открытка биографии открыта навсегда' },
  };
  const STREAK_MAX_DAY = 7;

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function checkDailyStreak() {
    const m = loadMeta();
    m.streak = m.streak || { lastDate: null, count: 0, claimedToday: false };
    const today = todayStr();
    if (m.streak.lastDate === today) {
      return { alreadyClaimed: true, day: m.streak.count || 1 };
    }
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (m.streak.lastDate === yesterday) {
      m.streak.count = (m.streak.count || 0) + 1;
    } else {
      m.streak.count = 1;
    }
    if (m.streak.count > STREAK_MAX_DAY) m.streak.count = 1;
    m.streak.lastDate = today;
    m.streak.claimedToday = false;
    saveMeta(m);
    return { alreadyClaimed: false, day: m.streak.count };
  }

  function claimDailyStreak() {
    const m = loadMeta();
    if (m.streak?.claimedToday) return null;
    const day = m.streak?.count || 1;
    const reward = STREAK_REWARDS[day] || STREAK_REWARDS[1];
    if (reward.undos) m.undos = (m.undos || 0) + reward.undos;
    if (reward.owned) m.owned[reward.owned] = (m.owned[reward.owned] || 0) + 1;
    m.streak.claimedToday = true;
    saveMeta(m);
    return { day, label: reward.label };
  }

  function loadMeta() {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (!raw) return defaultMeta();
      return { ...defaultMeta(), ...JSON.parse(raw) };
    } catch {
      return defaultMeta();
    }
  }

  function saveMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function maxSlots() {
    const m = loadMeta();
    return 3 + (m.extraSlots || 0) + (m.owned.slot_4 ? 1 : 0);
  }

  function owns(id) {
    return !!loadMeta().owned[id];
  }

  function applyTheme(themeId) {
    document.body.classList.remove('theme-night', 'theme-warm', 'theme-minimal');
    const item = CATALOG[themeId];
    if (item?.cssClass) document.body.classList.add(item.cssClass);
    const m = loadMeta();
    m.activeTheme = themeId || null;
    saveMeta(m);
  }

  function restoreTheme() {
    const m = loadMeta();
    if (m.activeTheme && m.owned[m.activeTheme]) applyTheme(m.activeTheme);
  }

  /**
   * Попытка купить. В Telegram — invoice; в браузере — confirm (тест).
   * onSuccess(item)
   */
  function purchase(itemId, onSuccess, onFail) {
    const item = CATALOG[itemId];
    if (!item) {
      onFail?.('Товар не найден');
      return;
    }
    const meta = loadMeta();
    if (item.type !== 'consumable' && meta.owned[itemId]) {
      onFail?.('Уже куплено');
      return;
    }

    const tg = window.Telegram?.WebApp;
    const canInvoice = tg && typeof tg.openInvoice === 'function';

    const grant = () => {
      const m = loadMeta();
      if (item.type === 'consumable') {
        if (itemId === 'undo_pack') m.undos = (m.undos || 0) + (item.amount || 1);
        m.owned[itemId] = (m.owned[itemId] || 0) + 1;
      } else {
        m.owned[itemId] = true;
        if (item.type === 'slot') m.extraSlots = 1;
        if (item.type === 'avatar') m.avatarsAlt = true;
        if (item.type === 'theme') {
          m.activeTheme = itemId;
          applyTheme(itemId);
        }
      }
      saveMeta(m);
      onSuccess?.(item);
    };

    // Реальный invoice нужен с бэкенда (link). Пока: тестовый режим + заглушка.
    if (canInvoice && !meta.testMode && item.invoiceLink) {
      tg.openInvoice(item.invoiceLink, (status) => {
        if (status === 'paid') grant();
        else onFail?.(status || 'отмена');
      });
      return;
    }

    // Браузер / тест: подтверждаем «оплату» Stars
    const ok = confirm(
      `Тест-покупка\n\n«${item.title}»\nЦена: ${item.price} ⭐\n\nВ Telegram здесь будет оплата Stars.\nЗачислить товар для теста?`
    );
    if (ok) grant();
    else onFail?.('отмена');
  }

  function checkAchievements(char) {
    if (!char) return [];
    const m = loadMeta();
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (m.achievements[a.id]) continue;
      try {
        if (a.check(char)) {
          m.achievements[a.id] = Date.now();
          unlocked.push(a);
        }
      } catch (_) {}
    }
    if (unlocked.length) saveMeta(m);
    return unlocked;
  }

  function useUndo() {
    const m = loadMeta();
    if ((m.undos || 0) <= 0) return false;
    m.undos -= 1;
    saveMeta(m);
    return true;
  }

  function consumeItem(id) {
    const m = loadMeta();
    if (!(m.owned[id] > 0)) return false;
    m.owned[id] -= 1;
    saveMeta(m);
    return true;
  }

  window.SHOP = {
    CATALOG,
    ACHIEVEMENTS,
    ENDING_TYPES,
    PROFESSION_BADGES,
    loadMeta,
    saveMeta,
    maxSlots,
    owns,
    purchase,
    applyTheme,
    restoreTheme,
    archiveLife,
    checkAchievements,
    useUndo,
    consumeItem,
    checkDailyStreak,
    claimDailyStreak,
  };
})();
