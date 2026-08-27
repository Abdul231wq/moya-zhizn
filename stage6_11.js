/**
 * Этап 6–11 — начальная школа
 */
(function () {
  const stage = {
    id: '6-11',
    title: 'Начальная школа',
    ageStartMonths: 72,
    stepMonths: 12,
    nextStageId: '11-16',
    periods: [
      {
        label: '1 класс',
        events: [
          {
            id: 'first_day',
            title: 'Первый звонок',
            scene: '🔔',
            text: 'Линейка, букет, новый рюкзак. Класс полный незнакомых лиц.',
            choices: [
              {
                text: 'Сразу знакомишься с соседом по парте',
                effects: { stats: { social: 6, happy: 4 }, path: { sociable: 1 } },
              },
              {
                text: 'Сидишь тихо и слушаешь учителя',
                effects: { stats: { intel: 3, social: -1 }, path: { obedient: 1, observant: 1 } },
              },
            ],
          },
          {
            id: 'first_grade',
            title: 'Первая оценка',
            scene: '📝',
            text: 'Учитель ставит оценку за задание. Это сильно бьёт по самооценке — в любую сторону.',
            choices: [
              {
                text: 'Получил высокую — гордишься',
                effects: { stats: { intel: 3, happy: 5 }, path: { studious: 1, confident: 1 } },
              },
              {
                text: 'Низкая — расстраиваешься, но пробуешь снова',
                effects: { stats: { resilience: 5, happy: -3 }, path: { growth_mindset: 1 } },
              },
              {
                text: 'Низкая — забиваешь и злишься',
                effects: { stats: { happy: -5, resilience: -2 }, path: { avoidant: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '2–3 класс',
        events: [
          {
            id: 'bully',
            title: 'Травля или защита',
            scene: '😤',
            text: 'В классе кто-то насмехается над слабым. Ты можешь вмешаться, проигнорировать или присоединиться.',
            choices: [
              {
                text: 'Заступаешься',
                effects: { stats: { social: 4, resilience: 4, happy: 2 }, path: { leader: 1, empathic: 1 }, history: 'Защищал слабых в школе' },
              },
              {
                text: 'Молчишь в стороне',
                effects: { stats: { social: -1 }, path: { bystander: 1 } },
              },
              {
                text: 'Смеёшься вместе с остальными',
                effects: { stats: { social: 2, happy: -2 }, path: { aggressive: 1 }, flags: { was_bully: true } },
              },
            ],
          },
          {
            id: 'hobby_school',
            title: 'Кружки после уроков',
            scene: '⚽',
            text: 'Можно углубиться в хобби или посвятить время учёбе и двору.',
            choices: [
              {
                text: 'Спорт / секция',
                effects: { stats: { health: 7, social: 4 }, path: { active: 1 }, flags: { hobby_sport: true } },
              },
              {
                text: 'Олимпиады / доп. занятия',
                effects: { stats: { intel: 8, social: -2 }, path: { studious: 1, ambitious: 1 } },
              },
              {
                text: 'Свободное время с друзьями',
                effects: { stats: { social: 6, happy: 5, intel: -1 }, path: { sociable: 1 } },
              },
            ],
          },
        ],
      },
      {
        label: '4–5 класс',
        events: [
          {
            id: 'teacher_conflict',
            title: 'Сложный учитель',
            scene: '👩‍🏫',
            text: 'Один учитель придирается. Это влияет на отношение к школе.',
            choices: [
              {
                text: 'Терпишь и тянешь предмет',
                effects: { stats: { resilience: 5, intel: 2, happy: -3 }, path: { patient: 1 } },
              },
              {
                text: 'Жалуешься родителям',
                effects: { stats: { independence: -1 }, relationships: { mother: 2 }, path: { help_seeking: 1 } },
              },
              {
                text: 'Начинаешь пропускать / забивать',
                effects: { stats: { intel: -3, happy: -2 }, path: { avoidant: 1, rebel: 1 } },
              },
            ],
          },
          {
            id: 'best_friend',
            title: 'Лучший друг',
            scene: '🤝',
            text: 'Появляется человек, с которым хочется проводить всё время.',
            choices: [
              {
                text: 'Сильная дружба, общие секреты',
                effects: { stats: { social: 6, happy: 6 }, path: { loyal: 1 }, flags: { has_best_friend: true }, history: 'Появился лучший друг' },
              },
              {
                text: 'Дружишь со всеми понемногу',
                effects: { stats: { social: 5 }, path: { sociable: 1 } },
              },
              {
                text: 'Предпочитаешь одиночество',
                effects: { stats: { intel: 3, social: -3 }, path: { introvert: 1 } },
              },
            ],
          },
          {
            id: 'end_primary',
            title: 'Конец началки',
            scene: '📚',
            text: 'Впереди среднее звено. Характер и привычки к учёбе уже заметны.',
            choices: [
              {
                text: 'Готов к переменам',
                effects: { stats: { resilience: 3, independence: 3 }, path: { confident: 1 } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
