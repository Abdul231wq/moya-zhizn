/**
 * Этап 18–25 — молодость
 */
(function () {
  const stage = {
    id: '18-25',
    title: 'Молодость',
    ageStartMonths: 216,
    stepMonths: 12,
    nextStageId: '25-40',
    periods: [
      {
        label: '18–19 лет',
        events: [
          {
            id: 'first_independence',
            title: 'Своя жизнь',
            scene: '🔑',
            text: 'Общага, съёмная комната или всё ещё родительский дом.',
            choices: [
              {
                text: 'Живёшь отдельно',
                effects: { stats: { independence: 8, money: -10, resilience: 4 }, path: { independent: 1 }, flags: { lives_alone: true } },
              },
              {
                text: 'С родителями, копишь',
                effects: { stats: { money: 8, independence: -2, happy: -1 }, path: { pragmatic: 1 }, relationships: { mother: 2 } },
              },
              {
                text: 'С парнем/девушкой',
                effects: { stats: { happy: 5, social: 3, money: -5 }, path: { romantic: 1 }, flags: { cohabiting_early: true } },
              },
            ],
          },
          {
            id: 'study_or_job',
            title: 'Учёба или работа',
            scene: '💼',
            text: 'Будни заполняются тем, что ты выбрал на развилке.',
            condition: (c) => true,
            choices: [
              {
                text: 'Пары, сессии, студенческая жизнь',
                effects: { stats: { intel: 5, social: 4, money: -3 }, path: { student: 1 }, flags: { in_university: true } },
                // show more if path_uni - simplified always available
              },
              {
                text: 'Смена подработок',
                effects: { stats: { money: 6, independence: 4, resilience: 3 }, path: { hustler: 1 } },
              },
              {
                text: 'Одна стабильная работа с низа',
                effects: { stats: { money: 8, independence: 3 }, path: { steady_worker: 1 }, flags: { stable_job_young: true } },
              },
            ],
          },
        ],
      },
      {
        label: '20–21 год',
        events: [
          {
            id: 'money_lesson',
            title: 'Деньги и урок',
            scene: '💸',
            text: 'Первый кредит, долг другу или удачная подработка — финансовый характер ковается здесь.',
            choices: [
              {
                text: 'Копишь и планируешь',
                effects: { stats: { money: 14, independence: 2 }, path: { saver: 1 }, flags: { financially_literate: true } },
              },
              {
                text: 'Тратишь на опыт и кайф',
                effects: { stats: { happy: 6, money: -8, social: 3 }, path: { spender: 1 } },
              },
              {
                text: 'Влезаешь в долг',
                effects: { stats: { money: -10, happy: -3, resilience: 2 }, path: { debt_lesson: 1 }, flags: { had_debt: true }, history: 'Узнал, что такое долги' },
              },
            ],
          },
          {
            id: 'budget_game',
            title: 'Первая самостоятельная зарплата',
            scene: '💰',
            text: 'Раздели месячный доход по статьям расходов сам — как в жизни.',
            minigame: 'budget',
          },
          {
            id: 'career_start',
            title: 'Первые карьерные шаги',
            scene: '📈',
            text: 'Стажировка, повышение или осознание, что «не твоё».',
            choices: [
              {
                text: 'Цепляешься за рост в найме',
                effects: { stats: { money: 6, intel: 2 }, path: { careerist: 1 }, flags: { career_corporate: true } },
              },
              {
                text: 'Пробуешь своё дело / фриланс',
                effects: { stats: { independence: 6, money: 2, resilience: 4 }, path: { entrepreneur_mindset: 1 }, flags: { tried_business: true } },
              },
              {
                text: 'Меняешь направление полностью',
                effects: { stats: { resilience: 5, happy: 2 }, path: { flexible: 1 }, history: 'Сменил траекторию в молодости' },
              },
            ],
          },
          {
            id: 'job_interview_game',
            title: 'Собеседование',
            scene: '🎤',
            text: 'Прежде чем выбрать карьерный путь — реальное собеседование, вопрос за вопросом.',
            minigame: 'interview',
          },
        ],
      },
      {
        label: '22–24 года',
        events: [
          {
            id: 'relationship_adult',
            title: 'Взрослые отношения',
            scene: '🏠',
            text: 'Совместный быт, разговоры о будущем или расставание.',
            choices: [
              {
                text: 'Строишь пару всерьёз',
                effects: { stats: { happy: 5, social: 3 }, path: { partner_oriented: 1 }, flags: { serious_partner: true } },
              },
              {
                text: 'Расстаёшься и пересобираешь себя',
                effects: { stats: { independence: 5, happy: -4, resilience: 5 }, path: { resilient: 1 }, history: 'Пережил расставание' },
              },
              {
                text: 'Свободен и не торопишься',
                effects: { stats: { independence: 4, social: 4 }, path: { free_spirit: 1 } },
              },
            ],
          },
          {
            id: 'quarter_life',
            title: 'Кризис четверти жизни',
            scene: '😕',
            text: '«Я уже взрослый, а всё ещё не понимаю, куда иду».',
            choices: [
              {
                text: 'Принимаешь неопределённость',
                effects: { stats: { resilience: 4, happy: 2 }, path: { growth_mindset: 1 } },
              },
              {
                text: 'Паникуешь и сравниваешь себя с другими',
                effects: { stats: { happy: -6, social: -2 }, path: { anxious: 1 } },
              },
              {
                text: 'Ставишь конкретную цель на 2–3 года',
                effects: { stats: { independence: 4, intel: 2 }, path: { ambitious: 1, focused: 1 } },
              },
            ],
          },
        ],
      },
    ],
  };
  window.MOL.registerStage(stage);
})();
