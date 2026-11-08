/*
 * Demo catalog for the booking system. Every price, schedule, capacity, coupon and fee
 * here is invented for the demo. Nothing is charged, and no booking leaves the browser.
 *
 * products: keyed by tour id from content.js
 *  - prices.adult / prices.child: USD per guest. Use child: null for adults-only experiences.
 *  - durationMinutes: used for the calendar file (.ics) and the experience window.
 *  - capacity: seats per time slot.
 *  - days: weekdays the experience runs, 0 = Sunday ... 6 = Saturday.
 *  - times: start times, Bahia local time (UTC-3, no daylight saving).
 */
window.SHOP = {
  currency: 'USD',
  serviceFeeRate: 0.05,

  coupons: {
    BAHIA10: { type: 'percent', value: 10, label: 'coupon.bahia10' },
    WELCOME15: { type: 'fixed', value: 15, minSubtotal: 60, label: 'coupon.welcome15' },
  },

  // Charged once per booking, not per guest.
  addons: {
    transfer: { price: 25, label: 'book.addonTransfer' },
    photo: { price: 30, label: 'book.addonPhoto' },
  },

  products: {
    'pataxo-4x4': {
      prices: { adult: 89, child: 59 },
      durationMinutes: 300,
      capacity: 12,
      days: [1, 3, 5, 6],
      times: ['08:30', '13:30'],
    },
    'jet-ski-coroa-vermelha': {
      prices: { adult: 79, child: null },
      durationMinutes: 60,
      capacity: 8,
      days: [0, 1, 2, 3, 4, 5, 6],
      times: ['09:00', '11:00', '15:00'],
    },
    'sunset-luau': {
      prices: { adult: 65, child: 35 },
      durationMinutes: 180,
      capacity: 40,
      days: [0, 2, 3, 4, 5, 6],
      times: ['17:15'],
    },
    'passarela-do-alcool': {
      prices: { adult: 30, child: 20 },
      durationMinutes: 120,
      capacity: 15,
      days: [0, 1, 2, 3, 4, 5, 6],
      times: ['18:00', '19:30'],
    },
    'arraial-dajuda': {
      prices: { adult: 120, child: 80 },
      durationMinutes: 480,
      capacity: 16,
      days: [2, 4, 6],
      times: ['08:00'],
    },
    'trancoso': {
      prices: { adult: 40, child: 25 },
      durationMinutes: 150,
      capacity: 12,
      days: [0, 1, 2, 3, 4, 5, 6],
      times: ['09:00', '16:00'],
    },
  },
};
