/**
 * Этап 0–3 года (младенчество)
 * 6 периодов по 6 месяцев
 */
(function () {
  const stage = {
    id: '0-3',
    title: 'Младенчество',
    ageStartMonths: 0,
    stepMonths: 6,
    nextStageId: '3-6',
    periods: [
      // 0–6 мес
      {
        label: '0–6 месяцев',
        events: [
          {
            id: 'birth',
            title: 'Рождение',
            scene: '👶',
            text: 'Ты появился на свет. Больница, яркий свет, голоса. Мама держит тебя на руках — мир пока состоит только из тепла и звуков.',
            choices: [
              {
                text: 'Громко закричать — заявить о себе',
                effects: {
                  stats: { social: 5, happy: 3 },
                  path: { expressive: 1 },
                  history: 'Громко заявил о себе при рождении',
                },
              },
              {
                text: 'Тихо наблюдать',
                effects: {
                  stats: { intel: 3, resilience: 2 },
                  path: { observant: 1 },
                  history: 'С первых минут внимательно смотрел на мир',
                },
              },
            ],
          },
          {
            id: 'night_cry',
            title: 'Ночной плач',
            scene: '🌙',
            text: 'Ночь. Ты плачешь. Родители устали. Решение сейчас заложит фундамент твоей самостоятельности и чувства безопасности.',
            choices: [
              {
                text: 'Родители сразу берут на руки',
                effects: {
                  stats: { happy: 5, independence: -5 },
                  relationships: { mother: 5, father: 3 },
                  path: { overprotected: 1 },
                  flags: { soothed_quickly: true },
                  history: 'Ночью всегда быстро утешали',
                },
              },
              {
                text: 'Дают немного поплакать, потом берут',
                effects: {
                  stats: { independence: 6, resilience: 4, happy: -2 },
                  path: { self_soothe: 1 },
                  history: 'Учился успокаиваться сам',
                },
              },
              {
                text: 'Долго оставляют — «пусть привыкает»',
                effects: {
                  stats: { independence: 8, happy: -8, resilience: 2 },
                  relationships: { mother: -5 },
                  path: { neglected_feelings: 1 },
                  history: 'Иногда плакал в одиночестве',
                },
              },
            ],
          },
          {
            id: 'first_smile',
            title: 'Первая улыбка',
            scene: '😊',
            text: 'Ты впервые осознанно улыбнулся. Родители в восторге. Кто чаще всего рядом в эти моменты?',
            choices: [
              {
                text: 'Улыбаться маме',
                effects: {
                  stats: { happy: 5, social: 3 },
                  relationships: { mother: 8 },
                  path: { close_to_mother: 1 },
                },
              },
              {
                text: 'Улыбаться папе',
                effects: {
                  stats: { happy: 5, social: 3 },
                  relationships: { father: 8 },
                  path: { close_to_father: 1 },
                },
              },
              {
                text: 'Улыбаться обоим и гостям',
                effects: {
                  stats: { social: 7, happy: 4 },
                  path: { sociable: 1 },
                },
              },
            ],
          },
        ],
      },
      // 6–12 мес
      {
        label: '6–12 месяцев',
        events: [
          {
            id: 'crawl',
            title: 'Первые ползания',
            scene: 'crawl',
            text: 'Ты начал ползать. Весь дом стал огромным исследованием. Как реагируют родители?',
            choices: [
              {
                text: 'Обезопасили дом и дали свободу',
                effects: {
                  stats: { independence: 6, intel: 3, happy: 4 },
                  path: { explorer: 1 },
                  history: 'Свободно исследовал дом',
                },
              },
              {
                text: 'Постоянно подхватывали и ограничивали',
                effects: {
                  stats: { independence: -4, health: 2 },
                  path: { overprotected: 1 },
                  history: 'Родители сильно ограничивали движение',
                },
              },
            ],
          },
          {
            id: 'vaccine',
            title: 'Прививки',
            scene: '💉',
            text: 'В поликлинике предлагают сделать прививки по календарю. Решение повлияет на здоровье и флаги на годы вперёд.',
            choices: [
              {
                text: 'Сделать все по графику',
                effects: {
                  stats: { health: 5 },
                  flags: { vaccinated: true },
                  history: 'Привит по календарю',
                },
              },
              {
                text: 'Отложить / сделать выборочно',
                effects: {
                  flags: { vaccinated: false, vaccine_delayed: true },
                  path: { alternative_health: 1 },
                  history: 'Прививки отложили',
                },
              },
            ],
          },
          {
            id: 'first_words_prep',
            title: 'Лепет и внимание',
            scene: '🗣️',
            text: 'Ты активно лепечешь. Кто-то отвечает на каждый звук, кто-то включает мультики.',
            choices: [
              {
                text: 'С тобой много разговаривают',
                effects: {
                  stats: { intel: 6, social: 5 },
                  path: { verbal: 1 },
                  history: 'С раннего возраста много слышал речь',
                },
              },
              {
                text: 'Часто включают экран',
                effects: {
                  stats: { intel: 1, social: -2, happy: 2 },
                  path: { screen_early: 1 },
                  flags: { early_screen: true },
                },
              },
            ],
          },
        ],
      },
      // 12–18 мес
      {
        label: '1–1.5 года',
        events: [
          {
            id: 'first_steps',
            title: 'Первые шаги',
            scene: '🚶',
            text: 'Ты встал и сделал несколько шагов сам. Падение неизбежно. Как встречают неудачу?',
            choices: [
              {
                text: 'Хвалят за попытку, помогают встать',
                effects: {
                  stats: { resilience: 6, happy: 5, independence: 3 },
                  path: { growth_mindset: 1 },
                  history: 'Учили не бояться падений',
                },
              },
              {
                text: 'Испуганно хватают и запрещают',
                effects: {
                  stats: { independence: -3, resilience: -2 },
                  path: { cautious: 1, overprotected: 1 },
                },
              },
            ],
          },
          {
            id: 'stranger',
            title: 'Чужой человек',
            scene: '👤',
            text: 'В гости пришёл незнакомый родственник. Тянется к тебе. Твоя реакция:',
            choices: [
              {
                text: 'Спрятаться за маму',
                effects: {
                  stats: { social: -2, resilience: 1 },
                  relationships: { mother: 3 },
                  path: { shy: 1 },
                },
              },
              {
                text: 'С любопытством смотреть',
                effects: {
                  stats: { social: 3, intel: 2 },
                  path: { curious: 1 },
                },
              },
              {
                text: 'Улыбнуться и потянуться',
                effects: {
                  stats: { social: 6, happy: 3 },
                  path: { sociable: 1 },
                },
              },
            ],
          },
        ],
      },
      // 18–24 мес
      {
        label: '1.5–2 года',
        events: [
          {
            id: 'no_phase',
            title: 'Эпоха «нет»',
            scene: '🙅',
            text: 'Ты открыл слово «нет». Одеваться, есть, идти гулять — на всё отказ. Как отвечают взрослые?',
            choices: [
              {
                text: 'Дают выбор из двух вариантов',
                effects: {
                  stats: { independence: 5, happy: 3, resilience: 2 },
                  path: { autonomy: 1 },
                  history: 'Учили выбирать, а не только слушаться',
                },
              },
              {
                text: 'Настаивают жёстко',
                effects: {
                  stats: { independence: -3, resilience: 3 },
                  path: { obedient: 1, suppressed: 1 },
                },
              },
              {
                text: 'Уступают почти всегда',
                effects: {
                  stats: { independence: 4, happy: 4, resilience: -3 },
                  path: { spoiled: 1 },
                },
              },
            ],
          },
          {
            id: 'daycare_talk',
            title: 'Разговор о садике',
            scene: '🏫',
            text: 'Родители обсуждают, отдавать ли тебя в ясли/садик. Ты это чувствуешь.',
            condition: (c) => c.income !== 'high' || true,
            choices: [
              {
                text: 'Пойдёшь в садик раньше',
                effects: {
                  flags: { early_daycare: true },
                  stats: { social: 4, independence: 5, happy: -3 },
                  path: { early_collective: 1 },
                  history: 'Рано попал в детский коллектив',
                },
              },
              {
                text: 'Пока останешься дома',
                effects: {
                  flags: { early_daycare: false },
                  stats: { happy: 3, social: -2 },
                  relationships: { mother: 4 },
                  path: { home_bonded: 1 },
                },
              },
            ],
          },
        ],
      },
      // 24–30 мес
      {
        label: '2–2.5 года',
        events: [
          {
            id: 'sibling_or_not',
            title: 'Ещё один ребёнок?',
            scene: '👪',
            text: 'В семье говорят о втором ребёнке. Иногда это уже происходит.',
            choices: [
              {
                text: 'Появляется младший брат/сестра',
                effects: {
                  flags: { has_sibling: true },
                  stats: { social: 3, happy: -4, independence: 4 },
                  path: { sibling_rivalry: 1 },
                  relationships: { mother: -3 },
                  history: 'Появился младший ребёнок в семье',
                },
              },
              {
                text: 'Ты пока единственный',
                effects: {
                  flags: { has_sibling: false },
                  stats: { happy: 2 },
                  path: { only_child: 1 },
                },
              },
            ],
          },
          {
            id: 'potty',
            title: 'Горшок',
            scene: '🚽',
            text: 'Пришло время приучать к горшку. У всех по-разному.',
            choices: [
              {
                text: 'Терпеливо, без давления',
                effects: {
                  stats: { independence: 5, happy: 2, resilience: 2 },
                  path: { patient_learning: 1 },
                },
              },
              {
                text: 'Строго и быстро',
                effects: {
                  stats: { independence: 3, happy: -4 },
                  path: { pressured: 1 },
                },
              },
            ],
          },
        ],
      },
      // 30–36 мес
      {
        label: '2.5–3 года',
        events: [
          {
            id: 'kindergarten',
            title: 'Детский сад',
            scene: '🎒',
            text: 'Тебе около трёх. Многие идут в сад. Первый день — сильный стресс или приключение.',
            choices: [
              {
                text: 'Идёшь в сад, родители помогают адаптироваться',
                effects: {
                  flags: { kindergarten: true },
                  stats: { social: 5, independence: 6, happy: -2, resilience: 4 },
                  path: { collective: 1 },
                  history: 'Пошёл в детский сад',
                },
              },
              {
                text: 'Остаёшься дома с кем-то из взрослых',
                effects: {
                  flags: { kindergarten: false },
                  stats: { social: -3, happy: 3, intel: 2 },
                  path: { home_bonded: 1 },
                },
              },
            ],
          },
          {
            id: 'favorite_play',
            title: 'Любимая игра',
            scene: '🧸',
            text: 'К трём годам уже видно, что тебе ближе.',
            choices: [
              {
                text: 'Кубики, сортеры, «как устроено»',
                effects: {
                  stats: { intel: 7 },
                  path: { builder: 1, curious: 1 },
                  history: 'Любил собирать и разбирать',
                },
              },
              {
                text: 'Ролевые игры, куклы, «дочки-матери»',
                effects: {
                  stats: { social: 6, happy: 3 },
                  path: { empathic: 1 },
                },
              },
              {
                text: 'Бегать, прыгать, мяч',
                effects: {
                  stats: { health: 6, social: 3 },
                  path: { active: 1 },
                },
              },
            ],
          },
          {
            id: 'stage_end_reflect',
            title: 'Тебе почти 3',
            scene: '🌿',
            text: 'Младенчество позади. Характер уже проявляется. То, как с тобой были все эти годы, станет фундаментом школы и дальше.',
            choices: [
              {
                text: 'Вперёд — в дошкольный возраст',
                effects: {
                  stats: { happy: 2 },
                  history: 'Завершил этап младенчества',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  // scene emoji fix for crawl
  stage.periods[1].events[0].scene = '🐛';

  window.MOL.registerStage(stage);
})();
