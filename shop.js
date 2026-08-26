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
    };
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

  window.SHOP = {
    CATALOG,
    ACHIEVEMENTS,
    loadMeta,
    saveMeta,
    maxSlots,
    owns,
    purchase,
    applyTheme,
    restoreTheme,
    checkAchievements,
    useUndo,
  };
})();
