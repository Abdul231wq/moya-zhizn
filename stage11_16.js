/**
 * Этап 11–16 — подростковый
 */
(function () {
  const stage = {
    id: '11-16',
    title: 'Подростковый возраст',
    ageStartMonths: 132,
    stepMonths: 12,
    nextStageId: '16-18',
    periods: [
      {
        label: '11–12 лет',
        events: [
          {
            id: 'puberty',
            title: 'Тело меняется',
            scene: '🌊',
            text: 'Гормоны, неловкость, зеркало. Как ты с этим справляешься?',
            choices: [
              {
                text: 'Принимаешь и шутишь над собой',
                effects: { stats: { resilience: 5, happy: 2, social: 2 }, path: { confident: 1 } },
              },
              {
                text: 'Стыдишься, избегаешь внимания',
                effects: { stats: { social: -4, happy: -3 }, path: { shy: 1, anxious: 1 } },
              },
              {
                text: 'Уходишь в спорт / внешность',
                effects: { stats: { health: 4, social: 2 }, path: { image_focus: 1 } },
              },
            ],
          },
          {
            id: 'phone',
            title: 'Телефон и соцсети',
            scene: '📱',
            text: 'Первый смартфон. Лента начинает съедать часы.',
            choices: [
              {
                text: 'Сидишь умеренно, больше офлайн',
                effects: { stats: { social: 3, intel: 2, happy: 2 }, path: { balanced: 1 } },
              },
              {
                text: 'Глубоко в соцсетях',
                effects: { stats: { social: 4, happy: -2, intel: -2 }, path: { online: 1 }, flags: { heavy_social_media: true } },
              },
              {
                text: 'Игры до ночи',
                effects: { stats: { intel: 1, health: -3, happy: 3 }, path: { gamer: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '13–14 лет',
        events: [
          {
            id: 'first_crush',
            title: 'Первая влюблённость',
            scene: '💕',
            text: 'Кто-то из класса не выходит из головы. Сердце колотится.',
            choices: [
              {
                text: 'Признаёшься / пишешь',
                effects: { stats: { social: 4, resilience: 3, happy: 5 }, path: { bold: 1 }, flags: { first_crush_acted: true } },
              },
              {
                text: 'Молчишь и мечтаешь',
                effects: { stats: { happy: 2, social: -1 }, path: { romantic: 1, shy: 1 } },
              },
              {
                text: 'Отвергаешь чувства — «не до этого»',
                effects: { stats: { independence: 3 }, path: { closed: 1 } },
              },
            ],
          },
          {
            id: 'parents_fight',
            title: 'Конфликт с родителями',
            scene: '🚪',
            text: 'Комендантский час, учёба, «ты мне должен». Типичный скандал.',
            choices: [
              {
                text: 'Споришь жёстко, отстаиваешь границы',
                effects: { stats: { independence: 6, happy: -3 }, relationships: { mother: -4, father: -4 }, path: { rebel: 1 } },
              },
              {
                text: 'Ищешь компромисс',
                effects: { stats: { social: 3, resilience: 3 }, path: { diplomat: 1 }, relationships: { mother: 1 } },
              },
              {
                text: 'Замыкаешься и делаешь по-своему тихо',
                effects: { stats: { independence: 4, happy: -2 }, path: { secretive: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '15–16 лет',
        events: [
          {
            id: 'company',
            title: 'Компания',
            scene: '👥',
            text: 'Друзья зовут на вечеринку, где будут сигареты и странные идеи.',
            choices: [
              {
                text: 'Идёшь, но держишь голову',
                effects: { stats: { social: 4, resilience: 3 }, path: { balanced: 1, sociable: 1 } },
              },
              {
                text: 'Пробуешь «как все»',
                effects: { stats: { social: 3, health: -4, happy: 2 }, path: { risk_taker: 1 }, flags: { tried_substances: true } },
              },
              {
                text: 'Отказываешься, остаёшься дома/с другими',
                effects: { stats: { independence: 3, social: -2 }, path: { principled: 1 } },
              },
            ],
          },
          {
            id: 'identity',
            title: 'Кто я?',
            scene: '🪞',
            text: 'Вопрос возраста: отличник, невидимка, бунтарь, лидер — что ближе?',
            choices: [
              {
                text: 'Тянешься к лидерству',
                effects: { stats: { social: 5, resilience: 3 }, path: { leader: 2 }, flags: { archetype_leader: true } },
              },
              {
                text: 'Учёба и результат',
                effects: { stats: { intel: 6 }, path: { studious: 2, ambitious: 1 }, flags: { archetype_nerd: true } },
              },
              {
                text: 'Свой путь, вопреки ожиданиям',
                effects: { stats: { independence: 6, happy: 2 }, path: { rebel: 2 }, flags: { archetype_rebel: true } },
              },
              {
                text: 'Держишься в тени',
                effects: { stats: { social: -2, intel: 2 }, path: { introvert: 1 }, flags: { archetype_quiet: true } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
