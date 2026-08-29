/**
 * UI helpers
 */
const UI = {
  $(id) {
    return document.getElementById(id);
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.add('hidden'));
    const scr = this.$(`screen-${name}`);
    if (scr) scr.classList.remove('hidden');

    const inGame = name === 'play' || name === 'summary';
    this.$('header').classList.toggle('hidden', !inGame && name !== 'end');
    this.$('stats-bar').classList.toggle('hidden', name !== 'play' && name !== 'summary');
  },

  updateHeader(char) {
    this.$('char-name').textContent = char.name;
    this.$('char-age').textContent = window.MOL.ageLabel(char.ageMonths);
  },

  updateStats(char, changed = {}) {
    const map = {
      health: 'stat-health',
      happy: 'stat-happy',
      intel: 'stat-intel',
      social: 'stat-social',
    };
    for (const [key, elId] of Object.entries(map)) {
      const el = this.$(elId);
      if (!el) continue;
      const val = char.stats[key] ?? 50;
      el.style.width = `${val}%`;
      el.classList.remove('up', 'down');
      if (changed[key] > 0) el.classList.add('up');
      if (changed[key] < 0) el.classList.add('down');
    }
  },

  renderEvent(ev, periodLabel, onChoice) {
    this.$('event-scene').textContent = ev.scene || '📖';
    this.$('event-period').textContent = periodLabel || '';
    this.$('event-title').textContent = ev.title;
    this.$('event-text').textContent = ev.text;
    const box = this.$('event-choices');
    box.innerHTML = '';
    (ev.choices || []).forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-choice';
      btn.textContent = ch.text;
      btn.addEventListener('click', () => onChoice(ch, i));
      box.appendChild(btn);
    });
  },

  renderSummary(char, stageTitle, onNext, onSave) {
    this.$('summary-title').textContent = `Итоги: ${stageTitle}`;
    const traits = window.MOL.getPathTraits(char, 2);
    const traitLabels = {
      overprotected: 'Гиперопека',
      self_soothe: 'Умеет успокаиваться',
      expressive: 'Экспрессивный',
      observant: 'Наблюдательный',
      explorer: 'Исследователь',
      sociable: 'Общительный',
      shy: 'Застенчивый',
      curious: 'Любопытный',
      growth_mindset: 'Не боится ошибок',
      autonomy: 'Тяга к самостоятельности',
      collective: 'Привык к коллективу',
      home_bonded: 'Домашний',
      builder: 'Любит конструировать',
      active: 'Подвижный',
      only_child: 'Единственный ребёнок',
      sibling_rivalry: 'Есть брат/сестра',
      verbal: 'Речевая среда',
      screen_early: 'Ранний экран',
    };

    let text = `Тебе ${window.MOL.ageLabel(char.ageMonths)}. Характер уже проявляется.`;
    if (char.flags.vaccinated) text += ' Прививки сделаны.';
    if (char.flags.kindergarten) text += ' Ты ходишь в сад.';
    if (char.flags.has_sibling) text += ' В семье есть младший ребёнок.';
    this.$('summary-text').textContent = text;

    const traitsEl = this.$('summary-traits');
    traitsEl.innerHTML = '';
    traits.slice(0, 6).forEach(({ tag }) => {
      const span = document.createElement('span');
      span.className = 'trait';
      span.textContent = traitLabels[tag] || tag;
      traitsEl.appendChild(span);
    });

    const st = this.$('summary-stats');
    st.innerHTML = `
      <div>❤️ Здоровье: ${char.stats.health}</div>
      <div>😊 Счастье: ${char.stats.happy}</div>
      <div>🧠 Интеллект: ${char.stats.intel}</div>
      <div>💬 Общительность: ${char.stats.social}</div>
      <div>🛡️ Устойчивость: ${char.stats.resilience}</div>
      <div>🏃 Самостоятельность: ${char.stats.independence}</div>
    `;

    this.$('btn-next-stage').onclick = onNext;
    this.$('btn-save-exit').onclick = onSave;
  },

  renderSlots(onLoad, onDelete, onBack) {
    const list = this.$('slots-list');
    list.innerHTML = '';
    const saves = window.MOL.loadAllSaves();
    saves.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'slot-card' + (s ? '' : ' empty');
      if (!s) {
        div.innerHTML = `<div class="slot-info"><strong>Слот ${i + 1}</strong><span class="slot-meta">Пусто</span></div>`;
      } else {
        const ended = s.flags?.dead || s.flags?.life_complete;
        const statusLabel = s.flags?.dead ? '💀 Жизнь оборвалась' : s.flags?.life_complete ? '🌿 Жизнь пройдена' : `${window.MOL.ageLabel(s.ageMonths)} · ${s.stageId}`;
        div.innerHTML = `
          <div class="slot-info">
            <strong>${s.name}</strong>
            <span class="slot-meta">${statusLabel}</span>
          </div>
          <div class="slot-actions">
            <button data-load="${i}">${ended ? 'Итоги' : 'Играть'}</button>
            <button data-del="${i}">✕</button>
          </div>`;
      }
      list.appendChild(div);
    });
    list.querySelectorAll('[data-load]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        onLoad(+btn.dataset.load);
      };
    });
    list.querySelectorAll('[data-del]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Удалить сохранение?')) onDelete(+btn.dataset.del);
      };
    });
    this.$('btn-slots-back').onclick = onBack;
  },
};

window.UI = UI;
