/**
 * Точка входа игры + магазин, достижения, мини-игра
 */
(function () {
  const { MOL, UI, SHOP } = window;

  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  } catch (_) {}

  if (SHOP) SHOP.restoreTheme();

  let state = {
    char: null,
    slot: 0,
    stage: null,
    periodIndex: 0,
    eventQueue: [],
    sound: true,
    lastChoiceSnapshot: null,
    quiz: null,
  };

  function autoSave() {
    if (state.char) MOL.saveToSlot(state.slot, state.char);
  }

  function notifyAchievements(list) {
    if (!list?.length) return;
    const names = list.map((a) => a.title).join(', ');
    setTimeout(() => alert('🏆 Достижение: ' + names), 300);
  }

  function startNewGame() {
    UI.showScreen('create');
    UI.$('input-name').value = '';
    document.querySelectorAll('[data-gender]').forEach((b) => b.classList.remove('active'));
    document.querySelector('[data-gender="m"]')?.classList.add('active');
    document.querySelectorAll('[data-ironman]').forEach((b) => b.classList.remove('active'));
    document.querySelector('[data-ironman="off"]')?.classList.add('active');
  }

  function confirmCreate() {
    const name = UI.$('input-name').value.trim() || 'Малыш';
    const gender = document.querySelector('[data-gender].active')?.dataset.gender || 'm';
    const ironman = document.querySelector('[data-ironman].active')?.dataset.ironman === 'on';
    const country = UI.$('input-country').value;
    const income = UI.$('input-income').value;
    const saves = MOL.loadAllSaves();
    let slot = saves.findIndex((s) => !s);
    if (slot < 0) slot = 0;

    state.slot = slot;
    state.char = MOL.createCharacter({ name, gender, country, income });
    state.char.ironman = ironman;
    state.stage = MOL.getStage('0-3');
    state.periodIndex = 0;
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
    beginPeriod();
  }

  function continueLatest() {
    const idx = MOL.findLatestSlot();
    if (idx < 0) {
      alert('Нет сохранений. Начни новую жизнь.');
      return;
    }
    loadSlot(idx);
  }

  const DEATH_CAUSE_INFO = {
    accident: { type: 'accident', title: '💥 Непредвиденная трагедия', text: 'Эта жизнь оборвалась внезапно, независимо от принятых решений.' },
    illness: { type: 'illness', title: '🏥 Здоровье не выдержало', text: 'Долгие проблемы со здоровьем в итоге взяли своё.' },
    bankrupt: { type: 'bankrupt', title: '📉 Банкротство', text: 'Финансовая яма оказалась без дна.' },
    burnout: { type: 'burnout', title: '🕯️ Точка надлома', text: 'Внутренний ресурс закончился раньше, чем получилось найти опору.' },
  };

  function loadSlot(i) {
    const ch = MOL.loadFromSlot(i);
    if (!ch) return;
    state.slot = i;
    state.char = ch;
    state.stage = MOL.getStage(ch.stageId) || MOL.getStage('0-3');
    state.periodIndex = ch.periodIndex || 0;

    if (ch.flags?.dead) {
      const info = DEATH_CAUSE_INFO[ch.flags.death_cause] || { title: 'Жизнь завершена', text: '' };
      showDeathEnding(info);
      return;
    }
    if (ch.flags?.life_complete) {
      showEnding();
      return;
    }
    if (state.periodIndex >= (state.stage?.periods?.length || 0)) {
      showStageSummary();
      return;
    }
    beginPeriod();
  }

  function beginPeriod() {
    const stage = state.stage;
    const pIdx = state.periodIndex;
    if (!stage || pIdx >= stage.periods.length) {
      showStageSummary();
      return;
    }
    // Снимок состояния на начало этапа — нужен для «Переиграть этап за ⭐»
    if (pIdx === 0) {
      state.char._stageSnapshots = state.char._stageSnapshots || {};
      if (!state.char._stageSnapshots[stage.id]) {
        const clone = JSON.parse(JSON.stringify(state.char));
        delete clone._stageSnapshots;
        state.char._stageSnapshots[stage.id] = clone;
      }
    }
    // мини-игра: школьная викторина в начале 1 класса
    if (stage.id === '6-11' && pIdx === 0 && !state.char.flags.quiz_done) {
      startQuiz();
      return;
    }
    state.shownInPeriod = new Set();
    UI.showScreen('play');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    nextEvent();
  }

  function nextEvent() {
    const stage = state.stage;
    const pIdx = state.periodIndex;
    // Условия событий проверяются заново на каждом шаге — так события,
    // зависящие от флага, поставленного другим выбором в ЭТОМ ЖЕ периоде
    // (например, выбор специальности после выбора «поступать в университет»),
    // корректно появляются следом, а не пропускаются.
    const available = MOL.getAvailableEvents(stage, pIdx, state.char).filter(
      (ev) => !state.shownInPeriod.has(ev.id)
    );

    if (!available.length) {
      state.char.ageMonths += stage.stepMonths;
      state.periodIndex += 1;
      state.char.periodIndex = state.periodIndex;

      // Проверка: не оборвалась ли жизнь между периодами
      const risk = MOL.evaluateLifeRisk(state.char);
      if (risk) {
        offerSecondChanceOrDie(risk);
        return;
      }

      autoSave();
      notifyAchievements(SHOP.checkAchievements(state.char));
      if (state.periodIndex >= stage.periods.length) showStageSummary();
      else beginPeriod();
      return;
    }

    const ev = available[0];
    state.shownInPeriod.add(ev.id);
    // снимок для undo
    state.lastChoiceSnapshot = JSON.parse(JSON.stringify(state.char));

    if (ev.minigame === 'exam') { startExam(ev); return; }
    if (ev.minigame === 'interview') { startInterview(ev); return; }
    if (ev.minigame === 'budget') { startBudget(ev); return; }

    const periodLabel = stage.periods[pIdx]?.label || '';
    UI.renderEvent(ev, periodLabel, (choice) => onChoice(choice));
  }

  function onChoice(choice) {
    if (choice.requiresPremium && !SHOP.owns(choice.requiresPremium)) {
      if (confirm('Это премиум-ветка. Открыть магазин?')) openShop();
      return;
    }
    const before = { ...state.char.stats };
    MOL.applyEffects(state.char, choice.effects);
    const changed = {};
    for (const k of Object.keys(state.char.stats)) {
      changed[k] = state.char.stats[k] - (before[k] || 0);
    }
    UI.updateStats(state.char, changed);
    UI.updateHeader(state.char);
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
    setTimeout(nextEvent, 180);
  }

  function buildBiography(char) {
    const lines = [];
    lines.push(`${char.name}, ${MOL.ageLabel(char.ageMonths)}.`);
    if (char.history?.length) {
      lines.push('');
      lines.push('Ключевые моменты:');
      char.history.slice(-12).forEach((h) => lines.push('• ' + h));
    }
    const traits = MOL.getPathTraits(char, 2).slice(0, 8);
    if (traits.length) {
      lines.push('');
      lines.push('Черты: ' + traits.map((t) => t.tag).join(', '));
    }
    return lines.join('\n');
  }

  function showStageSummary() {
    UI.showScreen('summary');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    UI.renderSummary(
      state.char,
      state.stage?.title || 'Этап',
      () => {
        const nextId = state.stage?.nextStageId;
        if (nextId && MOL.getStage(nextId)) {
          state.stage = MOL.getStage(nextId);
          state.char.stageId = nextId;
          state.periodIndex = 0;
          state.char.periodIndex = 0;
          if (state.char.ageMonths < state.stage.ageStartMonths) {
            state.char.ageMonths = state.stage.ageStartMonths;
          }
          autoSave();
          beginPeriod();
          return;
        }
        showEnding();
      },
      () => {
        autoSave();
        goMenu();
      }
    );
  }

  function showEnding() {
    UI.showScreen('end');
    UI.$('header').classList.add('hidden');
    UI.$('stats-bar').classList.add('hidden');
    state.char.flags.life_complete = true;
    UI.$('end-title').textContent = 'Жизнь пройдена';
    const bio = buildBiography(state.char);
    UI.$('end-text').textContent = bio;
    UI.$('end-bio').classList.add('hidden');
    if (!state.char.flags._archived) {
      SHOP.archiveLife(state.char, 'natural');
      state.char.flags._archived = true;
    }
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
  }

  // Экран внезапного завершения жизни: болезнь, банкротство, срыв, несчастный случай
  function showDeathEnding(cause) {
    UI.showScreen('end');
    UI.$('header').classList.add('hidden');
    UI.$('stats-bar').classList.add('hidden');
    UI.$('end-title').textContent = cause.title;
    const intro = cause.text + '\n\n';
    const bio = buildBiography(state.char);
    UI.$('end-text').textContent = intro + bio;
    UI.$('end-bio').classList.add('hidden');
    if (!state.char.flags._archived) {
      SHOP.archiveLife(state.char, cause.type || 'accident');
      state.char.flags._archived = true;
    }
    autoSave();
  }

  function finalizeDeath(risk) {
    state.char.flags.dead = true;
    state.char.flags.death_cause = risk.type;
    autoSave();
    showDeathEnding(risk);
  }

  // Предлагает купить «Второй шанс» прямо в момент смерти (дешевле, чем rewind этапа).
  // В Ironman недоступно — жизнь заканчивается сразу.
  function offerSecondChanceOrDie(risk) {
    if (state.char.ironman) {
      finalizeDeath(risk);
      return;
    }

    const restoreAndContinue = () => {
      // небольшое восстановление, чтобы не умереть от того же порога в тот же миг
      state.char.stats.health = Math.max(state.char.stats.health, 30);
      state.char.stats.happy = Math.max(state.char.stats.happy, 25);
      state.char.stats.resilience = Math.max(state.char.stats.resilience, 25);
      state.char.stats.money = Math.max(state.char.stats.money, 15);
      state.char._debtStreak = 0;
      state.char._healthCrisisStreak = 0;
      state.char._burnoutStreak = 0;
      autoSave();
      notifyAchievements(SHOP.checkAchievements(state.char));
      if (state.periodIndex >= state.stage.periods.length) showStageSummary();
      else beginPeriod();
    };

    const meta = SHOP.loadMeta();
    if ((meta.owned.second_chance || 0) > 0) {
      const useIt = confirm(
        `${risk.title}\n\n${risk.text}\n\nУ тебя есть «Второй шанс» (уже куплен). Использовать, чтобы спасти персонажа?`
      );
      if (useIt) {
        SHOP.consumeItem('second_chance');
        restoreAndContinue();
        return;
      }
      finalizeDeath(risk);
      return;
    }

    const wantsToBuy = confirm(
      `${risk.title}\n\n${risk.text}\n\nМожно спасти персонажа за 20⭐ («Второй шанс») — дешевле, чем переигрывать весь этап. Купить?`
    );
    if (!wantsToBuy) { finalizeDeath(risk); return; }
    SHOP.purchase(
      'second_chance',
      () => {
        SHOP.consumeItem('second_chance');
        restoreAndContinue();
      },
      () => finalizeDeath(risk)
    );
  }

  function refreshStreakBanner() {
    const res = SHOP.checkDailyStreak();
    const banner = UI.$('streak-banner');
    const text = UI.$('streak-text');
    if (res.alreadyClaimed) {
      banner.classList.add('hidden');
      return;
    }
    text.textContent = `🔥 День ${res.day} подряд — есть бесплатная награда`;
    banner.classList.remove('hidden');
  }

  function goMenu() {
    UI.showScreen('menu');
    UI.$('header').classList.add('hidden');
    UI.$('stats-bar').classList.add('hidden');
    refreshStreakBanner();
  }

  /* ---------- Shop UI ---------- */
  function openShop() {
    UI.showScreen('shop');
    const list = UI.$('shop-list');
    list.innerHTML = '';
    const meta = SHOP.loadMeta();
    Object.values(SHOP.CATALOG).forEach((item) => {
      const owned = item.type === 'consumable' ? false : !!meta.owned[item.id];
      const div = document.createElement('div');
      div.className = 'shop-item' + (owned ? ' owned' : '');
      div.innerHTML = `
        <div class="shop-item-top">
          <div>
            <strong>${item.title}</strong>
            <div class="desc">${item.desc}</div>
          </div>
          <span class="shop-price">${owned ? '✓ Есть' : item.price + ' ⭐'}</span>
        </div>`;
      if (!owned) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.style.marginTop = '8px';
        btn.textContent = 'Купить';
        btn.onclick = () => {
          SHOP.purchase(
            item.id,
            () => {
              alert('Получено: ' + item.title);
              openShop();
            },
            (e) => {
              if (e !== 'отмена') alert('Не удалось: ' + e);
            }
          );
        };
        div.appendChild(btn);
      } else if (item.type === 'theme') {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.marginTop = '8px';
        btn.textContent = 'Применить';
        btn.onclick = () => {
          SHOP.applyTheme(item.id);
          alert('Тема применена');
        };
        div.appendChild(btn);
      }
      list.appendChild(div);
    });
    const undos = document.createElement('p');
    undos.className = 'muted';
    undos.style.fontSize = '13px';
    undos.textContent = `Отмен выбора в запасе: ${meta.undos || 0} · Слотов: ${SHOP.maxSlots()}`;
    list.appendChild(undos);
  }

  function openAchievements() {
    UI.showScreen('achievements');
    const list = UI.$('ach-list');
    list.innerHTML = '';
    const meta = SHOP.loadMeta();
    SHOP.ACHIEVEMENTS.forEach((a) => {
      const unlocked = !!meta.achievements[a.id];
      const div = document.createElement('div');
      div.className = 'ach-item' + (unlocked ? '' : ' locked');
      div.innerHTML = `
        <span class="ach-icon">${unlocked ? '🏆' : '🔒'}</span>
        <div><strong>${a.title}</strong><div class="desc muted" style="font-size:12px">${a.desc}</div></div>`;
      list.appendChild(div);
    });
  }

  function openCollection() {
    UI.showScreen('collection');
    const meta = SHOP.loadMeta();

    const typesBox = UI.$('ending-types-list');
    typesBox.innerHTML = '';
    SHOP.ENDING_TYPES.forEach((t) => {
      const unlocked = !!meta.endingsSeen?.[t.id];
      const div = document.createElement('div');
      div.className = 'ach-item' + (unlocked ? '' : ' locked');
      div.innerHTML = `
        <span class="ach-icon">${unlocked ? '✅' : '🔒'}</span>
        <div><strong>${t.title}</strong><div class="desc muted" style="font-size:12px">${t.desc}</div></div>`;
      typesBox.appendChild(div);
    });

    const profBox = UI.$('profession-badges-list');
    profBox.innerHTML = '';
    SHOP.PROFESSION_BADGES.forEach((p) => {
      const unlocked = !!meta.professionsSeen?.[p.id];
      const div = document.createElement('div');
      div.className = 'ach-item' + (unlocked ? '' : ' locked');
      div.innerHTML = `
        <span class="ach-icon">${unlocked ? '✅' : '🔒'}</span>
        <div><strong>${p.title}</strong><div class="desc muted" style="font-size:12px">${p.desc}</div></div>`;
      profBox.appendChild(div);
    });

    const livesBox = UI.$('lives-archive-list');
    livesBox.innerHTML = '';
    const archive = meta.livesArchive || [];
    if (!archive.length) {
      livesBox.innerHTML = '<p class="muted" style="font-size:13px">Ещё ни одна жизнь не завершена. Пройдите игру целиком или доживите до конца истории, чтобы увидеть здесь первую запись.</p>';
      return;
    }
    archive.forEach((life) => {
      const causeInfo = SHOP.ENDING_TYPES.find((t) => t.id === life.cause);
      const div = document.createElement('div');
      div.className = 'ach-item';
      const genderLabel = life.gender === 'm' ? 'муж.' : 'жен.';
      const ironmanTag = life.ironman ? ' · 🔥 Ironman' : '';
      div.innerHTML = `
        <span class="ach-icon">${causeInfo ? causeInfo.title.split(' ')[0] : '❔'}</span>
        <div><strong>${life.name || 'Без имени'}</strong>
          <div class="desc muted" style="font-size:12px">${genderLabel} · ${MOL.ageLabel(life.ageMonths)} · ${causeInfo ? causeInfo.title.replace(/^\S+\s/, '') : life.cause}${ironmanTag}</div>
        </div>`;
      livesBox.appendChild(div);
    });
  }

  /* ---------- Мини-игра: вступительный экзамен (с таймером) ---------- */
  const EXAM_BANK = [
    { q: 'Производная функции x² равна?', a: ['x', '2x', 'x²', '2'], correct: 1 },
    { q: 'Столица Франции?', a: ['Лион', 'Марсель', 'Париж', 'Ницца'], correct: 2 },
    { q: 'Год начала Второй мировой войны?', a: ['1937', '1939', '1941', '1945'], correct: 1 },
    { q: '15% от 200 это?', a: ['20', '25', '30', '35'], correct: 2 },
    { q: 'Химический символ железа?', a: ['Fe', 'Ir', 'In', 'Au'], correct: 0 },
    { q: 'Кто написал «Война и мир»?', a: ['Достоевский', 'Толстой', 'Чехов', 'Пушкин'], correct: 1 },
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startExam() {
    state.exam = { index: 0, score: 0, questions: shuffle(EXAM_BANK).slice(0, 5), timer: null, timeLeft: 8 };
    UI.showScreen('quiz');
    showExamQuestion();
  }

  function showExamQuestion() {
    const ex = state.exam;
    clearInterval(ex.timer);
    if (ex.index >= ex.questions.length) { finishExam(); return; }
    const item = ex.questions[ex.index];
    ex.timeLeft = 8;
    const timerEl = UI.$('quiz-timer');
    timerEl.classList.remove('danger');
    timerEl.textContent = `Вопрос ${ex.index + 1}/${ex.questions.length} · ⏱ ${ex.timeLeft} сек`;
    UI.$('quiz-q').textContent = item.q;
    UI.$('quiz-status').textContent = '';
    const box = UI.$('quiz-choices');
    box.innerHTML = '';
    item.a.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-choice';
      btn.textContent = text;
      btn.onclick = () => answerExam(i);
      box.appendChild(btn);
    });
    ex.timer = setInterval(() => {
      ex.timeLeft -= 1;
      if (ex.timeLeft <= 3) timerEl.classList.add('danger');
      timerEl.textContent = `Вопрос ${ex.index + 1}/${ex.questions.length} · ⏱ ${Math.max(ex.timeLeft, 0)} сек`;
      if (ex.timeLeft <= 0) {
        clearInterval(ex.timer);
        UI.$('quiz-status').textContent = 'Время вышло';
        ex.index++;
        setTimeout(showExamQuestion, 500);
      }
    }, 1000);
  }

  function answerExam(i) {
    const ex = state.exam;
    clearInterval(ex.timer);
    const item = ex.questions[ex.index];
    if (i === item.correct) { ex.score++; UI.$('quiz-status').textContent = 'Верно!'; }
    else { UI.$('quiz-status').textContent = 'Неверно'; }
    ex.index++;
    setTimeout(showExamQuestion, 450);
  }

  function finishExam() {
    const ex = state.exam;
    const ratio = ex.score / ex.questions.length;
    let effects;
    if (ratio >= 0.8) {
      effects = { stats: { intel: 6, money: 6, happy: 4 }, path: { high_achiever: 1 }, flags: { exam_passed_well: true }, history: 'Отлично сдал(а) вступительные экзамены' };
    } else if (ratio >= 0.4) {
      effects = { stats: { intel: 3, happy: 1 }, flags: { exam_passed: true }, history: 'Сдал(а) вступительные экзамены' };
    } else {
      effects = { stats: { happy: -4, resilience: 3 }, path: { setback: 1 }, flags: { exam_failed: true }, history: 'Провалил(а) вступительные экзамены, пришлось пересматривать планы' };
    }
    MOL.applyEffects(state.char, effects);
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
    UI.showScreen('play');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    nextEvent();
  }

  /* ---------- Мини-игра: собеседование (диалог, несколько реплик) ---------- */
  const INTERVIEW_BEATS = [
    {
      q: 'Расскажите о себе.',
      options: [
        { text: 'Чётко перечисляешь опыт и цели', points: 2 },
        { text: 'Честно говоришь, что нервничаешь, но готов(а) учиться', points: 1 },
        { text: 'Отшучиваешься', points: 0 },
      ],
    },
    {
      q: 'Почему хотите работать у нас?',
      options: [
        { text: 'Аргументированно объясняешь интерес к компании', points: 2 },
        { text: 'Говоришь про деньги напрямую', points: 0 },
        { text: 'Общие слова про «развитие»', points: 1 },
      ],
    },
    {
      q: 'Расскажите о своей неудаче.',
      options: [
        { text: 'Честно, с выводами, которые сделал(а)', points: 2 },
        { text: 'Уходишь от ответа', points: 0 },
        { text: 'Признаёшь ошибку, но без выводов', points: 1 },
      ],
    },
    {
      q: 'Есть вопросы к нам?',
      options: [
        { text: 'Задаёшь по делу — про задачи и команду', points: 2 },
        { text: 'Спрашиваешь только про отпуск и премии', points: 0 },
        { text: 'Говоришь, что вопросов нет', points: 1 },
      ],
    },
  ];

  function startInterview() {
    state.interview = { index: 0, score: 0 };
    UI.showScreen('interview');
    showInterviewQuestion();
  }

  function showInterviewQuestion() {
    const iv = state.interview;
    if (iv.index >= INTERVIEW_BEATS.length) { finishInterview(); return; }
    const beat = INTERVIEW_BEATS[iv.index];
    UI.$('interview-progress').textContent = `Вопрос ${iv.index + 1}/${INTERVIEW_BEATS.length}`;
    UI.$('interview-q').textContent = beat.q;
    const box = UI.$('interview-choices');
    box.innerHTML = '';
    beat.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-choice';
      btn.textContent = opt.text;
      btn.onclick = () => {
        iv.score += opt.points;
        iv.index++;
        showInterviewQuestion();
      };
      box.appendChild(btn);
    });
  }

  function finishInterview() {
    const iv = state.interview;
    const max = INTERVIEW_BEATS.length * 2;
    const ratio = iv.score / max;
    let effects;
    if (ratio >= 0.75) {
      effects = { moneyScale: true, stats: { money: 12, happy: 5, independence: 3 }, path: { confident: 1 }, flags: { good_job_offer: true }, history: 'Прошёл(а) собеседование блестяще' };
    } else if (ratio >= 0.4) {
      effects = { moneyScale: true, stats: { money: 6, happy: 1 }, flags: { got_job: true }, history: 'Получил(а) работу' };
    } else {
      effects = { moneyScale: true, stats: { happy: -3, money: -2 }, path: { setback: 1 }, history: 'Собеседование прошло неудачно' };
    }
    MOL.applyEffects(state.char, effects);
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
    UI.showScreen('play');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    nextEvent();
  }

  /* ---------- Мини-игра: бюджет месяца ---------- */
  const BUDGET_CATEGORIES = [
    { id: 'rent', name: '🏠 Аренда/жильё', value: 25 },
    { id: 'food', name: '🍲 Еда', value: 25 },
    { id: 'fun', name: '🎉 Развлечения', value: 20 },
    { id: 'save', name: '💰 Накопления', value: 30 },
  ];

  function startBudget() {
    state.budget = { categories: BUDGET_CATEGORIES.map((c) => ({ ...c })), total: 100 };
    UI.showScreen('budget');
    renderBudget();
  }

  function budgetSum() {
    return state.budget.categories.reduce((s, c) => s + c.value, 0);
  }

  function renderBudget() {
    const b = state.budget;
    UI.$('budget-total').textContent = b.total;
    const box = UI.$('budget-categories');
    box.innerHTML = '';
    b.categories.forEach((cat) => {
      const row = document.createElement('div');
      row.className = 'budget-row';
      row.innerHTML = `
        <span class="budget-name">${cat.name}</span>
        <div class="budget-stepper">
          <button data-act="minus">−</button>
          <span class="budget-value">${cat.value}</span>
          <button data-act="plus">+</button>
        </div>`;
      row.querySelector('[data-act="minus"]').onclick = () => { cat.value = Math.max(0, cat.value - 5); renderBudget(); };
      row.querySelector('[data-act="plus"]').onclick = () => { cat.value = Math.min(100, cat.value + 5); renderBudget(); };
      box.appendChild(row);
    });
    const sum = budgetSum();
    const remaining = b.total - sum;
    const remEl = UI.$('budget-remaining');
    remEl.textContent = remaining;
    remEl.classList.toggle('ok', remaining === 0);
    remEl.classList.toggle('bad', remaining !== 0);
    UI.$('btn-budget-confirm').disabled = remaining !== 0;
  }

  function confirmBudget() {
    const b = state.budget;
    const get = (id) => b.categories.find((c) => c.id === id)?.value || 0;
    const save = get('save');
    const fun = get('fun');
    const rent = get('rent');
    let effects;
    if (save >= 25) {
      effects = { stats: { money: 10, resilience: 4, happy: -1 }, path: { saver: 1 }, history: 'Грамотно спланировал(а) первый бюджет' };
    } else if (fun >= 35) {
      effects = { stats: { happy: 6, money: -8 }, path: { spender: 1 }, history: 'Потратил(а) зарплату на удовольствия' };
    } else if (rent > 40) {
      effects = { stats: { resilience: 3, happy: -2, money: -3 }, history: 'Много ушло на жильё' };
    } else {
      effects = { stats: { money: 3, resilience: 2 }, history: 'Сбалансированно распределил(а) бюджет' };
    }
    MOL.applyEffects(state.char, effects);
    autoSave();
    notifyAchievements(SHOP.checkAchievements(state.char));
    UI.showScreen('play');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    nextEvent();
  }

  UI.$('btn-budget-confirm').onclick = confirmBudget;

  /* ---------- Quiz mini-game ---------- */
  const QUIZ_BANK = [
    { q: 'Сколько будет 7 × 8?', a: ['54', '56', '64', '48'], correct: 1 },
    { q: 'Столица Казахстана?', a: ['Алматы', 'Астана', 'Шымкент', 'Караганда'], correct: 1 },
    { q: '2 + 2 × 2 = ?', a: ['6', '8', '4', '10'], correct: 0 },
  ];

  function startQuiz() {
    state.quiz = {
      index: 0,
      score: 0,
      retriesLeft: SHOP.loadMeta().owned.quiz_retry ? 1 : 0,
      questions: QUIZ_BANK.slice(),
    };
    UI.showScreen('quiz');
    showQuizQuestion();
  }

  function showQuizQuestion() {
    const qz = state.quiz;
    if (qz.index >= qz.questions.length) {
      finishQuiz();
      return;
    }
    const item = qz.questions[qz.index];
    UI.$('quiz-timer').textContent = `Вопрос ${qz.index + 1}/${qz.questions.length}`;
    UI.$('quiz-q').textContent = item.q;
    UI.$('quiz-status').textContent = '';
    const box = UI.$('quiz-choices');
    box.innerHTML = '';
    item.a.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-choice';
      btn.textContent = text;
      btn.onclick = () => answerQuiz(i);
      box.appendChild(btn);
    });
  }

  function answerQuiz(i) {
    const qz = state.quiz;
    const item = qz.questions[qz.index];
    if (i === item.correct) {
      qz.score++;
      UI.$('quiz-status').textContent = 'Верно!';
    } else {
      UI.$('quiz-status').textContent = 'Неверно';
    }
    qz.index++;
    setTimeout(showQuizQuestion, 500);
  }

  function finishQuiz() {
    const qz = state.quiz;
    const good = qz.score >= 2;
    if (!good && qz.retriesLeft <= 0) {
      // предложить платную попытку
      const buy = confirm(
        `Результат: ${qz.score}/${qz.questions.length}.\nСлабовато для оценок.\nКупить ещё попытку за 25 ⭐? (тест)`
      );
      if (buy) {
        SHOP.purchase(
          'quiz_retry',
          () => {
            state.quiz = {
              index: 0,
              score: 0,
              retriesLeft: 1,
              questions: QUIZ_BANK.slice(),
            };
            showQuizQuestion();
          },
          () => afterQuiz(good)
        );
        return;
      }
    }
    afterQuiz(good);
  }

  function afterQuiz(good) {
    state.char.flags.quiz_done = true;
    if (good) {
      MOL.applyEffects(state.char, {
        stats: { intel: 4, happy: 3 },
        path: { studious: 1 },
        history: 'Хорошо написал школьную викторину',
      });
    } else {
      MOL.applyEffects(state.char, {
        stats: { intel: 1, happy: -2 },
        history: 'Викторина в школе вышла слабо',
      });
    }
    autoSave();
    // продолжить период
    const events = MOL.getAvailableEvents(state.stage, state.periodIndex, state.char);
    state.eventQueue = events.slice();
    UI.showScreen('play');
    UI.updateHeader(state.char);
    UI.updateStats(state.char);
    nextEvent();
  }

  /* ---------- Premium branch events injected at runtime ---------- */
  function injectPremiumEvents() {
    const abroad = MOL.getStage('18-25');
    if (abroad && !abroad._premiumInjected) {
      abroad.periods[0].events.push({
        id: 'premium_abroad',
        title: 'Шанс уехать',
        scene: '✈️',
        text: 'Появилась возможность стажировки за границей. (Премиум-ветка)',
        condition: (c) => SHOP.owns('branch_abroad'),
        choices: [
          {
            text: 'Уехать на год',
            effects: {
              stats: { independence: 8, social: 4, intel: 3, money: -5 },
              path: { explorer: 2 },
              flags: { lived_abroad: true },
              history: 'Жил(а) за границей в молодости',
            },
          },
          {
            text: 'Остаться',
            effects: { stats: { happy: 1 }, path: { rooted: 1 } },
          },
        ],
      });
      abroad._premiumInjected = true;
    }
    const art = MOL.getStage('25-40');
    if (art && !art._premiumInjected) {
      art.periods[0].events.push({
        id: 'premium_art',
        title: 'Творческий путь',
        scene: '🎨',
        text: 'Можно свернуть с привычной карьеры в искусство. (Премиум-ветка)',
        condition: (c) => SHOP.owns('branch_art'),
        choices: [
          {
            text: 'Уйти в творчество',
            effects: {
              stats: { happy: 8, money: -8, independence: 5 },
              path: { creative: 2 },
              flags: { artist_path: true },
              history: 'Выбрал(а) творческую карьеру',
            },
          },
          {
            text: 'Оставить как хобби',
            effects: { stats: { happy: 3 }, path: { creative: 1 } },
          },
        ],
      });
      art._premiumInjected = true;
    }
    const second = MOL.getStage('40-60');
    if (second && !second._premiumInjected) {
      second.periods[1].events.push({
        id: 'premium_second',
        title: 'Второй шанс',
        scene: '🔄',
        text: 'После 45 можно начать совсем другую профессию. (Премиум-ветка)',
        condition: (c) => SHOP.owns('branch_second'),
        choices: [
          {
            text: 'Начать с нуля',
            effects: {
              stats: { resilience: 6, independence: 5, money: -6, happy: 4 },
              path: { reinvent: 2 },
              flags: { second_career: true },
              history: 'Перезапустил(а) карьеру после 40',
            },
          },
          {
            text: 'Остаться на проторённом пути',
            effects: { stats: { money: 4 }, path: { established: 1 } },
          },
        ],
      });
      second._premiumInjected = true;
    }
  }

  injectPremiumEvents();

  /* ---------- Bindings ---------- */
  document.querySelectorAll('.seg').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.segment');
      const scope = group ? group.querySelectorAll('.seg') : document.querySelectorAll('.seg');
      scope.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  UI.$('btn-new-game').onclick = startNewGame;
  UI.$('btn-continue').onclick = continueLatest;
  UI.$('btn-slots').onclick = () => {
    UI.showScreen('slots');
    UI.renderSlots(
      (i) => loadSlot(i),
      (i) => {
        MOL.deleteSlot(i);
        UI.renderSlots((x) => loadSlot(x), (x) => { MOL.deleteSlot(x); openSlotsRefresh(); }, () => UI.showScreen('menu'));
      },
      () => UI.showScreen('menu')
    );
  };
  function openSlotsRefresh() {
    UI.renderSlots(
      (i) => loadSlot(i),
      (i) => {
        MOL.deleteSlot(i);
        openSlotsRefresh();
      },
      () => UI.showScreen('menu')
    );
  }

  UI.$('btn-shop').onclick = openShop;
  UI.$('btn-shop-back').onclick = () => UI.showScreen('menu');
  UI.$('btn-achievements').onclick = openAchievements;
  UI.$('btn-ach-back').onclick = () => UI.showScreen('menu');
  UI.$('btn-collection').onclick = openCollection;
  UI.$('btn-collection-back').onclick = () => UI.showScreen('menu');
  UI.$('btn-start-life').onclick = confirmCreate;
  UI.$('btn-back-menu').onclick = () => UI.showScreen('menu');
  UI.$('btn-to-menu').onclick = goMenu;

  UI.$('btn-undo-choice').onclick = () => {
    if (!state.char) return;
    if (state.char.ironman) {
      alert('Режим Ironman: отмена выбора недоступна.');
      return;
    }
    if (!state.lastChoiceSnapshot) {
      alert('Пока нечего отменять — ты ещё не сделал(а) выбор в этом ходу.');
      return;
    }
    const meta = SHOP.loadMeta();
    if ((meta.undos || 0) > 0) {
      if (!SHOP.useUndo()) return;
      const restoredSlot = state.slot;
      const restoredStage = state.stage;
      state.char = JSON.parse(JSON.stringify(state.lastChoiceSnapshot));
      state.slot = restoredSlot;
      state.stage = restoredStage;
      state.periodIndex = state.char.periodIndex || 0;
      state.lastChoiceSnapshot = null;
      autoSave();
      beginPeriod();
      return;
    }
    SHOP.purchase(
      'undo_pack',
      () => {
        SHOP.useUndo();
        const restoredSlot = state.slot;
        const restoredStage = state.stage;
        state.char = JSON.parse(JSON.stringify(state.lastChoiceSnapshot));
        state.slot = restoredSlot;
        state.stage = restoredStage;
        state.periodIndex = state.char.periodIndex || 0;
        state.lastChoiceSnapshot = null;
        autoSave();
        beginPeriod();
      },
      (e) => { if (e !== 'отмена') alert('Не удалось: ' + e); }
    );
  };

  UI.$('btn-skip-stage').onclick = () => {
    if (!state.char || !state.stage) return;
    SHOP.purchase(
      'skip_stage',
      () => {
        let died = null;
        while (state.periodIndex < state.stage.periods.length) {
          const shown = new Set();
          // Резолвим события периода по одному, перепроверяя условия —
          // иначе события, зависящие от флага из более раннего выбора
          // в этом же периоде (например, выбор специальности), пропустятся.
          for (let guard = 0; guard < 20; guard++) {
            const available = MOL.getAvailableEvents(state.stage, state.periodIndex, state.char).filter(
              (ev) => !shown.has(ev.id)
            );
            if (!available.length) break;
            const ev = available[0];
            shown.add(ev.id);
            if (ev.minigame) continue; // мини-игры не резолвим автоматически
            const choice = ev.choices && ev.choices[0];
            if (choice) MOL.applyEffects(state.char, choice.effects);
          }
          state.char.ageMonths += state.stage.stepMonths;
          state.periodIndex += 1;
          state.char.periodIndex = state.periodIndex;
          const risk = MOL.evaluateLifeRisk(state.char);
          if (risk) { died = risk; break; }
        }
        if (died) {
          state.char.flags.dead = true;
          state.char.flags.death_cause = died.type;
          autoSave();
          showDeathEnding(died);
          return;
        }
        autoSave();
        notifyAchievements(SHOP.checkAchievements(state.char));
        showStageSummary();
      },
      (e) => { if (e !== 'отмена') alert('Не удалось: ' + e); }
    );
  };

  UI.$('btn-rewind-stage').onclick = () => {
    if (!state.char || !state.stage) return;
    if (state.char.ironman) {
      alert('Режим Ironman: переигровка этапа недоступна.');
      return;
    }
    const snap = state.char._stageSnapshots?.[state.stage.id];
    if (!snap) { alert('Точка возврата для этого этапа недоступна.'); return; }
    SHOP.purchase(
      'rewind_stage',
      () => {
        const snapshots = state.char._stageSnapshots;
        const restoredSlot = state.slot;
        const wasIronman = state.char.ironman;
        state.char = JSON.parse(JSON.stringify(snap));
        state.char._stageSnapshots = snapshots;
        state.char.ironman = wasIronman;
        state.slot = restoredSlot;
        state.periodIndex = 0;
        state.char.periodIndex = 0;
        state.char.stageId = state.stage.id;
        autoSave();
        beginPeriod();
      },
      (e) => { if (e !== 'отмена') alert('Не удалось: ' + e); }
    );
  };


  UI.$('btn-menu').onclick = () => {
    if (confirm('Выйти в меню? Прогресс сохранён.')) {
      autoSave();
      goMenu();
    }
  };
  UI.$('btn-sound').onclick = () => {
    state.sound = !state.sound;
    UI.$('btn-sound').textContent = state.sound ? '🔊' : '🔇';
  };

  UI.$('btn-bio-pretty').onclick = () => {
    if (!state.char) return;
    if (SHOP.owns('bio_card')) {
      const el = UI.$('end-bio');
      el.textContent = '✦ ─── Моя обычная жизнь ─── ✦\n\n' + buildBiography(state.char) + '\n\n✦ ───────────── ✦';
      el.classList.remove('hidden');
      UI.$('end-text').classList.add('hidden');
    } else {
      SHOP.purchase(
        'bio_card',
        () => {
          UI.$('btn-bio-pretty').click();
        },
        () => {}
      );
    }
  };

  UI.$('btn-share-bio').onclick = () => {
    const text = buildBiography(state.char || { name: '?', ageMonths: 0, history: [], path: {}, stats: {} });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert('Биография скопирована'));
    } else {
      prompt('Скопируй текст:', text);
    }
  };

  UI.$('btn-claim-streak').onclick = () => {
    const res = SHOP.claimDailyStreak();
    if (res) {
      alert(`🔥 День ${res.day}: ${res.label}`);
    }
    UI.$('streak-banner').classList.add('hidden');
  };

  UI.showScreen('menu');
  refreshStreakBanner();
})();
