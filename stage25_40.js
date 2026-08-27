/**
 * Этап 25–40 — взрослость
 */
(function () {
  const stage = {
    id: '25-40',
    title: 'Взрослость',
    ageStartMonths: 300,
    stepMonths: 24,
    nextStageId: '40-60',
    periods: [
      {
        label: '25–27 лет',
        events: [
          {
            id: 'career_ladder',
            title: 'Карьерная развилка',
            scene: '🏢',
            text: 'Повышение, смена сферы или свой проект — выбор закрепляет траекторию.',
            choices: [
              {
                text: 'Расти в найме',
                effects: { stats: { money: 18, independence: -1 }, path: { careerist: 1 }, flags: { corporate_path: true } },
              },
              {
                text: 'Свой бизнес / проекты',
                effects: { stats: { money: 5, independence: 8, resilience: 5 }, path: { entrepreneur_mindset: 2 }, flags: { business_owner: true }, history: 'Запустил своё дело' },
              },
              {
                text: 'Фриланс / гибкий график',
                effects: { stats: { independence: 6, money: 4, happy: 3 }, path: { flexible: 1 }, flags: { freelancer: true } },
              },
            ],
          },
          {
            id: 'marriage_or_not',
            title: 'Брак',
            scene: '💍',
            text: 'Предложение, роспись или решение подождать.',
            choices: [
              {
                text: 'Женишься / выходишь замуж',
                effects: { stats: { happy: 6, social: 2 }, path: { family_oriented: 1 }, flags: { married: true }, history: 'Заключил брак' },
              },
              {
                text: 'Гражданский брак без штампа',
                effects: { stats: { happy: 4, independence: 2 }, flags: { partnered: true } },
              },
              {
                text: 'Остаёшься без пары',
                effects: { stats: { independence: 4 }, path: { independent: 1 }, flags: { single_adult: true } },
              },
            ],
          },
        ],
      },
      {
        label: '28–32 года',
        events: [
          {
            id: 'children',
            title: 'Дети',
            scene: '👶',
            text: 'Вопрос, который делит жизни на «до» и «после». Теперь ты — по ту сторону колыбели.',
            choices: [
              {
                text: 'Рождается ребёнок',
                effects: {
                  stats: { happy: 5, money: -8, health: -2, independence: -3 },
                  path: { parent: 2 },
                  flags: { has_children: true },
                  history: 'Стал родителем',
                },
              },
              {
                text: 'Откладываете на потом',
                effects: { stats: { independence: 2, money: 5 }, path: { delayed_parenthood: 1 } },
              },
              {
                text: 'Решаете не заводить',
                effects: { stats: { independence: 3, money: 6 }, path: { childfree: 1 }, flags: { childfree: true } },
              },
            ],
          },
          {
            id: 'parenting_style',
            title: 'Как воспитывать',
            scene: '🍼',
            text: 'Ночные крики. Ты вспоминаешь собственное младенчество — и выбираешь.',
            condition: (c) => c.flags.has_children,
            choices: [
              {
                text: 'Много тепла, быстрый отклик',
                effects: { stats: { happy: 3 }, path: { warm_parent: 1 }, relationships: { mother: 1 }, history: 'Воспитывал с теплом' },
              },
              {
                text: 'Режим и самостоятельность',
                effects: { path: { structured_parent: 1 }, history: 'Воспитывал через режим' },
              },
              {
                text: 'Хаос и усталость — как получится',
                effects: { stats: { health: -3, happy: -2 }, path: { overwhelmed_parent: 1 } },
              },
            ],
          },
          {
            id: 'child_sleepless_nights',
            title: 'Малыш не спит',
            scene: '😴',
            text: 'Ребёнку несколько месяцев. Ты помнишь это чувство ещё по себе — теперь по другую сторону колыбели.',
            condition: (c) => c.flags.has_children,
            choices: [
              {
                text: 'Терпеливо укачивать каждую ночь',
                effects: { stats: { health: -2, happy: 2 }, path: { attentive_parent: 1 }, flags: { child_close_bond: true }, history: 'Ночами укачивал(а) малыша сам(а)' },
              },
              {
                text: 'Разделить ночи с партнёром/бабушкой',
                effects: { stats: { health: 1, resilience: 2 }, path: { team_parent: 1 }, history: 'Делил(а) ночные смены с семьёй' },
              },
              {
                text: 'Дать проплакаться, беречь свои силы',
                effects: { stats: { health: 3, happy: -1 }, path: { practical_parent: 1 }, flags: { child_independent_early: true } },
              },
            ],
          },
          {
            id: 'child_first_steps_parent',
            title: 'Первые шаги малыша',
            scene: '🚼',
            text: 'Ребёнок встаёт на ноги. Каждое падение — маленькое испытание уже для тебя как родителя.',
            condition: (c) => c.flags.has_children,
            choices: [
              {
                text: 'Радоваться и хвалить за попытки',
                effects: { stats: { happy: 4 }, path: { encouraging_parent: 1 }, flags: { child_confident: true }, history: 'Хвалил(а) ребёнка за каждую попытку' },
              },
              {
                text: 'Тревожиться и подстраховывать во всём',
                effects: { stats: { happy: -1, resilience: -1 }, path: { anxious_parent: 1 }, flags: { child_overprotected: true } },
              },
              {
                text: 'Дать пространство падать и вставать самому',
                effects: { stats: { resilience: 2 }, path: { hands_off_parent: 1 }, flags: { child_independent_early: true } },
              },
            ],
          },
          {
            id: 'child_toddler_wrap',
            title: 'Ребёнку почти три',
            scene: '🌱',
            text: 'Первые годы малыша пролетели через твои же решения. Оглядываясь, ты видишь, каким родителем стал(а).',
            condition: (c) => c.flags.has_children,
            choices: [
              {
                text: 'Горжусь тем, как мы справились вместе',
                effects: { stats: { happy: 5, resilience: 2 }, path: { fulfilled_parent: 1 }, flags: { raised_toddler: true }, history: 'Первые годы ребёнка прожиты с теплом и гордостью' },
              },
              {
                text: 'Устал(а), но это того стоило',
                effects: { stats: { health: -2, happy: 3 }, path: { tired_parent: 1 }, flags: { raised_toddler: true }, history: 'Первые годы ребёнка дались тяжело, но справились' },
              },
              {
                text: 'Чувствую, что многое упустил(а)',
                effects: { stats: { happy: -3 }, path: { guilty_parent: 1 }, flags: { raised_toddler: true }, history: 'Первые годы ребёнка прошли смазанно — много было упущено' },
              },
            ],
          },
          {
            id: 'housing',
            title: 'Жильё',
            scene: '🏡',
            text: 'Ипотека, аренда или наследство — стены влияют на спокойствие.',
            choices: [
              {
                text: 'Покупаешь / ипотека',
                effects: { stats: { money: -8, happy: 4, resilience: 2 }, flags: { homeowner: true }, path: { responsible: 1 } },
              },
              {
                text: 'Арендуешь и не привязываешься',
                effects: { stats: { money: -5, independence: 3 }, path: { flexible: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '33–39 лет',
        events: [
          {
            id: 'mid_check',
            title: 'Середина пути',
            scene: '⚖️',
            text: 'Карьера, семья, здоровье — что просело, то требует внимания.',
            choices: [
              {
                text: 'Вкладываешься в здоровье',
                effects: { stats: { health: 10, happy: 3 }, path: { health_conscious: 1 }, flags: { sports_habit: true } },
              },
              {
                text: 'В карьеру на максимум',
                effects: { stats: { money: 14, health: -4, happy: -2 }, path: { workaholic: 1 } },
              },
              {
                text: 'В отношения и детей',
                effects: { stats: { happy: 6, social: 3, money: -4 }, path: { family_oriented: 1 } },
              },
            ],
          },
          {
            id: 'crisis_or_growth',
            title: 'Перелом',
            scene: '🔥',
            text: 'Увольнение, развод или внезапный шанс. Жизнь не идёт по прямой.',
            choices: [
              {
                text: 'Используешь кризис как перезапуск',
                effects: { stats: { resilience: 5, independence: 4, happy: 2 }, path: { resilient: 1, growth_mindset: 1 }, history: 'Пережил кризис и вырос' },
              },
              {
                text: 'Цепляешься за старое',
                effects: { stats: { happy: -5, resilience: -2 }, path: { rigid: 1 } },
              },
              {
                text: 'Уходишь в зависимость / изоляцию',
                effects: { stats: { health: -6, happy: -8, social: -5 }, path: { withdrawn: 1 }, flags: { dark_period: true } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
