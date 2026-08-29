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
          {
            id: 'uni_distraction',
            title: 'На что уходят силы',
            scene: '🎭',
            text: 'Учёба идёт своим чередом, но вокруг слишком много того, что тянет внимание в сторону.',
            condition: (c) => c.flags.in_university === true,
            choices: [
              {
                text: 'Влюбляешься без остатка',
                effects: { stats: { happy: 6, social: 4, intel: -4 }, path: { romantic: 1 }, flags: { uni_love: true }, history: 'В университете голову вскружила любовь' },
              },
              {
                text: 'Вечеринки важнее лекций',
                effects: { stats: { happy: 5, social: 5, intel: -5, money: -4 }, path: { party: 1 }, flags: { uni_partying: true }, history: 'Студенческие годы прошли шумно' },
              },
              {
                text: 'Постоянная подработка вместо конспектов',
                effects: { stats: { money: 8, independence: 4, intel: -2, health: -2 }, path: { hustler: 1 }, flags: { uni_worked: true }, history: 'Совмещал(а) учёбу с постоянной подработкой' },
              },
              {
                text: 'Студсовет, стажировки, нетворкинг',
                effects: { stats: { social: 4, independence: 3, intel: 1 }, path: { networker: 1 }, flags: { uni_networked: true }, history: 'Активно участвовал(а) в студенческой жизни и стажировках' },
              },
              {
                text: 'Все силы — в учёбу',
                effects: { stats: { intel: 8, happy: -3, social: -3 }, path: { studious: 1, disciplined: 1 }, flags: { uni_focused: true }, history: 'Полностью сосредоточился(ась) на учёбе' },
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
            id: 'uni_session_focused',
            title: 'Сессия',
            scene: '📗',
            text: 'Дисциплина за семестр окупается — сессия проходит почти без стресса.',
            condition: (c) => c.flags.uni_focused === true,
            choices: [
              {
                text: 'Закрываешь сессию на отлично',
                effects: { stats: { intel: 5, happy: 2 }, path: { studious: 1 }, history: 'Закрыл(а) сессию на отлично' },
              },
              {
                text: 'Помогаешь другим готовиться',
                effects: { stats: { social: 4, happy: 3 }, path: { generous: 1 } },
              },
            ],
          },
          {
            id: 'uni_session_risky',
            title: 'Сессия подкрадывается',
            scene: '📕',
            text: 'Конспектов почти нет, а зачёты уже на носу — расплата за то, куда ушло внимание в семестре.',
            condition: (c) => c.flags.uni_love === true || c.flags.uni_partying === true,
            choices: [
              {
                text: 'Экстренно подтягиваешь всё за неделю',
                effects: { stats: { intel: 2, health: -3, happy: -2 }, path: { resilient: 1 }, history: 'Спасал(а) сессию в последний момент' },
              },
              {
                text: 'Заваливаешь и уходишь в пересдачу',
                effects: { stats: { intel: -3, happy: -4, money: -2 }, path: { setback: 1 }, flags: { academic_trouble: true }, history: 'Завалил(а) сессию из-за увлечений' },
              },
              {
                text: 'Выкручиваешься правдами и неправдами',
                effects: { stats: { social: 2, intel: -1 }, path: { resourceful: 1 } },
              },
            ],
          },
          {
            id: 'uni_session_practical',
            title: 'Сессия между делом',
            scene: '📘',
            text: 'Совмещать учёбу с остальным непросто, но накопленный опыт кое-где выручает.',
            condition: (c) => c.flags.uni_worked === true || c.flags.uni_networked === true,
            choices: [
              {
                text: 'Выравниваешь баланс перед зачётами',
                effects: { stats: { intel: 2, resilience: 3 }, path: { balanced: 1 } },
              },
              {
                text: 'Опыт для тебя важнее оценок',
                effects: { stats: { money: 4, independence: 3, intel: -1 }, path: { pragmatic: 1 }, history: 'Ставил(а) практический опыт выше оценок' },
              },
            ],
          },
          {
            id: 'career_start',
            title: 'Первые карьерные шаги',
            scene: '📈',
            text: 'Стажировка, повышение или осознание, что «не твоё».',
            condition: (c) => !c.flags.major,
            choices: [
              {
                text: 'Цепляешься за рост в найме',
                effects: { moneyScale: true, stats: { money: 6, intel: 2 }, path: { careerist: 1 }, flags: { career_corporate: true } },
              },
              {
                text: 'Пробуешь своё дело / фриланс',
                effects: { moneyScale: true, stats: { independence: 6, money: 2, resilience: 4 }, path: { entrepreneur_mindset: 1 }, flags: { tried_business: true } },
              },
              {
                text: 'Меняешь направление полностью',
                effects: { moneyScale: true, stats: { resilience: 5, happy: 2 }, path: { flexible: 1 }, history: 'Сменил траекторию в молодости' },
              },
            ],
          },
          {
            id: 'career_start_medicine',
            title: 'Первый год в медицине',
            scene: '🩺',
            text: 'Ординатура или первая ставка в клинике — ночные дежурства и высокая ответственность с первого дня.',
            condition: (c) => c.flags.major === 'medicine',
            choices: [
              {
                text: 'Уходишь с головой в работу',
                effects: { moneyScale: true, stats: { money: 8, intel: 3, health: -4, happy: -1 }, path: { workaholic: 1 }, flags: { profession: 'doctor' }, history: 'Начал(а) карьеру врача' },
              },
              {
                text: 'Находишь баланс между работой и собой',
                effects: { moneyScale: true, stats: { money: 5, resilience: 4, happy: 2 }, path: { balanced: 1 }, flags: { profession: 'doctor' }, history: 'Начал(а) карьеру врача, сохраняя баланс' },
              },
              {
                text: 'Понимаешь, что это не твоё, ищешь смежную нишу',
                effects: { moneyScale: true, stats: { happy: 1, independence: 3 }, path: { flexible: 1 }, flags: { profession: 'medical_adjacent' } },
              },
            ],
          },
          {
            id: 'career_start_engineering',
            title: 'Первый проект инженера',
            scene: '⚙️',
            text: 'Реальный проект с реальной ответственностью — расчёты, дедлайны, первая серьёзная ошибка.',
            condition: (c) => c.flags.major === 'engineering',
            choices: [
              {
                text: 'Растёшь техническим экспертом',
                effects: { moneyScale: true, stats: { money: 9, intel: 4 }, path: { analytical: 1, careerist: 1 }, flags: { profession: 'engineer' }, history: 'Начал(а) карьеру инженера' },
              },
              {
                text: 'Переходишь в управление проектами',
                effects: { moneyScale: true, stats: { money: 7, social: 3, independence: 2 }, path: { leader: 1 }, flags: { profession: 'engineer_manager' } },
              },
              {
                text: 'Уходишь в смежную область',
                effects: { moneyScale: true, stats: { happy: 2, resilience: 3 }, path: { flexible: 1 }, flags: { profession: 'engineer_adjacent' } },
              },
            ],
          },
          {
            id: 'career_start_it',
            title: 'Первая работа в IT',
            scene: '💻',
            text: 'Джуном берут не так охотно, как кажется на курсах, — но получилось зацепиться.',
            condition: (c) => c.flags.major === 'it',
            choices: [
              {
                text: 'Растёшь в найме до сильного специалиста',
                effects: { moneyScale: true, stats: { money: 10, intel: 3 }, path: { careerist: 1, analytical: 1 }, flags: { profession: 'engineer_it' }, history: 'Начал(а) карьеру в IT' },
              },
              {
                text: 'Уходишь во фриланс / свой продукт',
                effects: { moneyScale: true, stats: { independence: 7, money: 4, resilience: 3 }, path: { entrepreneur_mindset: 1 }, flags: { profession: 'it_freelancer', tried_business: true } },
              },
              {
                text: 'Выгораешь от гонки технологий',
                effects: { moneyScale: true, stats: { happy: -3, health: -2 }, path: { workaholic: 1 }, flags: { profession: 'engineer_it' } },
              },
            ],
          },
          {
            id: 'career_start_business',
            title: 'Первые деньги в бизнесе',
            scene: '💼',
            text: 'Диплом экономиста — это теория. Практика начинается с первой сделки или первого провала.',
            condition: (c) => c.flags.major === 'business',
            choices: [
              {
                text: 'Идёшь в найм — банк, корпорация, стабильность',
                effects: { moneyScale: true, stats: { money: 8, intel: 2 }, path: { careerist: 1 }, flags: { profession: 'corporate_finance' }, history: 'Начал(а) карьеру в корпоративных финансах' },
              },
              {
                text: 'Запускаешь своё дело сразу после вуза',
                effects: { moneyScale: true, stats: { independence: 7, money: -3, resilience: 5 }, path: { entrepreneur_mindset: 2 }, flags: { profession: 'entrepreneur', tried_business: true }, history: 'Открыл(а) первый бизнес сразу после учёбы' },
              },
              {
                text: 'Первый провал в бизнесе — но урок усвоен',
                effects: { moneyScale: true, stats: { money: -6, resilience: 5, happy: -2 }, path: { resilient: 1, debt_lesson: 1 }, flags: { profession: 'entrepreneur' } },
              },
            ],
          },
          {
            id: 'career_start_law',
            title: 'Первая практика юриста',
            scene: '⚖️',
            text: 'Стажировка в юрфирме или собственная небольшая практика — первые реальные дела.',
            condition: (c) => c.flags.major === 'law',
            choices: [
              {
                text: 'Идёшь в крупную юрфирму',
                effects: { moneyScale: true, stats: { money: 9, social: 2 }, path: { careerist: 1, principled: 1 }, flags: { profession: 'lawyer' }, history: 'Начал(а) карьеру юриста' },
              },
              {
                text: 'Открываешь частную практику',
                effects: { moneyScale: true, stats: { independence: 6, money: 3, resilience: 3 }, path: { entrepreneur_mindset: 1 }, flags: { profession: 'lawyer_private' } },
              },
              {
                text: 'Разочаровываешься в системе, уходишь в смежное',
                effects: { moneyScale: true, stats: { happy: 1, independence: 3 }, path: { flexible: 1 }, flags: { profession: 'law_adjacent' } },
              },
            ],
          },
          {
            id: 'career_start_arts',
            title: 'Первые шаги в творчестве',
            scene: '🎨',
            text: 'Диплом творческого направления редко превращается в стабильную зарплату сразу.',
            condition: (c) => c.flags.major === 'arts',
            choices: [
              {
                text: 'Находишь стабильную работу по смежной специальности',
                effects: { moneyScale: true, stats: { money: 6, happy: -1 }, path: { pragmatic: 1 }, flags: { profession: 'creative_adjacent' }, history: 'Работал(а) по смежной с творчеством специальности' },
              },
              {
                text: 'Идёшь во фриланс / собственные проекты',
                effects: { moneyScale: true, stats: { independence: 6, money: -2, happy: 5 }, path: { creative: 1, entrepreneur_mindset: 1 }, flags: { profession: 'artist' }, history: 'Стал(а) независимым творческим специалистом' },
              },
              {
                text: 'Совмещаешь подработку и творчество',
                effects: { moneyScale: true, stats: { money: 3, happy: 3, health: -2 }, path: { flexible: 1 }, flags: { profession: 'artist_side' } },
              },
            ],
          },
          {
            id: 'career_start_trade',
            title: 'Первая работа по специальности',
            scene: '🔧',
            text: 'Диплом колледжа даёт конкретный навык — и работу можно найти быстрее, чем однокурсникам из университета.',
            condition: (c) => c.flags.major === 'trade',
            choices: [
              {
                text: 'Устраиваешься по специальности, растёшь мастером',
                effects: { moneyScale: true, stats: { money: 8, independence: 2 }, path: { practical: 1, disciplined: 1 }, flags: { profession: 'tradesman' }, history: 'Начал(а) работать по специальности сразу после колледжа' },
              },
              {
                text: 'Открываешь своё небольшое дело в этой сфере',
                effects: { moneyScale: true, stats: { independence: 6, money: 4, resilience: 3 }, path: { entrepreneur_mindset: 1 }, flags: { profession: 'trade_entrepreneur', tried_business: true }, history: 'Открыл(а) своё дело по специальности' },
              },
              {
                text: 'Работа разочаровывает, ищешь другое',
                effects: { moneyScale: true, stats: { happy: -2, resilience: 2 }, path: { flexible: 1 }, flags: { profession: 'trade_adjacent' } },
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
            id: 'friendships_shift',
            title: 'Друзья расходятся по жизням',
            scene: '👋',
            text: 'Школьные и студенческие друзья разъезжаются, женятся, меняются — компания уже не та.',
            choices: [
              {
                text: 'Прикладываешь усилия удержать связь',
                effects: { stats: { social: 5, happy: 2 }, path: { loyal: 1 } },
              },
              {
                text: 'Отпускаешь старое, заводишь новых людей',
                effects: { stats: { social: 3, resilience: 3 }, path: { adaptable: 1 } },
              },
              {
                text: 'Остаёшься в одиночестве без замены',
                effects: { stats: { social: -4, happy: -3 }, path: { isolated: 1 } },
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
