/*
 * Editable content. Every card-level text has an `en` and an `es` version.
 * Interface labels (buttons, headings, category names) live in i18n.js.
 *
 * Tours:
 *  - Prices, schedules and seats are not here: they come from shop.js.
 *  - focus: CSS object-position for the photo, e.g. "center 40%".
 *  - categories: ids from i18n.js (cat.*). Used by the filters, the hero and the tags.
 *  - highlights and bring: short lists shown in the experience window.
 *  - duration, included, meetingPoint: fill in once confirmed. Empty text shows
 *    "Confirmed before booking" instead.
 */
window.SITE = {
  brand: 'Bahia Experiences',
  contactEmail: 'socialbot114@gmail.com',

  // Categories offered as filters (the "All" filter is added automatically).
  filters: ['adventure', 'water', 'culture', 'evening', 'village', 'nature', 'music', 'crafts'],

  tours: [
    {
      id: 'pataxo-4x4',
      image: 'assets/photos/tour-4x4.webp',
      focus: 'center 20%',
      categories: ['adventure', 'nature', 'culture'],
      en: {
        category: 'Adventure · Southern Bahia',
        title: '4x4 Adventure to Pataxó Paradise',
        description: 'Explore scenic coastal trails and forest landscapes on a 4x4 adventure near Pataxó Paradise. A cultural visit can be included when arranged with local community hosts.',
        highlights: [
          'Coastal trails and forest landscapes',
          'Open-air adventure in a 4x4',
          'Optional cultural visit with local community hosts',
        ],
        bring: [
          'Sunscreen, sunglasses and a hat',
          'Closed shoes for the trails',
          'Water and a light layer for the breeze',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'Aventura · Sur de Bahía',
        title: 'Aventura en 4x4 a Pataxó Paradise',
        description: 'Recorre senderos costeros panorámicos y paisajes de bosque en una aventura en 4x4 cerca de Pataxó Paradise. Se puede incluir una visita cultural cuando se organiza con anfitriones de la comunidad local.',
        highlights: [
          'Senderos costeros y paisajes de bosque',
          'Aventura al aire libre en 4x4',
          'Visita cultural opcional con anfitriones de la comunidad local',
        ],
        bring: [
          'Protector solar, gafas de sol y sombrero',
          'Calzado cerrado para los senderos',
          'Agua y una capa ligera para la brisa',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
    {
      id: 'jet-ski-coroa-vermelha',
      image: 'assets/photos/tour-jet-ski.webp',
      focus: 'center',
      categories: ['water', 'scenic'],
      en: {
        category: 'On the water · Coroa Vermelha',
        title: 'Jet Ski at Coroa Vermelha',
        description: 'Enjoy the turquoise waters of Coroa Vermelha on a jet ski ride along Bahia’s beautiful coastline.',
        highlights: [
          'Turquoise water at Coroa Vermelha',
          'A ride along Bahia’s beautiful coastline',
          'Breeze and open views of the coast',
        ],
        bring: [
          'Swimwear and a towel',
          'Sunscreen and sunglasses',
          'A dry bag for your phone and camera',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'En el agua · Coroa Vermelha',
        title: 'Jet ski en Coroa Vermelha',
        description: 'Disfruta de las aguas turquesa de Coroa Vermelha en un paseo en jet ski por la hermosa costa de Bahía.',
        highlights: [
          'Agua turquesa en Coroa Vermelha',
          'Un paseo por la hermosa costa de Bahía',
          'Brisa y vistas abiertas de la costa',
        ],
        bring: [
          'Traje de baño y toalla',
          'Protector solar y gafas de sol',
          'Una bolsa impermeable para el teléfono y la cámara',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
    {
      id: 'sunset-luau',
      image: 'assets/photos/tour-sunset-luau.webp',
      focus: 'center 35%',
      categories: ['evening', 'music', 'scenic'],
      en: {
        category: 'Evening · Porto Seguro',
        title: 'Sunset Luau in Porto Seguro',
        description: 'Take in the sunset by the ocean and enjoy a relaxed evening with local music and the warm atmosphere of Porto Seguro.',
        highlights: [
          'Sunset by the ocean',
          'Local music and a warm atmosphere',
          'A relaxed evening in Porto Seguro',
        ],
        bring: [
          'Light layers for the evening breeze',
          'A camera for golden hour',
          'Insect repellent for the evening',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'Atardecer · Porto Seguro',
        title: 'Luau al atardecer en Porto Seguro',
        description: 'Disfruta de la puesta de sol junto al mar y de una velada relajada con música local y el cálido ambiente de Porto Seguro.',
        highlights: [
          'Puesta de sol junto al mar',
          'Música local y un ambiente cálido',
          'Una velada relajada en Porto Seguro',
        ],
        bring: [
          'Capas ligeras para la brisa de la noche',
          'Cámara para la hora dorada',
          'Repelente de insectos para la noche',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
    {
      id: 'passarela-do-alcool',
      image: 'assets/photos/tour-passarela.webp',
      focus: 'center 30%',
      categories: ['evening', 'crafts', 'culture'],
      en: {
        category: 'Evening market · Porto Seguro',
        title: 'Passarela do Álcool Evening Walk',
        description: 'Stroll through Porto Seguro’s lively evening market, known locally as Passarela do Álcool, and discover local flavors, crafts, and street life.',
        highlights: [
          'A lively evening market',
          'Local flavors and handmade crafts',
          'Street life and local atmosphere',
        ],
        bring: [
          'Comfortable shoes for walking',
          'Some cash for small purchases',
          'A camera for the market lights',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'Mercado nocturno · Porto Seguro',
        title: 'Paseo nocturno por la Passarela do Álcool',
        description: 'Recorre el animado mercado nocturno de Porto Seguro, conocido localmente como Passarela do Álcool, y descubre sabores locales, artesanías y la vida de la calle.',
        highlights: [
          'Un animado mercado nocturno',
          'Sabores locales y artesanía hecha a mano',
          'Vida de calle y ambiente local',
        ],
        bring: [
          'Calzado cómodo para caminar',
          'Algo de efectivo para compras pequeñas',
          'Una cámara para las luces del mercado',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
    {
      id: 'arraial-dajuda',
      image: 'assets/photos/tour-arraial.webp',
      focus: 'center 35%',
      categories: ['daytrip', 'village', 'scenic'],
      en: {
        category: 'Day trip · Arraial d’Ajuda',
        title: 'Arraial d’Ajuda Day Trip',
        description: 'Explore Arraial d’Ajuda’s colorful streets, tropical scenery, and laid-back coastal atmosphere with a local guide.',
        highlights: [
          'Colorful streets and tropical scenery',
          'A laid-back coastal atmosphere',
          'Local favorites, explored with a local guide',
        ],
        bring: [
          'Comfortable walking shoes',
          'Sunscreen and a hat',
          'Water for the day',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'Excursión de un día · Arraial d’Ajuda',
        title: 'Excursión de un día a Arraial d’Ajuda',
        description: 'Explora las calles de colores, los paisajes tropicales y el ambiente costero relajado de Arraial d’Ajuda con un guía local.',
        highlights: [
          'Calles de colores y paisajes tropicales',
          'Un ambiente costero relajado',
          'Lugares favoritos de la gente local, con un guía local',
        ],
        bring: [
          'Calzado cómodo para caminar',
          'Protector solar y sombrero',
          'Agua para todo el día',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
    {
      id: 'trancoso',
      image: 'assets/photos/tour-trancoso.webp',
      focus: 'center 30%',
      categories: ['village', 'history', 'culture'],
      en: {
        category: 'Village · Trancoso',
        title: 'Trancoso Village & Quadrado',
        description: 'Discover Trancoso’s famous Quadrado, its colorful houses, and the relaxed charm of this historic seaside village.',
        highlights: [
          'The famous Quadrado',
          'Colorful houses and village charm',
          'A historic seaside village',
        ],
        bring: [
          'Comfortable shoes for walking',
          'A camera for the colorful houses',
          'Sunscreen and a hat',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
      es: {
        category: 'Pueblo · Trancoso',
        title: 'Pueblo de Trancoso y el Quadrado',
        description: 'Descubre el famoso Quadrado de Trancoso, sus casas de colores y el encanto tranquilo de este histórico pueblo costero.',
        highlights: [
          'El famoso Quadrado',
          'Casas de colores y encanto de pueblo',
          'Un histórico pueblo costero',
        ],
        bring: [
          'Calzado cómodo para caminar',
          'Cámara para las casas de colores',
          'Protector solar y sombrero',
        ],
        duration: '',
        included: '',
        meetingPoint: '',
      },
    },
  ],

  // Photos for the "Life along Bahia's coast" gallery. Each caption sits under its photo.
  gallery: [
    {
      image: 'assets/photos/gallery-cafe.webp',
      en: { caption: 'Breakfast in Porto Seguro' },
      es: { caption: 'Desayuno en Porto Seguro' },
    },
    {
      image: 'assets/photos/gallery-casinha.webp',
      en: { caption: 'A green house and a smile in Trancoso' },
      es: { caption: 'Una casita verde y una sonrisa en Trancoso' },
    },
    {
      image: 'assets/photos/gallery-mercado.webp',
      en: { caption: 'Artisan market in Porto Seguro' },
      es: { caption: 'Mercado artesanal en Porto Seguro' },
    },
    {
      image: 'assets/photos/gallery-sorriso.webp',
      en: { caption: 'Smiles on the Quadrado in Trancoso' },
      es: { caption: 'Sonrisas en el Quadrado de Trancoso' },
    },
    {
      image: 'assets/photos/gallery-portal.webp',
      en: { caption: 'A visitor under a colorful gate' },
      es: { caption: 'Una visitante bajo una puerta colorida' },
    },
    {
      image: 'assets/photos/gallery-bastidores.webp',
      en: { caption: 'Behind the scenes of a shoot in Trancoso' },
      es: { caption: 'Detrás de cámaras en Trancoso' },
    },
  ],

  services: {
    guides: {
      icon: 'chat',
      en: {
        title: 'Bilingual Local Guides',
        description: 'Explore with local guides who can assist in English and Portuguese.',
        chips: ['English', 'Portuguese'],
      },
      es: {
        title: 'Guías locales bilingües',
        description: 'Explora con guías locales que pueden atenderte en inglés y portugués.',
        chips: ['Inglés', 'Portugués'],
      },
    },
    transfers: {
      icon: 'car',
      image: 'assets/photos/service-transfers.webp',
      en: {
        title: 'Premium Transfers',
        description: 'Arrange private transfers between selected stops for a smoother day of exploring.',
        imageAlt: 'A group of visitors standing beside a van',
        chips: ['Private', 'Comfortable', 'Selected stops'],
      },
      es: {
        title: 'Traslados premium',
        description: 'Organiza traslados privados entre paradas seleccionadas para un día de exploración más cómodo.',
        imageAlt: 'Un grupo de visitantes de pie junto a una van',
        chips: ['Privados', 'Cómodos', 'Paradas seleccionadas'],
      },
    },
    concierge: {
      icon: 'star',
      en: {
        title: 'Private Concierge',
        description: 'Get personalized help planning activities and coordinating details during your stay in Bahia.',
        points: ['Personalized planning', 'On-trip assistance'],
      },
      es: {
        title: 'Concierge privado',
        description: 'Recibe ayuda personalizada para planificar actividades y coordinar los detalles durante tu estancia en Bahía.',
        points: ['Planificación personalizada', 'Asistencia durante el viaje'],
      },
    },
  },

  tips: [
    {
      id: 'payments',
      icon: 'card',
      wide: true,
      en: {
        title: 'Payments & Currency',
        text: 'Pay by credit card or PIX in Brazil. Need local currency? Ask about currency exchange assistance.',
      },
      es: {
        title: 'Pagos y moneda',
        text: 'Paga con tarjeta de crédito o PIX en Brasil. ¿Necesitas moneda local? Pregunta por asistencia para el cambio de divisas.',
      },
    },
    {
      id: 'time-zone',
      icon: 'clock',
      en: {
        title: 'Time zone',
        text: 'Bahia keeps Brasília time (UTC−3) all year, with no daylight saving changes.',
      },
      es: {
        title: 'Zona horaria',
        text: 'Bahía usa la hora de Brasilia (UTC−3) todo el año, sin cambios de horario de verano.',
      },
    },
    {
      id: 'sun-water',
      icon: 'sun',
      en: {
        title: 'Sun & water',
        text: 'The sun is strong along the coast. Bring sunscreen, a hat, and water for every boat or 4x4 day.',
      },
      es: {
        title: 'Sol y agua',
        text: 'El sol es intenso en la costa. Lleva protector solar, sombrero y agua para cada día de barco o 4x4.',
      },
    },
    {
      id: 'evenings',
      icon: 'store',
      en: {
        title: 'Evenings out',
        text: 'Visit Passarela do Álcool after sunset for local flavors, crafts, and street life.',
      },
      es: {
        title: 'Noches de paseo',
        text: 'Visita la Passarela do Álcool al anochecer para probar sabores locales, artesanías y la vida de la calle.',
      },
    },
    {
      id: 'book-ahead',
      icon: 'calendar',
      en: {
        title: 'Book ahead',
        text: 'Weekends and peak season fill up fast. Reach out early to secure your favorite experience.',
      },
      es: {
        title: 'Reserva con anticipación',
        text: 'Los fines de semana y la temporada alta se llenan rápido. Escríbenos con tiempo para asegurar tu experiencia favorita.',
      },
    },
  ],
};
