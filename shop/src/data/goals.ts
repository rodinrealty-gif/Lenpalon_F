/** Ячейки бенто «Выберите цель» на главной */
export const goals = {
  sleep: {
    title: 'Сон и стресс',
    href: '/catalog?cat=sleep',
    photo: {
      alt: '',
      placeholder: 'Фото 4:5. Прикроватная тумба вечером, тёплая лампа, баночка и стакан воды',
    },
  },
  sport: {
    title: 'Спорт и восстановление',
    text: 'Для тренировок и быстрого возвращения в форму',
    href: '/catalog?cat=sport',
    photo: { alt: '', placeholder: 'Фото 1:1. Шейкер и полотенце на скамье в зале' },
  },
  immunity: { title: 'Иммунитет', href: '/catalog?cat=immunity', icon: 'shieldplus' },
  men: { title: 'Мужское здоровье', href: '/catalog?cat=men', icon: 'male' },
} as const;
