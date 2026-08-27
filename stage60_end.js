/**
 * Этап 60+ — старость и финал
 */
(function () {
  const stage = {
    id: '60-end',
    title: 'Старость',
    ageStartMonths: 720,
    stepMonths: 24,
    nextStageId: null,
    periods: [
      {
        label: '60–65 лет',
        events: [
          {
            id: 'retirement',
            title: 'Пенсия или нет',
            scene: '☕',
            text: 'Официально можно остановиться. Не все хотят.',
            choices: [
              {
                text: 'Выходишь на пенсию',
                effects: { stats: { happy: 4, money: -5, health: 2 }, path: { retired: 1 }, flags: { retired: true } },
              },
              {
                text: 'Продолжаешь работать',
                effects: { stats: { money: 6, health: -2, social: 2 }, path: { active_elder: 1 } },
              },
              {
                text: 'Своё маленькое дело / хобби-доход',
                effects: { stats: { happy: 5, independence: 3 }, path: { creative_elder: 1 } },
              },
            ],
          },
          {
            id: 'grandchildren',
            title: 'Внуки (или их нет)',
            scene: '🧒',
            text: 'Кто-то нянчит внуков, кто-то путешествует вдвоём.',
            choices: [
              {
                text: 'Много времени с внуками',
                effects: { stats: { happy: 5, health: -1 }, path: { grandparent: 1 }, flags: { has_grandchildren: true } },
              },
              {
                text: 'Редкая, но тёплая связь',
                effects: { stats: { happy: 3 }, path: { balanced_elder: 1 } },
              },
              {
                text: 'Своя жизнь без опеки',
                effects: { stats: { independence: 4, happy: 3 }, path: { free_elder: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '66–75 лет',
        events: [
          {
            id: 'loss',
            title: 'Потери',
            scene: '🕯️',
            text: 'Уходят друзья, иногда пара. Скорбь — часть пути.',
            choices: [
              {
                text: 'Гореешь и постепенно принимаешь',
                effects: { stats: { happy: -6, resilience: 4 }, path: { wise: 1 }, history: 'Пережил тяжёлую утрату' },
              },
              {
                text: 'Замыкаешься',
                effects: { stats: { happy: -10, social: -6, health: -3 }, path: { withdrawn: 1 } },
              },
              {
                text: 'Ищешь опору в людях и смысле',
                effects: { stats: { happy: -3, social: 3, resilience: 5 }, path: { connected: 1 } },
              },
            ],
          },
          {
            id: 'body_old',
            title: 'Тело',
            scene: '💊',
            text: 'Лекарства, прогулки, зависимость от помощи.',
            choices: [
              {
                text: 'Держишь режим, насколько можешь',
                effects: { stats: { health: 5, resilience: 3 }, path: { disciplined: 1 } },
              },
              {
                text: 'Сдаёшься быту и боли',
                effects: { stats: { health: -8, happy: -4 }, path: { declining: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: 'Финал',
        events: [
          {
            id: 'life_review',
            title: 'Взгляд назад',
            scene: '🌅',
            text: 'Ты прожил жизнь. Какие воспоминания всплывают чаще — и миришься ли ты с собой?',
            choices: [
              {
                text: 'В целом — хорошая жизнь',
                effects: { stats: { happy: 5, resilience: 4 }, path: { fulfilled: 1 }, flags: { peaceful_end: true }, history: 'Принял свою жизнь' },
              },
              {
                text: 'Много сожалений, но есть свет',
                effects: { stats: { happy: 2, resilience: 5 }, path: { bittersweet: 1 }, history: 'Жил с сожалениями, но не сломался' },
              },
              {
                text: 'Тяжело отпускать',
                effects: { stats: { happy: -4 }, path: { unfinished: 1 } },
              },
            ],
          },
          {
            id: 'the_end',
            title: 'Конец истории',
            scene: '✨',
            text: 'Дыхание становится тише. История этой жизни завершена. То, что ты выбирал с младенчества до седин, сложилось в один путь — только твой.',
            choices: [
              {
                text: 'Закрыть книгу жизни',
                effects: { flags: { life_complete: true }, history: 'Жизнь завершена' },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
