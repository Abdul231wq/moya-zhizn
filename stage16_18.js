/**
 * Этап 16–18 — старшие классы / выбор пути
 */
(function () {
  const stage = {
    id: '16-18',
    title: 'Старшие классы',
    ageStartMonths: 192,
    stepMonths: 6,
    nextStageId: '18-25',
    periods: [
      {
        label: '16–16.5 лет',
        events: [
          {
            id: 'exams_prep',
            title: 'Подготовка к экзаменам',
            scene: '📖',
            text: 'ЕГЭ / аттестация. Давление школы и семьи максимальное.',
            choices: [
              {
                text: 'Репетиторы и жёсткий график',
                effects: { stats: { intel: 8, happy: -5, health: -3 }, path: { ambitious: 1, pressured: 1 }, flags: { hard_exam_prep: true } },
              },
              {
                text: 'Готовишься сам, в своём темпе',
                effects: { stats: { intel: 5, independence: 4, resilience: 2 }, path: { self_driven: 1 } },
              },
              {
                text: 'Забиваешь, надеешься на авось',
                effects: { stats: { intel: -2, happy: 3 }, path: { avoidant: 1 }, flags: { weak_exam_prep: true } },
              },
            ],
          },
        ],
      },
      {
        label: '17 лет',
        events: [
          {
            id: 'path_choice',
            title: 'Главный выбор',
            scene: '🔀',
            text: 'Вуз, колледж, работа, переезд, армия — развилка на годы вперёд.',
            choices: [
              {
                text: 'Целюсь в университет',
                effects: {
                  flags: { path_uni: true, higher_education_track: true },
                  stats: { intel: 4, independence: 2 },
                  path: { ambitious: 1, studious: 1 },
                  history: 'Выбрал путь высшего образования',
                },
              },
              {
                text: 'Колледж / среднее проф.',
                effects: {
                  flags: { path_college: true },
                  stats: { independence: 3, money: 5 },
                  path: { practical: 1 },
                  history: 'Выбрал колледж',
                },
              },
              {
                text: 'Сразу работать',
                effects: {
                  flags: { path_work: true },
                  stats: { independence: 6, money: 10, intel: -1 },
                  path: { early_worker: 1 },
                  history: 'Пошёл работать после школы',
                },
              },
              {
                text: 'Переезд / другой город',
                effects: {
                  flags: { path_move: true },
                  stats: { independence: 7, social: -2, resilience: 4 },
                  path: { explorer: 1 },
                  history: 'Уехал из родного города',
                },
              },
            ],
          },
          {
            id: 'entrance_exam_game',
            title: 'Вступительные экзамены',
            scene: '📝',
            text: 'Настоящий вступительный экзамен — с таймером на каждый вопрос.',
            condition: (c) => c.flags.path_uni === true,
            minigame: 'exam',
          },
          {
            id: 'romance_serious',
            title: 'Отношения',
            scene: '💌',
            text: 'Кто-то встречается всерьёз, кто-то избегает привязанности.',
            choices: [
              {
                text: 'Серьёзные отношения',
                effects: { stats: { happy: 6, social: 3 }, path: { romantic: 1 }, flags: { teen_relationship: true } },
              },
              {
                text: 'Лёгкие романы',
                effects: { stats: { social: 4, happy: 3 }, path: { flirt: 1 } },
              },
              {
                text: 'Фокус на себе и целях',
                effects: { stats: { independence: 4, intel: 2 }, path: { focused: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '17.5–18 лет',
        events: [
          {
            id: 'graduation',
            title: 'Выпускной',
            scene: '🎓',
            text: 'Школа позади. Ночь, обещания, страх и свобода одновременно.',
            choices: [
              {
                text: 'Гуляешь до утра с классом',
                effects: { stats: { social: 5, happy: 6 }, path: { sociable: 1 }, history: 'Яркий выпускной' },
              },
              {
                text: 'Уходишь рано — устал от всего',
                effects: { stats: { independence: 2 }, path: { introvert: 1 } },
              },
              {
                text: 'Прощаешься лично с важными людьми',
                effects: { stats: { social: 3, happy: 4 }, path: { loyal: 1, empathic: 1 } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
