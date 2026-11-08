/*
 * Editable content. Every card-level text has an `en` and an `es` version.
 * Interface labels (buttons, headings, dates) live in i18n.js.
 *
 * Tours:
 *  - price: USD per person. Keep null to show "Price on request" until prices are confirmed.
 *  - focus: CSS object-position for the photo, e.g. "center 40%".
 */
window.SITE = {
  brand: 'Bahia Experiences',
  contactEmail: 'socialbot114@gmail.com',

  tours: [
    {
      id: 'pataxo-4x4',
      image: 'assets/photos/tour-4x4.webp',
      focus: 'center 40%',
      price: null,
      en: {
        title: '4x4 Adventure to Pataxó Paradise',
        description: 'Explore scenic coastal trails and forest landscapes on a 4x4 adventure near Pataxó Paradise. A cultural visit can be included when arranged with local community hosts.',
      },
      es: {
        title: 'Aventura en 4x4 a Pataxó Paradise',
        description: 'Recorre senderos costeros panorámicos y paisajes de bosque en una aventura en 4x4 cerca de Pataxó Paradise. Se puede incluir una visita cultural cuando se organiza con anfitriones de la comunidad local.',
      },
    },
    {
      id: 'jet-ski-coroa-vermelha',
      image: 'assets/photos/tour-jet-ski.webp',
      focus: 'center',
      price: null,
      en: {
        title: 'Jet Ski at Coroa Vermelha',
        description: 'Enjoy the turquoise waters of Coroa Vermelha on a jet ski ride along Bahia’s beautiful coastline.',
      },
      es: {
        title: 'Jet ski en Coroa Vermelha',
        description: 'Disfruta de las aguas turquesa de Coroa Vermelha en un paseo en jet ski por la hermosa costa de Bahía.',
      },
    },
    {
      id: 'sunset-luau',
      image: 'assets/photos/tour-sunset-luau.webp',
      focus: 'center 35%',
      price: null,
      en: {
        title: 'Sunset Luau in Porto Seguro',
        description: 'Take in the sunset by the ocean and enjoy a relaxed evening with local music and the warm atmosphere of Porto Seguro.',
      },
      es: {
        title: 'Luau al atardecer en Porto Seguro',
        description: 'Disfruta de la puesta de sol junto al mar y de una velada relajada con música local y el cálido ambiente de Porto Seguro.',
      },
    },
    {
      id: 'passarela-do-alcool',
      image: 'assets/photos/tour-passarela.webp',
      focus: 'center 30%',
      price: null,
      en: {
        title: 'Passarela do Álcool Evening Walk',
        description: 'Stroll through Porto Seguro’s lively evening market, known locally as Passarela do Álcool, and discover local flavors, crafts, and street life.',
      },
      es: {
        title: 'Paseo nocturno por la Passarela do Álcool',
        description: 'Recorre el animado mercado nocturno de Porto Seguro, conocido localmente como Passarela do Álcool, y descubre sabores locales, artesanías y la vida de la calle.',
      },
    },
    {
      id: 'arraial-dajuda',
      image: 'assets/photos/tour-arraial.webp',
      focus: 'center 35%',
      price: null,
      en: {
        title: 'Arraial d’Ajuda Day Trip',
        description: 'Explore Arraial d’Ajuda’s colorful streets, tropical scenery, and laid-back coastal atmosphere with a local guide.',
      },
      es: {
        title: 'Excursión de un día a Arraial d’Ajuda',
        description: 'Explora las calles de colores, los paisajes tropicales y el ambiente costero relajado de Arraial d’Ajuda con un guía local.',
      },
    },
    {
      id: 'trancoso',
      image: 'assets/photos/tour-trancoso.webp',
      focus: 'center 30%',
      price: null,
      en: {
        title: 'Trancoso Village & Quadrado',
        description: 'Discover Trancoso’s famous Quadrado, its colorful houses, and the relaxed charm of this historic seaside village.',
      },
      es: {
        title: 'Pueblo de Trancoso y el Quadrado',
        description: 'Descubre el famoso Quadrado de Trancoso, sus casas de colores y el encanto tranquilo de este histórico pueblo costero.',
      },
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
