/**
 * Этап 40–60 — средний возраст
 */
(function () {
  const stage = {
    id: '40-60',
    title: 'Средний возраст',
    ageStartMonths: 480,
    stepMonths: 24,
    nextStageId: '60-end',
    periods: [
      {
        label: '40–45 лет',
        events: [
          {
            id: 'health_wake',
            title: 'Здоровье напоминает',
            scene: '🩺',
            text: 'Давление, спина, анализы. Тело больше не прощает всё.',
            choices: [
              {
                text: 'Меняешь привычки всерьёз',
                effects: { stats: { health: 12, happy: 3 }, path: { health_conscious: 1 }, flags: { lifestyle_fix: true } },
              },
              {
                text: 'Таблетки и «потом разберусь»',
                effects: { stats: { health: -5 }, path: { neglect_health: 1 } },
              },
              {
                text: 'Спорт + врач + сон',
                effects: { stats: { health: 15, resilience: 3 }, path: { disciplined: 1 }, flags: { sports_habit: true } },
              },
            ],
          },
          {
            id: 'kids_grown',
            title: 'Дети взрослеют',
            scene: '🎒',
            text: 'Если есть дети — они уже не малыши. Если нет — вокруг чужие выпускные.',
            choices: [
              {
                text: 'Отпускаешь с поддержкой',
                effects: { stats: { happy: 4, social: 2 }, path: { wise_parent: 1 }, condition_note: 'has kids' },
              },
              {
                text: 'Контролируешь слишком сильно',
                effects: { stats: { happy: -2 }, path: { controlling: 1 } },
              },
              {
                text: 'Фокус на себе и паре',
                effects: { stats: { happy: 5, independence: 2 }, path: { self_focus: 1 } },
              },
            ],
          },
          {
            id: 'marriage_midlife',
            title: 'Переоценка отношений',
            scene: '💭',
            text: 'Годы вместе или в одиночестве накопились. Пора честно взглянуть на то, что есть.',
            choices: [
              {
                text: 'Укрепляешь отношения / находишь новый смысл в паре',
                effects: { stats: { happy: 6, social: 2 }, path: { family_oriented: 1 } },
              },
              {
                text: 'Расходишься после долгих лет вместе',
                effects: { stats: { happy: -6, independence: 5, resilience: 3 }, path: { resilient: 1 }, flags: { midlife_divorce: true }, history: 'Развёлся в среднем возрасте' },
              },
              {
                text: 'Остаёшься в одиночестве и это устраивает',
                effects: { stats: { independence: 4 }, path: { free_spirit: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '46–52 года',
        events: [
          {
            id: 'career_peak',
            title: 'Пик или плато',
            scene: '📊',
            text: 'Кто-то на пике влияния, кто-то выгорел, кто-то начинает заново.',
            choices: [
              {
                text: 'Закрепляешь статус и деньги',
                effects: { moneyScale: true, stats: { money: 18, happy: 2 }, path: { established: 1 } },
              },
              {
                text: 'Меняешь профессию / уходишь в новое',
                effects: { moneyScale: true, stats: { independence: 5, resilience: 5, money: -5 }, path: { reinvent: 1 }, history: 'Переизобрёл себя после 45' },
              },
              {
                text: 'Выгорание — снижаешь обороты',
                effects: { moneyScale: true, stats: { health: 4, money: -8, happy: 3 }, path: { slow_living: 1 } },
              },
            ],
          },
          {
            id: 'parents_old',
            title: 'Родители стареют',
            scene: '👵',
            text: 'Роли меняются: теперь ты опора.',
            choices: [
              {
                text: 'Берёшь заботу на себя',
                effects: { stats: { happy: -2, resilience: 4, social: 2 }, path: { caregiver: 1 }, relationships: { mother: 5, father: 5 } },
              },
              {
                text: 'Делишь с сиблингами / помощь',
                effects: { stats: { money: -5 }, path: { responsible: 1 } },
              },
              {
                text: 'Дистанция — тяжело справляться',
                effects: { stats: { happy: -4 }, path: { detached: 1 }, relationships: { mother: -3 } },
              },
            ],
          },
        ],
      },
      {
        label: '53–59 лет',
        events: [
          {
            id: 'grandparent_role',
            title: 'Роль бабушки/дедушки',
            scene: '👶',
            text: 'Если у детей появляются свои дети — новая роль в семье, с новыми правилами и границами.',
            condition: (c) => c.flags.has_children,
            choices: [
              {
                text: 'С радостью помогаешь и балуешь внуков',
                effects: { stats: { happy: 6, social: 3 }, path: { warm_grandparent: 1 } },
              },
              {
                text: 'Держишь дистанцию — своя жизнь важнее',
                effects: { stats: { independence: 4, happy: -1 }, path: { self_focus: 1 } },
              },
            ],
          },
          {
            id: 'legacy_start',
            title: 'Наследие',
            scene: '📜',
            text: 'Что останется после тебя — дело, дети, ученики, тишина?',
            choices: [
              {
                text: 'Вкладываешься в людей',
                effects: { moneyScale: true, stats: { happy: 5, social: 4 }, path: { mentor: 1 }, history: 'Стал наставником' },
              },
              {
                text: 'Вкладываешься в капитал',
                effects: { moneyScale: true, stats: { money: 12 }, path: { provider: 1 } },
              },
              {
                text: 'Ищешь смысл в творчестве / вере',
                effects: { moneyScale: true, stats: { happy: 6, resilience: 3 }, path: { spiritual: 1 } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
