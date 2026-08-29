/**
 * Этап 3–6 лет — дошкольный
 */
(function () {
  const stage = {
    id: '3-6',
    title: 'Дошкольный возраст',
    ageStartMonths: 36,
    stepMonths: 6,
    nextStageId: '6-11',
    periods: [
      {
        label: '3–3.5 года',
        events: [
          {
            id: 'speech',
            title: 'Речь и вопросы',
            scene: '❓',
            text: 'Ты задаёшь бесконечные «почему?». Родители реагируют по-разному.',
            choices: [
              {
                text: 'Отвечают терпеливо и объясняют',
                effects: { stats: { intel: 6, happy: 3 }, path: { curious: 1, verbal: 1 }, history: 'Любопытство поощряли' },
              },
              {
                text: 'Отмахиваются: «потому что»',
                effects: { stats: { intel: 1, happy: -2 }, path: { suppressed: 1 } },
              },
            ],
          },
          {
            id: 'friends_first',
            title: 'Первые друзья',
            scene: '🧒',
            text: 'В саду или во дворе появляются другие дети. Ты выбираешь, как себя вести.',
            choices: [
              {
                text: 'Легко идёшь на контакт',
                effects: { stats: { social: 7, happy: 4 }, path: { sociable: 1 } },
              },
              {
                text: 'Держишься рядом с воспитателем/мамой',
                effects: { stats: { social: -2, resilience: 2 }, path: { shy: 1, home_bonded: 1 } },
              },
              {
                text: 'Играешь один, но уверенно',
                effects: { stats: { independence: 5, intel: 2 }, path: { independent_play: 1 } },
              },
            ],
          },
          {
            id: 'imagination_play',
            title: 'Воображаемый мир',
            scene: '🦄',
            text: 'Ты часами играешь в придуманного друга или целую вымышленную страну.',
            choices: [
              {
                text: 'Родители подыгрывают и включаются',
                effects: { stats: { intel: 4, happy: 5 }, path: { creative: 1 }, relationships: { mother: 2 }, history: 'Родители поддерживали фантазию' },
              },
              {
                text: 'Взрослые считают это странным и обрывают',
                effects: { stats: { happy: -3, intel: -1 }, path: { suppressed: 1 } },
              },
              {
                text: 'Играешь в это тайком ото всех',
                effects: { stats: { independence: 4 }, path: { introvert: 1, creative: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '4–4.5 года',
        events: [
          {
            id: 'conflict_toy',
            title: 'Ссора из-за игрушки',
            scene: '🧸',
            text: 'Другой ребёнок забрал твою игрушку. Что ты делаешь?',
            choices: [
              {
                text: 'Отбираешь силой / кричишь',
                effects: { stats: { social: -3, resilience: 2 }, path: { aggressive: 1 } },
              },
              {
                text: 'Жалуешься взрослому',
                effects: { stats: { social: 1 }, path: { help_seeking: 1 } },
              },
              {
                text: 'Предлагаешь играть вместе',
                effects: { stats: { social: 6, happy: 3 }, path: { empathic: 1, sociable: 1 } },
              },
            ],
          },
          {
            id: 'hobby_seed',
            title: 'Кружок или секция',
            scene: '🎨',
            text: 'Родители предлагают занятие: рисование, танцы, спорт или ничего.',
            choices: [
              {
                text: 'Рисование / музыка',
                effects: { stats: { intel: 4, happy: 4 }, path: { creative: 1 }, flags: { hobby_arts: true } },
              },
              {
                text: 'Спорт / плавание',
                effects: { stats: { health: 6, social: 3 }, path: { active: 1 }, flags: { hobby_sport: true } },
              },
              {
                text: 'Пока никуда не ходишь',
                effects: { stats: { happy: 1, independence: 2 }, path: { free_play: 1 } },
              },
            ],
          },
          {
            id: 'screen_time',
            title: 'Мультфильмы без конца',
            scene: '📱',
            text: 'Экран успокаивает и даёт родителям передышку, но времени перед ним всё больше.',
            choices: [
              {
                text: 'Строго ограничивают время',
                effects: { stats: { intel: 3, resilience: 2, happy: -1 }, path: { structured: 1 } },
              },
              {
                text: 'Смотришь сколько хочешь',
                effects: { stats: { happy: 3, social: -3, intel: -2 }, path: { screen_heavy: 1 }, flags: { screen_heavy_child: true } },
              },
              {
                text: 'Заменяют экран на игры и прогулки',
                effects: { stats: { health: 4, social: 3 }, path: { active: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '5–5.5 лет',
        events: [
          {
            id: 'prep_school',
            title: 'Подготовка к школе',
            scene: '📘',
            text: 'Кто-то уже учит буквы и счёт. Давление растёт.',
            choices: [
              {
                text: 'Занимаешься регулярно, без давления',
                effects: { stats: { intel: 7, resilience: 2 }, path: { studious: 1 }, flags: { school_ready: true } },
              },
              {
                text: 'Сильно готовят «на отлично»',
                effects: { stats: { intel: 5, happy: -4 }, path: { pressured: 1, studious: 1 }, flags: { school_ready: true } },
              },
              {
                text: 'Почти не готовят — «само научится»',
                effects: { stats: { intel: 1, independence: 3, happy: 2 }, path: { free_play: 1 } },
              },
            ],
          },
          {
            id: 'lie_first',
            title: 'Первая ложь',
            scene: '🙈',
            text: 'Ты разбил вазу и можешь сказать правду или свалить на кота.',
            choices: [
              {
                text: 'Признаться',
                effects: { stats: { resilience: 4 }, path: { honest: 1 }, relationships: { mother: 2, father: 2 } },
              },
              {
                text: 'Соврать',
                effects: { stats: { happy: 1 }, path: { cunning: 1 }, flags: { lied_early: true } },
              },
            ],
          },
          {
            id: 'sharing_dilemma',
            title: 'Делиться или нет',
            scene: '🍬',
            text: 'У тебя есть последняя конфета, а друг просит поделиться.',
            choices: [
              {
                text: 'Делишься не задумываясь',
                effects: { stats: { social: 5, happy: 2 }, path: { generous: 1 }, history: 'Легко делился с другими' },
              },
              {
                text: 'Делишь честно пополам после раздумий',
                effects: { stats: { intel: 2, social: 3 }, path: { fair: 1 } },
              },
              {
                text: 'Съедаешь сам',
                effects: { stats: { social: -2, happy: 1 }, path: { self_focused: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '5.5–6 лет',
        events: [
          {
            id: 'first_responsibility',
            title: 'Первое поручение',
            scene: '🧹',
            text: 'Родители впервые доверяют тебе маленькое дело по дому — полить цветок или убрать игрушки.',
            choices: [
              {
                text: 'Стараешься сделать хорошо',
                effects: { stats: { independence: 5, resilience: 2 }, path: { responsible: 1 }, relationships: { mother: 2 } },
              },
              {
                text: 'Делаешь кое-как, лишь бы отстали',
                effects: { stats: { independence: 1 }, path: { avoidant: 1 } },
              },
              {
                text: 'Забываешь и отказываешься',
                effects: { stats: { happy: 1, independence: -2 }, path: { stubborn: 1 } },
              },
            ],
          },
          {
            id: 'kindergarten_goodbye',
            title: 'Прощание с садом',
            scene: '👋',
            text: 'Последний день в детском саду. Воспитатели и друзья, с которыми не увидишься каждый день.',
            choices: [
              {
                text: 'Грустишь и обмениваешься контактами родителей',
                effects: { stats: { happy: -1, social: 3 }, path: { loyal: 1 }, history: 'Тепло попрощался с садом' },
              },
              {
                text: 'С лёгкостью идёшь дальше',
                effects: { stats: { resilience: 3, independence: 2 }, path: { adaptable: 1 } },
              },
            ],
          },
          {
            id: 'school_threshold',
            title: 'Порог школы',
            scene: '🏫',
            text: 'Скоро первый класс. Ты волнуешься, гордишься или боишься.',
            choices: [
              {
                text: 'С нетерпением ждёшь',
                effects: { stats: { happy: 5, social: 3, intel: 2 }, path: { optimistic: 1 }, history: 'С радостью шёл в школу' },
              },
              {
                text: 'Боишься и цепляешься за дом',
                effects: { stats: { happy: -3, resilience: 2 }, path: { anxious: 1, home_bonded: 1 } },
              },
              {
                text: 'Спокойно относишься',
                effects: { stats: { resilience: 4, independence: 3 }, path: { balanced: 1 } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
