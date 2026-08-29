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
          {
            id: 'homework_habit',
            title: 'Домашние задания',
            scene: '📓',
            text: 'Каждый день теперь нужно что-то делать после школы, а не просто играть.',
            choices: [
              {
                text: 'Садишься сам, без напоминаний',
                effects: { stats: { intel: 4, independence: 4 }, path: { responsible: 1, studious: 1 } },
              },
              {
                text: 'Делаешь только под контролем родителей',
                effects: { stats: { intel: 3 }, path: { dependent: 1 }, relationships: { mother: -1 } },
              },
              {
                text: 'Постоянно тянешь и не успеваешь',
                effects: { stats: { intel: -2, happy: -2 }, path: { avoidant: 1 } },
              },
            ],
          },
          {
            id: 'get_pet',
            title: 'Завести питомца?',
            scene: '🐾',
            text: 'Ты давно просишь завести кого-то живого дома — и родители наконец готовы обсудить это всерьёз.',
            choices: [
              {
                text: 'Собака',
                effects: { stats: { happy: 5, resilience: 2, social: 2 }, path: { caregiver: 1 }, flags: { has_pet: true, pet_type: 'dog' }, history: 'В доме появилась собака' },
              },
              {
                text: 'Кошка',
                effects: { stats: { happy: 5, resilience: 2 }, path: { caregiver: 1 }, flags: { has_pet: true, pet_type: 'cat' }, history: 'В доме появилась кошка' },
              },
              {
                text: 'Мелкий питомец (хомяк, рыбки, попугай)',
                effects: { stats: { happy: 3, independence: 2 }, path: { caregiver: 1 }, flags: { has_pet: true, pet_type: 'small' }, history: 'В доме появился маленький питомец' },
              },
              {
                text: 'Родители против — обойдёшься без питомца',
                effects: { stats: { happy: -2 }, path: { disappointed: 1 } },
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
          {
            id: 'pocket_money',
            title: 'Первые карманные деньги',
            scene: '🪙',
            text: 'Родители начали давать небольшую сумму на неделю.',
            choices: [
              {
                text: 'Копишь на что-то важное',
                effects: { stats: { intel: 2, independence: 3 }, path: { saver: 1 }, flags: { early_saver: true } },
              },
              {
                text: 'Тратишь сразу на сладости и мелочи',
                effects: { stats: { happy: 3 }, path: { spender: 1 } },
              },
              {
                text: 'Отдаёшь часть младшему брату/сестре или другу',
                effects: { stats: { social: 3, happy: 2 }, path: { generous: 1 } },
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
          {
            id: 'family_move',
            title: 'Переезд',
            scene: '📦',
            text: 'Семья переезжает — новый район или город, новая школа маячит впереди.',
            condition: (c) => Math.random() < 0.28,
            choices: [
              {
                text: 'Воспринимаешь как приключение',
                effects: { stats: { resilience: 4, social: 2 }, path: { adaptable: 1 }, flags: { moved_child: true } },
              },
              {
                text: 'Тяжело прощаться со старой жизнью',
                effects: { stats: { happy: -4, resilience: 2 }, path: { sensitive: 1 }, flags: { moved_child: true } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
