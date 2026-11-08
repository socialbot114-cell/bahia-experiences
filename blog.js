/*
 * Blog articles. Each post has an `en` and an `es` version with the same structure.
 *
 * Post fields:
 *  - slug: part of the link (#blog/slug). Lowercase words joined by hyphens, never changed once published.
 *  - category: one of the ids in `categories` below (labels come from i18n.js, blog.cat.*).
 *  - image: cover photo in assets/photos/.
 *  - en/es.title, en/es.excerpt: shown on the cards and at the top of the article.
 *  - en/es.body: list of blocks, in order:
 *      { type: 'p', text: '...' }        paragraph
 *      { type: 'h', text: '...' }        subheading
 *      { type: 'ul', items: ['...'] }    bullet list
 *
 * The reading time is calculated from the text, so you do not need to set it.
 */
window.BLOG = {
  categories: ['planning', 'practical', 'culture', 'destinations'],

  posts: [
    {
      slug: 'planning-your-first-days',
      category: 'planning',
      image: 'assets/photos/gallery-cafe.webp',
      en: {
        title: 'Planning your first days in Porto Seguro',
        excerpt: 'How to balance tours, rest days and transfers so your trip feels relaxed, not rushed.',
        body: [
          { type: 'p', text: 'Porto Seguro and the nearby villages reward a slow pace, but a little planning makes the difference between a relaxed trip and a rushed one. Start with what matters most to you, then fill the rest of the week around it.' },
          { type: 'h', text: 'Choose two or three anchor experiences' },
          { type: 'p', text: 'Pick the experiences you care about most, such as a 4x4 trail day, a sunset luau or an evening at the Passarela do Álcool. Two or three anchors give your trip shape without filling every hour.' },
          { type: 'h', text: 'Leave room between stops' },
          { type: 'p', text: 'Coastal roads and village streets take longer than they look on a map. Allow time for transfers, and keep at least one open morning for breakfast, a swim or a slow walk.' },
          { type: 'h', text: 'Book busy days early' },
          { type: 'p', text: 'Weekends and peak season fill up quickly. If you have fixed dates, reach out early so we can confirm availability, inclusions and pickup details before you travel.' },
          { type: 'h', text: 'Before you arrive' },
          { type: 'ul', items: [
            'Confirm your dates and group size',
            'Tell us your language needs',
            'Decide whether you want a transfer between stops',
            'Save our contact so you can ask questions on the road',
          ] },
        ],
      },
      es: {
        title: 'Planifica tus primeros días en Porto Seguro',
        excerpt: 'Cómo combinar paseos, días de descanso y traslados para que tu viaje sea tranquilo, no apresurado.',
        body: [
          { type: 'p', text: 'Porto Seguro y los pueblos cercanos invitan a viajar sin prisa, pero un poco de planificación marca la diferencia entre un viaje relajado y uno apresurado. Empieza por lo que más te importa y organiza el resto de la semana alrededor.' },
          { type: 'h', text: 'Elige dos o tres experiencias principales' },
          { type: 'p', text: 'Escoge las experiencias que más te interesan, como un día de senderos en 4x4, un luau al atardecer o una noche en la Passarela do Álcool. Dos o tres puntos fijos dan forma al viaje sin llenar cada hora.' },
          { type: 'h', text: 'Deja tiempo entre paradas' },
          { type: 'p', text: 'Las carreteras costeras y las calles de los pueblos tardan más de lo que parece en el mapa. Reserva tiempo para los traslados y guarda al menos una mañana libre para desayunar, nadar o caminar sin prisa.' },
          { type: 'h', text: 'Reserva los días llenos con anticipación' },
          { type: 'p', text: 'Los fines de semana y la temporada alta se llenan rápido. Si ya tienes fechas fijas, escríbenos pronto para confirmar disponibilidad, lo incluido y los detalles de recogida antes de viajar.' },
          { type: 'h', text: 'Antes de llegar' },
          { type: 'ul', items: [
            'Confirma tus fechas y el tamaño del grupo',
            'Dinos qué idioma necesitas',
            'Decide si quieres un traslado entre paradas',
            'Guarda nuestro contacto para hacer preguntas durante el viaje',
          ] },
        ],
      },
    },

    {
      slug: 'paying-in-brazil',
      category: 'practical',
      image: 'assets/photos/gallery-mercado.webp',
      en: {
        title: 'Paying in Brazil: cards, PIX and cash',
        excerpt: 'What to expect at checkout, how PIX works and when cash still makes sense.',
        body: [
          { type: 'p', text: 'The currency in Brazil is the real (BRL). Credit cards are widely accepted, and PIX, the instant payment system used across the country, is everywhere. Here is how to pay with less stress during your stay.' },
          { type: 'h', text: 'Credit cards' },
          { type: 'p', text: 'Cards work at most tour operators, restaurants and shops. Tell your bank you will travel to Brazil, and check the foreign transaction fees on your card before you go.' },
          { type: 'h', text: 'PIX' },
          { type: 'p', text: 'PIX is Brazil’s instant payment system. Many people use it for everyday purchases, and some businesses offer it at checkout. If you plan to pay that way, ask the business first.' },
          { type: 'h', text: 'Cash for small purchases' },
          { type: 'p', text: 'Keep some cash for small purchases such as crafts at an outdoor market, snacks or tips. Stalls in open-air markets are not always set up for cards.' },
          { type: 'h', text: 'Need local currency?' },
          { type: 'p', text: 'Ask us about currency exchange assistance when you plan your trip, so you arrive with what you need.' },
        ],
      },
      es: {
        title: 'Pagar en Brasil: tarjetas, PIX y efectivo',
        excerpt: 'Qué esperar al pagar, cómo funciona el PIX y cuándo el efectivo sigue siendo útil.',
        body: [
          { type: 'p', text: 'La moneda de Brasil es el real (BRL). Las tarjetas de crédito se aceptan en muchos lugares, y el PIX, el sistema de pagos instantáneos que se usa en todo el país, está por todas partes. Así puedes pagar con menos preocupaciones durante tu estancia.' },
          { type: 'h', text: 'Tarjetas de crédito' },
          { type: 'p', text: 'Las tarjetas funcionan en la mayoría de operadores de paseos, restaurantes y tiendas. Avisa a tu banco de que viajarás a Brasil y revisa las comisiones por transacciones en el extranjero antes de salir.' },
          { type: 'h', text: 'PIX' },
          { type: 'p', text: 'El PIX es el sistema de pagos instantáneos de Brasil. Mucha gente lo usa para compras diarias y algunos negocios lo ofrecen al cobrar. Si piensas pagar así, pregunta antes en el negocio.' },
          { type: 'h', text: 'Efectivo para compras pequeñas' },
          { type: 'p', text: 'Lleva algo de efectivo para compras pequeñas, como artesanías en un mercado al aire libre, un bocadillo o una propina. Los puestos de los mercados al aire libre no siempre aceptan tarjetas.' },
          { type: 'h', text: '¿Necesitas moneda local?' },
          { type: 'p', text: 'Pregúntanos por la asistencia para el cambio de moneda al planificar tu viaje, para que llegues con lo que necesitas.' },
        ],
      },
    },

    {
      slug: 'packing-for-the-bahia-coast',
      category: 'practical',
      image: 'assets/photos/gallery-bastidores.webp',
      en: {
        title: 'What to pack for the Bahia coast',
        excerpt: 'Light clothes, sun protection and shoes for trails and village streets.',
        body: [
          { type: 'p', text: 'The coast of Southern Bahia is warm and sunny for much of the year, and most days are spent outdoors. A small, well-planned bag covers almost everything.' },
          { type: 'ul', items: [
            'Sunscreen, sunglasses and a hat',
            'Swimwear and a light towel',
            'Light, breathable clothes and one layer for breezy evenings',
            'Closed shoes for 4x4 trails and comfortable shoes for village streets',
            'A dry bag for your phone and camera on the water',
            'Insect repellent for the evening',
          ] },
          { type: 'h', text: 'Protect your skin' },
          { type: 'p', text: 'Coastal sun is strong even on cloudy days. Reapply sunscreen after swimming and drink water through the day, especially on 4x4 and boat trips.' },
          { type: 'h', text: 'Keep your camera charged' },
          { type: 'p', text: 'Sunsets, colorful streets and market lights make great photos. Bring a charged phone or camera, and a power bank if you plan a long day out.' },
        ],
      },
      es: {
        title: 'Qué llevar a la costa de Bahía',
        excerpt: 'Ropa ligera, protección solar y calzado para senderos y calles de pueblo.',
        body: [
          { type: 'p', text: 'La costa del sur de Bahía es cálida y soleada gran parte del año, y la mayoría de los días se pasan al aire libre. Una bolsa pequeña y bien pensada cubre casi todo.' },
          { type: 'ul', items: [
            'Protector solar, gafas de sol y sombrero',
            'Traje de baño y una toalla ligera',
            'Ropa ligera y transpirable, y una capa para las noches con brisa',
            'Calzado cerrado para los senderos en 4x4 y calzado cómodo para las calles del pueblo',
            'Una bolsa impermeable para el teléfono y la cámara en el agua',
            'Repelente de insectos para la noche',
          ] },
          { type: 'h', text: 'Cuida tu piel' },
          { type: 'p', text: 'El sol de la costa es fuerte incluso en días nublados. Vuelve a aplicarte protector solar después de nadar y bebe agua durante el día, sobre todo en los paseos en 4x4 y en barco.' },
          { type: 'h', text: 'Ten la cámara lista' },
          { type: 'p', text: 'Los atardeceres, las calles de colores y las luces del mercado dan fotos increíbles. Lleva el teléfono o la cámara cargados y una batería portátil si vas a pasar un día largo fuera.' },
        ],
      },
    },

    {
      slug: 'visiting-pataxo-communities-respectfully',
      category: 'culture',
      image: 'assets/photos/tour-4x4.webp',
      en: {
        title: 'Visiting Pataxó communities with respect',
        excerpt: 'How cultural visits are arranged and how to be a thoughtful guest.',
        body: [
          { type: 'p', text: 'A cultural visit can be added to a 4x4 adventure near Pataxó Paradise when it is arranged with local community hosts. These visits are part of the community’s daily life, so how you prepare and behave makes a real difference.' },
          { type: 'h', text: 'Let your hosts lead' },
          { type: 'p', text: 'Follow the guidance of your hosts about where to go, what to photograph and how to behave. Their rules come from their community, not from the tour.' },
          { type: 'h', text: 'Ask before you photograph people' },
          { type: 'p', text: 'Ask before you take a photo of someone, and accept a no without pressing. Keep private and sacred places out of your pictures unless your hosts say otherwise.' },
          { type: 'h', text: 'Book the visit in advance' },
          { type: 'p', text: 'Cultural visits are arranged ahead of time with the community. Ask us about availability when you choose your 4x4 experience, and we will confirm the visit details before you book.' },
          { type: 'h', text: 'Be a good guest' },
          { type: 'ul', items: [
            'Arrive on time and say hello',
            'Listen more than you ask',
            'Respect quiet times and local rules',
            'When you buy a craft, ask about the maker and support them directly',
          ] },
        ],
      },
      es: {
        title: 'Visitar comunidades pataxó con respeto',
        excerpt: 'Cómo se organizan las visitas culturales y cómo ser un visitante atento.',
        body: [
          { type: 'p', text: 'Una visita cultural puede añadirse a una aventura en 4x4 cerca de Pataxó Paradise cuando se organiza con anfitriones de la comunidad local. Estas visitas son parte de la vida diaria de la comunidad, así que la forma en que te preparas y te comportas marca una diferencia real.' },
          { type: 'h', text: 'Deja que tus anfitriones guíen' },
          { type: 'p', text: 'Sigue las indicaciones de tus anfitriones sobre adónde ir, qué fotografiar y cómo comportarte. Sus normas vienen de su comunidad, no del paseo.' },
          { type: 'h', text: 'Pregunta antes de fotografiar a personas' },
          { type: 'p', text: 'Pide permiso antes de tomar una foto a alguien y acepta un no sin insistir. Mantén fuera de tus fotos los lugares privados y sagrados, a menos que tus anfitriones digan lo contrario.' },
          { type: 'h', text: 'Reserva la visita con anticipación' },
          { type: 'p', text: 'Las visitas culturales se organizan con tiempo junto a la comunidad. Pregúntanos por disponibilidad al elegir tu experiencia en 4x4, y confirmamos los detalles de la visita antes de que reserves.' },
          { type: 'h', text: 'Sé un buen visitante' },
          { type: 'ul', items: [
            'Llega a tiempo y saluda',
            'Escucha más de lo que preguntas',
            'Respeta los horarios de descanso y las normas locales',
            'Cuando compres una artesanía, pregunta por quien la hizo y apóyalo directamente',
          ] },
        ],
      },
    },

    {
      slug: 'walking-guide-trancoso-arraial',
      category: 'destinations',
      image: 'assets/photos/gallery-portal.webp',
      en: {
        title: 'A walking guide to Trancoso and Arraial d’Ajuda',
        excerpt: 'Colorful streets, village squares and the best times to wander.',
        body: [
          { type: 'p', text: 'Trancoso and Arraial d’Ajuda both reward slow walking. Their colorful houses, shaded streets and small shops and restaurants are best discovered on foot, at an unhurried pace.' },
          { type: 'h', text: 'Trancoso: the Quadrado and beyond' },
          { type: 'p', text: 'The Quadrado is the village’s central square and the heart of most visits. Walk around its edges to see the colorful houses, then take a few side streets to find quieter corners and local shops.' },
          { type: 'h', text: 'Arraial d’Ajuda: colorful streets' },
          { type: 'p', text: 'Arraial’s streets come alive in the middle of the day and again in the evening. Mornings are often calmer, which makes them ideal for photos and a relaxed coffee.' },
          { type: 'h', text: 'When to go' },
          { type: 'p', text: 'Go early for softer light and quieter streets, and come back at sunset when the lights come on. A local guide can point out the places you would otherwise walk past.' },
        ],
      },
      es: {
        title: 'Guía para caminar por Trancoso y Arraial d’Ajuda',
        excerpt: 'Calles de colores, plazas de pueblo y los mejores momentos para pasear.',
        body: [
          { type: 'p', text: 'Trancoso y Arraial d’Ajuda recompensan a quien camina sin prisa. Sus casas de colores, sus calles con sombra y sus tiendas y restaurantes pequeños se descubren mejor a pie.' },
          { type: 'h', text: 'Trancoso: el Quadrado y más allá' },
          { type: 'p', text: 'El Quadrado es la plaza central del pueblo y el corazón de la mayoría de las visitas. Recorre sus bordes para ver las casas de colores y luego toma algunas calles laterales para encontrar rincones más tranquilos y tiendas locales.' },
          { type: 'h', text: 'Arraial d’Ajuda: calles de colores' },
          { type: 'p', text: 'Las calles de Arraial cobran vida a mediodía y otra vez por la noche. Las mañanas suelen ser más tranquilas, ideales para fotos y un café sin prisa.' },
          { type: 'h', text: 'Cuándo ir' },
          { type: 'p', text: 'Ve temprano para una luz más suave y calles más tranquilas, y regresa al atardecer, cuando se encienden las luces. Un guía local puede señalarte lugares que de otra forma pasarías de largo.' },
        ],
      },
    },

    {
      slug: 'passarela-do-alcool-after-sunset',
      category: 'destinations',
      image: 'assets/photos/tour-passarela.webp',
      en: {
        title: 'Passarela do Álcool after sunset',
        excerpt: 'What to look for, what to bring and how to enjoy the evening market.',
        body: [
          { type: 'p', text: 'The Passarela do Álcool is Porto Seguro’s lively evening market. Stalls sell handmade crafts and local flavors, and the street fills with people as the night goes on.' },
          { type: 'h', text: 'What to look for' },
          { type: 'ul', items: [
            'Handmade crafts and jewelry',
            'Local flavors from street food stalls',
            'A lively street atmosphere',
            'Conversations with the people who make the goods',
          ] },
          { type: 'h', text: 'How to enjoy it' },
          { type: 'p', text: 'Go after sunset, walk slowly and try a few small things rather than one big meal. Bring some cash for small purchases and comfortable shoes.' },
          { type: 'h', text: 'Make it part of a bigger evening' },
          { type: 'p', text: 'Many visitors pair the market with a sunset experience or dinner nearby. Ask us to help plan the rest of your evening.' },
        ],
      },
      es: {
        title: 'La Passarela do Álcool al anochecer',
        excerpt: 'Qué buscar, qué llevar y cómo disfrutar del mercado nocturno.',
        body: [
          { type: 'p', text: 'La Passarela do Álcool es el animado mercado nocturno de Porto Seguro. Los puestos venden artesanías hechas a mano y sabores locales, y la calle se llena de gente a medida que avanza la noche.' },
          { type: 'h', text: 'Qué buscar' },
          { type: 'ul', items: [
            'Artesanías y bisutería hechas a mano',
            'Sabores locales en los puestos de comida callejera',
            'Un ambiente animado en la calle',
            'Charlas con las personas que hacen los productos',
          ] },
          { type: 'h', text: 'Cómo disfrutarlo' },
          { type: 'p', text: 'Ve después del atardecer, camina despacio y prueba algunas cosas pequeñas en vez de una comida grande. Lleva algo de efectivo para compras pequeñas y calzado cómodo.' },
          { type: 'h', text: 'Hazlo parte de una noche más completa' },
          { type: 'p', text: 'Muchos visitantes combinan el mercado con una experiencia al atardecer o una cena cerca. Pídenos que te ayudemos a planificar el resto de la noche.' },
        ],
      },
    },
  ],
};
