/* ============================================================
   VolAir Airlines — i18n (Internationalisation)
   Hebrew is the default (baked into HTML). This file provides
   English and French translations applied via data-i18n attrs.
   ============================================================ */
(function () {
  'use strict';

  // ── Translation dictionaries (EN + FR only; HE = HTML default) ──
  const TRANS = {
    en: {
      // ── Skip link ──
      'skip.link': 'Skip to main content',

      // ── Navbar ──
      'nav.home':   'Home',
      'nav.book':   'Book Flight',
      'nav.crew':   'Our Crew',
      'nav.fleet':  'Our Fleet',
      'nav.about':  'About',

      // ── Progress steps ──
      'step.search':       'Search',
      'step.results':      'Flights',
      'step.seats':        'Seats',
      'step.summary':      'Summary',
      'step.payment':      'Payment',
      'step.confirm':      'Confirmed!',

      // ── Footer ──
      'footer.booking':       'Booking',
      'footer.searchFlights': 'Search Flights',
      'footer.manageBooking': 'Manage Booking',
      'footer.company':       'Company',
      'footer.support':       'Support',
      'footer.helpCenter':    'Help Center',
      'footer.contact':       'Contact Us',
      'footer.careers':       'Careers',
      'footer.needHelp':      'Need Help?',
      'footer.copyright':     '© 2026 VolAir Airlines. All rights reserved.',
      'footer.tagline':       'Made with love ✦ Tel Aviv',
      'footer.backHome':      '→ Back to Homepage',
      'footer.brandText':     'Modern, affordable aviation connecting you to the most beautiful cities in Europe. Flying higher since 2010.',

      // ── Index ──
      'home.hero.eyebrow':    'Europe\'s most loved budget airline',
      'home.hero.h1a':        'Fly smarter.',
      'home.hero.h1b':        'Live',
      'home.hero.h1c':        'better.',
      'home.hero.slogan':     '"The sky is not the limit — it\'s your home."',
      'home.hero.cta':        'Book a Flight',
      'home.hero.cta2':       'Learn More',
      'home.brand.tagline':   'Flying you further since 2010',
      'home.dest.h2':         'Popular Destinations',
      'home.dest.sub':        'Click on a destination to start booking your next adventure',
      'home.dest.bcn.city':   'Barcelona',
      'home.dest.bcn.country':'Spain',
      'home.dest.lis.city':   'Lisbon',
      'home.dest.lis.country':'Portugal',
      'home.dest.fco.city':   'Rome',
      'home.dest.fco.country':'Italy',
      'home.dest.prg.city':   'Prague',
      'home.dest.prg.country':'Czech Republic',
      'home.why.h2':          'Why fly with us?',
      'home.why.1.h3':        'Safe & Reliable',
      'home.why.1.p':         'Our modern fleet and highly trained crew ensure every flight meets the highest safety standards in the industry.',
      'home.why.2.h3':        'Best Price Guarantee',
      'home.why.2.p':         'We offer competitive prices with no hidden fees. Found a lower price? We\'ll match it.',
      'home.why.3.h3':        'On-Time Precision',
      'home.why.3.p':         '97% on-time departures in 2024. We respect your time and do everything to keep our schedule.',

      // ── Flights page ──
      'flights.h1':            'Search Flights',
      'flights.hero.sub':      'Find the best flight for your journey',
      'flights.trip.oneway':   'One Way',
      'flights.trip.return':   'Round Trip',
      'flights.badge':         'Tel Aviv ← Europe',
      'flights.from.label':    'From',
      'flights.to.label':      'To',
      'flights.depart.label':  'Departure Date',
      'flights.return.label':  'Return Date',
      'flights.pax.h4':        'Passengers',
      'flights.pax.adults':    'Adults',
      'flights.pax.adults.sub':'Age 18+',
      'flights.pax.teens':     'Teens',
      'flights.pax.teens.sub': 'Age 12–17',
      'flights.pax.children':  'Children',
      'flights.pax.children.sub': 'Age 2–11',
      'flights.btn.search':    'Search Flights',

      // ── Results page ──
      'results.h1':                   'Available Flights',
      'results.select.h2':            'Select your flight',
      'results.btn.back':             'Back',
      'results.btn.next':             'Continue to Seat Selection',
      'results.extras.title':         'Add Extras',
      'results.extras.sub':           'Upgrade your journey',
      'results.extras.luggage.name':  'Hold Baggage',
      'results.extras.luggage.desc':  '1 × 23 kg',
      'results.extras.priority.name': 'Priority Boarding',
      'results.extras.priority.desc': 'Be first to board',
      'results.extras.drinks.name':   'Drinks Package',
      'results.extras.drinks.desc':   'Premium cocktail pack',
      'results.total':                'Estimated total',
      'results.perPax':               'per passenger · incl. taxes',
      'results.perAll':               'all passengers · incl. taxes',
      'results.paxTab':               'Passenger',
      'results.applyAll':             'Apply to all passengers',

      // ── Seats page ──
      'seats.h1':                'Seat Selection',
      'seats.hero.sub':          'Choose your perfect seat',
      'seats.steps.aria':        'Booking steps',
      'seats.map.aria':          'Seat map',
      'seats.legend.available':  'Available',
      'seats.legend.selected':   'Selected',
      'seats.legend.taken':      'Taken',
      'seats.business.label':    'Business',
      'seats.economy.label':     'Economy',
      'seats.btn.back':          'Back',
      'seats.btn.next':          'Continue to Summary',

      // ── Summary page ──
      'summary.h1':               'Booking Summary',
      'summary.hero.sub':         'Check the details before proceeding to payment',
      'summary.flight.h3':        'Flight Details',
      'summary.row.flight':       'Flight number',
      'summary.row.route':        'Route',
      'summary.row.route.val':    'Tel Aviv (TLV) ← Barcelona (BCN)',
      'summary.row.date':         'Date',
      'summary.row.seats':        'Seats',
      'summary.row.passengers':   'Passengers',
      'summary.row.extras':       'Extras',
      'summary.price.h3':         'Price Breakdown',
      'summary.base':             'Base price (all passengers)',
      'summary.extrasCost':       'Additional services',
      'summary.total':            'Total',
      'summary.contact.h3':       'Contact Details',
      'summary.email.label':      'Email Address',
      'summary.email.helper':     'E-ticket will be sent here',
      'summary.phone.label':      'Phone Number',
      'summary.phone.helper':     'For flight updates and alerts',
      'summary.btn.submit':       'Proceed to Payment',
      'summary.btn.back':         'Back to Seats',
      'summary.secure.title':     'Secure Booking',
      'summary.secure.text':      'Your information is encrypted and protected. We don\'t store card details.',
      'summary.none':             'None',

      // ── Payment page ──
      'payment.h1':              'Payment',
      'payment.hero.sub':        'Secure checkout',
      'payment.methods.label':   'Payment Method',
      'payment.card.h3':         'Credit / Debit Card',
      'payment.card.name':       'Cardholder Name',
      'payment.card.number':     'Card Number',
      'payment.card.expiry':     'Expiry Date',
      'payment.card.cvv':        'CVV',
      'payment.summary.h3':      'Booking Summary',
      'payment.summary.flight':  'Flight',
      'payment.summary.seats':   'Seats',
      'payment.summary.extras':  'Extras',
      'payment.summary.none':    'None',
      'payment.summary.total':   'Total to Pay',
      'payment.btn.back':        'Back',

      // ── Confirmation page ──
      'conf.h1':          'Booking Confirmed!',
      'conf.tagline':     'Your flight was booked successfully. Have a great trip!',
      'conf.ref.sub':     'Booking number — save it for check-in',
      'conf.details.h3':  'Your Booking Details',
      'conf.flight':      'Flight number',
      'conf.route':       'Route',
      'conf.date':        'Departure date',
      'conf.passengers':  'Passengers',
      'conf.seats':       'Selected seats',
      'conf.extras':      'Additional services',
      'conf.email':       'Confirmation email',
      'conf.total':       'Total paid',
      'conf.reminders.h4':'Important Reminders',
      'conf.remind.1':    'Online check-in opens 24 hours before the flight',
      'conf.remind.2':    'Arrive at the airport at least 2 hours before the flight',
      'conf.remind.3':    'Present a valid passport or ID',
      'conf.remind.4':    'E-ticket will be sent to your email within 10 minutes',
      'conf.btn.print':   'Print Ticket',
      'conf.btn.save':    'Save as Text',
      'conf.btn.new':     'Book Another Flight',
      'conf.step.done':   'Done!',

      // ── About page ──
      'about.h1':         'About VolAir Airlines',
      'about.hero.sub':   'Our story, mission and values that guide us every day',
      'about.story.badge':'Founded 2010',
      'about.story.h2':   'Our Story',
      'about.mission.h2': 'Mission & Vision',
      'about.values.h2':  'Our Values',
      'about.timeline.h2':'Our Journey',
      'about.cta.h2':     'Ready to fly with us?',
      'about.cta.sub':    'Join millions of passengers who choose VolAir for safe, affordable and enjoyable flights across Europe.',
      'about.cta.btn':    'Book Your Flight',

      // ── Crew page ──
      'crew.h1':          'Our Crew',
      'crew.hero.sub':    'The people who make every flight exceptional',
      'crew.join.btn':    'View Open Positions',

      // ── Fleet page ──
      'fleet.h1':         'Our Fleet',
      'fleet.hero.sub':   'Modern, efficient and comfortable — our aircraft define the VolAir experience',

      // ── Help page ──
      'help.h1':          'Help Center',
      'help.hero.sub':    'Answers to frequently asked questions — here to help at every step',
      'help.notfound.h3': 'Didn\'t find an answer?',
      'help.notfound.sub':'Our team is available 7 days a week, 08:00–22:00',
      'help.chat.btn':    'Chat with Support',

      // ── Contact page ──
      'contact.h1':          'Contact Us',
      'contact.hero.sub':    'We\'re here to help — we\'ll get back to you within an hour during business hours',
      'contact.form.h2':     'Send Us a Message',
      'contact.form.sub':    'We\'ll reply within an hour during business hours',
      'contact.name.label':  'Full Name *',
      'contact.email.label': 'Email *',
      'contact.phone.label': 'Phone',
      'contact.ref.label':   'Booking Number',
      'contact.subject.label':'Subject *',
      'contact.msg.label':   'Message *',
      'contact.btn.submit':  'Send Message',
      'contact.success.h3':  'Message Sent!',
      'contact.success.btn': 'Send Another Message',

      // ── Careers page ──
      'careers.h1':         'Join the VolAir Family',
      'careers.hero.sub':   '600+ employees who love what they do — come be one of them',
      'careers.perks.h2':   'Why VolAir?',
      'careers.perks.sub':  'We invest in our people as much as we invest in our passengers',
      'careers.jobs.h2':    'Open Positions',
      'careers.cta.h2':     'Didn\'t find what you were looking for?',
      'careers.cta.sub':    'Send us an open application and we\'ll contact you when a suitable position opens',
      'careers.cta.btn':    'Send Open Application',
      'careers.apply.h3':   'Apply Now',

      // ── Manage page ──
      'manage.h1':           'Manage Booking',
      'manage.hero.sub':     'Check flight details, online check-in and booking changes',
      'manage.form.h2':      'Find My Booking',
      'manage.form.sub':     'Enter your booking number and the email used when booking',
      'manage.ref.label':    'Booking Number',
      'manage.email.label':  'Email Address',
      'manage.btn.search':   'Find Booking',
      'manage.quick.h4':     'Quick Actions',
      'manage.checkin.btn':  'Online Check-in',
      'manage.print.btn':    'Print',

      // ── Dynamic JS strings (used by app.js via tOr()) ──
      'js.selectFlightFirst': 'Please select a flight first.',
      'js.selectSeats':       'Please select {n} seat(s) for all passengers.',
      'js.maxSeats':          'You can select up to {n} seat(s) only.',
      'js.atLeastOnePax':     'Please add at least one passenger.',
      'js.selectDeparture':   'Please select a departure date.',
      'js.emailInvalid':      'Please enter a valid email address.',
      'js.phoneRequired':     'Please enter a phone number.',
      'js.cardName':          'Please enter cardholder name.',
      'js.cardNumber':        'Please enter card number.',
      'js.cardExpiry':        'Please enter expiry date.',
      'js.cardCvv':           'Please enter CVV.',
      'js.processing':        'Processing…',
      'js.noSeats':           'No seats selected yet.',
      'js.seatsSelected':     'Selected',
      'js.passengers':        'passengers',
      'js.none':              'None',
      'js.checkinDone':       'Online check-in complete! Boarding pass sent to your email.',

      // ── VOLAIR_LABELS (flight cards) ──
      'lbl.bestValue':    'Best Value',
      'lbl.mostPopular':  'Most Popular',
      'lbl.direct':       'Direct',
      'lbl.perPassenger': 'per passenger',
      'lbl.select':       'Select',
      'lbl.selected':     'Selected ✓',
    },

    fr: {
      // ── Skip link ──
      'skip.link': 'Passer au contenu principal',

      // ── Navbar ──
      'nav.home':   'Accueil',
      'nav.book':   'Réserver',
      'nav.crew':   'Notre équipe',
      'nav.fleet':  'Notre flotte',
      'nav.about':  'À propos',

      // ── Progress steps ──
      'step.search':       'Recherche',
      'step.results':      'Vols',
      'step.seats':        'Sièges',
      'step.summary':      'Récapitulatif',
      'step.payment':      'Paiement',
      'step.confirm':      'Confirmé !',

      // ── Footer ──
      'footer.booking':       'Réservation',
      'footer.searchFlights': 'Rechercher des vols',
      'footer.manageBooking': 'Gérer ma réservation',
      'footer.company':       'Compagnie',
      'footer.support':       'Assistance',
      'footer.helpCenter':    'Centre d\'aide',
      'footer.contact':       'Contactez-nous',
      'footer.careers':       'Carrières',
      'footer.needHelp':      'Besoin d\'aide ?',
      'footer.copyright':     '© 2026 VolAir Airlines. Tous droits réservés.',
      'footer.tagline':       'Créé avec amour ✦ Tel Aviv',
      'footer.backHome':      '→ Retour à l\'accueil',
      'footer.brandText':     'Aviation moderne et abordable vous reliant aux plus belles villes d\'Europe. Voler plus haut depuis 2010.',

      // ── Index ──
      'home.hero.eyebrow':    'La compagnie aérienne low-cost préférée d\'Europe',
      'home.hero.h1a':        'Voyagez mieux.',
      'home.hero.h1b':        'Vivez',
      'home.hero.h1c':        'mieux.',
      'home.hero.slogan':     '"Le ciel n\'est pas une limite — c\'est chez vous."',
      'home.hero.cta':        'Réserver un vol',
      'home.hero.cta2':       'En savoir plus',
      'home.brand.tagline':   'Vous emmène plus loin depuis 2010',
      'home.dest.h2':         'Destinations populaires',
      'home.dest.sub':        'Cliquez sur une destination pour réserver votre prochaine aventure',
      'home.dest.bcn.city':   'Barcelone',
      'home.dest.bcn.country':'Espagne',
      'home.dest.lis.city':   'Lisbonne',
      'home.dest.lis.country':'Portugal',
      'home.dest.fco.city':   'Rome',
      'home.dest.fco.country':'Italie',
      'home.dest.prg.city':   'Prague',
      'home.dest.prg.country':'République tchèque',
      'home.why.h2':          'Pourquoi voler avec nous ?',
      'home.why.1.h3':        'Sûr et fiable',
      'home.why.1.p':         'Notre flotte moderne et notre équipage hautement qualifié garantissent que chaque vol respecte les normes de sécurité les plus élevées.',
      'home.why.2.h3':        'Garantie meilleur prix',
      'home.why.2.p':         'Nous offrons des prix compétitifs sans frais cachés. Vous avez trouvé moins cher ? Nous nous alignons.',
      'home.why.3.h3':        'Ponctualité record',
      'home.why.3.p':         '97 % de départs à l\'heure en 2024. Nous respectons votre temps et faisons tout pour tenir notre planning.',

      // ── Flights page ──
      'flights.h1':            'Rechercher des vols',
      'flights.hero.sub':      'Trouvez le meilleur vol pour votre voyage',
      'flights.trip.oneway':   'Aller simple',
      'flights.trip.return':   'Aller-retour',
      'flights.badge':         'Tel Aviv ← Europe',
      'flights.from.label':    'De',
      'flights.to.label':      'Vers',
      'flights.depart.label':  'Date de départ',
      'flights.return.label':  'Date de retour',
      'flights.pax.h4':        'Passagers',
      'flights.pax.adults':    'Adultes',
      'flights.pax.adults.sub':'18 ans et plus',
      'flights.pax.teens':     'Adolescents',
      'flights.pax.teens.sub': '12 à 17 ans',
      'flights.pax.children':  'Enfants',
      'flights.pax.children.sub': '2 à 11 ans',
      'flights.btn.search':    'Rechercher',

      // ── Results page ──
      'results.h1':                   'Vols disponibles',
      'results.select.h2':            'Choisissez votre vol',
      'results.btn.back':             'Retour',
      'results.btn.next':             'Continuer vers les sièges',
      'results.extras.title':         'Options supplémentaires',
      'results.extras.sub':           'Améliorez votre voyage',
      'results.extras.luggage.name':  'Bagage en soute',
      'results.extras.luggage.desc':  '1 × 23 kg',
      'results.extras.priority.name': 'Embarquement prioritaire',
      'results.extras.priority.desc': 'Soyez le premier à bord',
      'results.extras.drinks.name':   'Forfait boissons',
      'results.extras.drinks.desc':   'Pack cocktails premium',
      'results.total':                'Total estimé',
      'results.perPax':               'par passager · taxes incl.',
      'results.perAll':               'tous passagers · taxes incl.',
      'results.paxTab':               'Passager',
      'results.applyAll':             'Appliquer à tous',

      // ── Seats page ──
      'seats.h1':               'Sélection des sièges',
      'seats.hero.sub':         'Choisissez votre siège idéal',
      'seats.legend.available': 'Disponible',
      'seats.legend.selected':  'Sélectionné',
      'seats.legend.taken':     'Occupé',
      'seats.business.label':   'Affaires',
      'seats.economy.label':    'Économique',
      'seats.btn.back':         'Retour',
      'seats.btn.next':         'Continuer vers le récapitulatif',

      // ── Summary page ──
      'summary.h1':             'Récapitulatif de réservation',
      'summary.hero.sub':       'Vérifiez les détails avant de procéder au paiement',
      'summary.flight.h3':      'Détails du vol',
      'summary.row.flight':     'Numéro de vol',
      'summary.row.route':      'Itinéraire',
      'summary.row.route.val':  'Tel Aviv (TLV) ← Barcelone (BCN)',
      'summary.row.date':       'Date',
      'summary.row.seats':      'Sièges',
      'summary.row.passengers': 'Passagers',
      'summary.row.extras':     'Options',
      'summary.price.h3':       'Détail du prix',
      'summary.base':           'Prix de base (tous passagers)',
      'summary.extrasCost':     'Services supplémentaires',
      'summary.total':          'Total',
      'summary.contact.h3':     'Coordonnées',
      'summary.email.label':    'Adresse e-mail',
      'summary.email.helper':   'Le billet électronique sera envoyé ici',
      'summary.phone.label':    'Numéro de téléphone',
      'summary.phone.helper':   'Pour les mises à jour et alertes de vol',
      'summary.btn.submit':     'Procéder au paiement',
      'summary.btn.back':       'Retour aux sièges',
      'summary.secure.title':   'Réservation sécurisée',
      'summary.secure.text':    'Vos informations sont chiffrées et protégées. Nous ne stockons pas les données de carte.',
      'summary.none':           'Aucune',

      // ── Payment page ──
      'payment.h1':             'Paiement',
      'payment.hero.sub':       'Paiement sécurisé',
      'payment.methods.label':  'Mode de paiement',
      'payment.card.h3':        'Carte bancaire',
      'payment.card.name':      'Nom du titulaire',
      'payment.card.number':    'Numéro de carte',
      'payment.card.expiry':    'Date d\'expiration',
      'payment.card.cvv':       'CVV',
      'payment.summary.h3':     'Récapitulatif',
      'payment.summary.flight': 'Vol',
      'payment.summary.seats':  'Sièges',
      'payment.summary.extras': 'Options',
      'payment.summary.none':   'Aucune',
      'payment.summary.total':  'Total à payer',
      'payment.btn.back':       'Retour',

      // ── Confirmation page ──
      'conf.h1':          'Réservation confirmée !',
      'conf.tagline':     'Votre vol a été réservé avec succès. Bon voyage !',
      'conf.ref.sub':     'Numéro de réservation — conservez-le pour l\'enregistrement',
      'conf.details.h3':  'Vos Détails de Réservation',
      'conf.flight':      'Numéro de vol',
      'conf.route':       'Itinéraire',
      'conf.date':        'Date de départ',
      'conf.passengers':  'Passagers',
      'conf.seats':       'Sièges sélectionnés',
      'conf.extras':      'Services supplémentaires',
      'conf.email':       'E-mail de confirmation',
      'conf.total':       'Total payé',
      'conf.reminders.h4':'Rappels importants',
      'conf.remind.1':    'L\'enregistrement en ligne ouvre 24 heures avant le vol',
      'conf.remind.2':    'Arrivez à l\'aéroport au moins 2 heures avant le vol',
      'conf.remind.3':    'Présentez un passeport ou une carte d\'identité valide',
      'conf.remind.4':    'Le billet électronique sera envoyé par e-mail dans les 10 minutes',
      'conf.btn.print':   'Imprimer le billet',
      'conf.btn.save':    'Enregistrer en texte',
      'conf.btn.new':     'Réserver un autre vol',
      'conf.step.done':   'Terminé !',

      // ── About page ──
      'about.h1':         'À propos de VolAir Airlines',
      'about.hero.sub':   'Notre histoire, notre mission et les valeurs qui nous guident chaque jour',
      'about.story.badge':'Fondée en 2010',
      'about.story.h2':   'Notre histoire',
      'about.mission.h2': 'Mission et vision',
      'about.values.h2':  'Nos valeurs',
      'about.timeline.h2':'Notre parcours',
      'about.cta.h2':     'Prêt à voler avec nous ?',
      'about.cta.sub':    'Rejoignez des millions de passagers qui choisissent VolAir pour des vols sûrs, abordables et agréables à travers l\'Europe.',
      'about.cta.btn':    'Réservez votre vol',

      // ── Crew page ──
      'crew.h1':          'Notre équipe',
      'crew.hero.sub':    'Les personnes qui rendent chaque vol exceptionnel',
      'crew.join.btn':    'Voir les postes ouverts',

      // ── Fleet page ──
      'fleet.h1':         'Notre flotte',
      'fleet.hero.sub':   'Moderne, efficace et confortable — nos avions définissent l\'expérience VolAir',

      // ── Help page ──
      'help.h1':          'Centre d\'aide',
      'help.hero.sub':    'Réponses aux questions fréquentes — ici pour vous aider à chaque étape',
      'help.notfound.h3': 'Vous n\'avez pas trouvé de réponse ?',
      'help.notfound.sub':'Notre équipe est disponible 7 jours/7, de 08h00 à 22h00',
      'help.chat.btn':    'Chat avec le support',

      // ── Contact page ──
      'contact.h1':           'Contactez-nous',
      'contact.hero.sub':     'Nous sommes là pour vous aider — réponse dans l\'heure en heures ouvrées',
      'contact.form.h2':      'Envoyez-nous un message',
      'contact.form.sub':     'Réponse dans l\'heure en heures ouvrées',
      'contact.name.label':   'Nom complet *',
      'contact.email.label':  'E-mail *',
      'contact.phone.label':  'Téléphone',
      'contact.ref.label':    'Numéro de réservation',
      'contact.subject.label':'Sujet *',
      'contact.msg.label':    'Message *',
      'contact.btn.submit':   'Envoyer',
      'contact.success.h3':   'Message envoyé !',
      'contact.success.btn':  'Envoyer un autre message',

      // ── Careers page ──
      'careers.h1':        'Rejoignez la famille VolAir',
      'careers.hero.sub':  '600+ employés qui aiment ce qu\'ils font — venez en faire partie',
      'careers.perks.h2':  'Pourquoi VolAir ?',
      'careers.perks.sub': 'Nous investissons dans notre personnel autant que dans nos passagers',
      'careers.jobs.h2':   'Postes ouverts',
      'careers.cta.h2':    'Vous n\'avez pas trouvé ce que vous cherchiez ?',
      'careers.cta.sub':   'Envoyez une candidature spontanée et nous vous contacterons dès qu\'un poste s\'ouvre',
      'careers.cta.btn':   'Candidature spontanée',
      'careers.apply.h3':  'Postuler',

      // ── Manage page ──
      'manage.h1':          'Gérer ma réservation',
      'manage.hero.sub':    'Vérifiez les détails du vol, l\'enregistrement en ligne et les modifications',
      'manage.form.h2':     'Rechercher ma réservation',
      'manage.form.sub':    'Entrez votre numéro de réservation et l\'e-mail utilisé',
      'manage.ref.label':   'Numéro de réservation',
      'manage.email.label': 'Adresse e-mail',
      'manage.btn.search':  'Rechercher',
      'manage.quick.h4':    'Actions rapides',
      'manage.checkin.btn': 'Enregistrement en ligne',
      'manage.print.btn':   'Imprimer',

      // ── Dynamic JS strings ──
      'js.selectFlightFirst': 'Veuillez d\'abord sélectionner un vol.',
      'js.selectSeats':       'Veuillez sélectionner {n} siège(s) pour tous les passagers.',
      'js.maxSeats':          'Vous pouvez sélectionner au maximum {n} siège(s).',
      'js.atLeastOnePax':     'Veuillez ajouter au moins un passager.',
      'js.selectDeparture':   'Veuillez sélectionner une date de départ.',
      'js.emailInvalid':      'Veuillez entrer une adresse e-mail valide.',
      'js.phoneRequired':     'Veuillez entrer un numéro de téléphone.',
      'js.cardName':          'Veuillez entrer le nom du titulaire.',
      'js.cardNumber':        'Veuillez entrer le numéro de carte.',
      'js.cardExpiry':        'Veuillez entrer la date d\'expiration.',
      'js.cardCvv':           'Veuillez entrer le code CVV.',
      'js.processing':        'Traitement en cours…',
      'js.noSeats':           'Aucun siège sélectionné.',
      'js.seatsSelected':     'Sélectionné',
      'js.passengers':        'passagers',
      'js.none':              'Aucune',
      'js.checkinDone':       'Enregistrement terminé ! Votre carte d\'embarquement a été envoyée par e-mail.',

      // ── VOLAIR_LABELS ──
      'lbl.bestValue':    'Meilleur rapport',
      'lbl.mostPopular':  'Le plus populaire',
      'lbl.direct':       'Direct',
      'lbl.perPassenger': 'par passager',
      'lbl.select':       'Choisir',
      'lbl.selected':     'Sélectionné ✓',
    }
  };

  // ── Public helpers ──────────────────────────────────────────
  /**
   * Returns translation for key in current language,
   * or null if Hebrew (use HTML default).
   * Supports {varName} substitution.
   */
  function t(key, vars) {
    const lang = window._volairLang || 'he';
    if (lang === 'he') return null;
    let str = TRANS[lang]?.[key];
    if (str == null) return null;
    if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace('{' + k + '}', v); });
    return str;
  }

  /**
   * Apply translations to the page.
   * Called from app.js after dynamic content is generated.
   */
  function applyLang(lang) {
    const prev = window._volairLang || 'he';
    window._volairLang = lang;
    localStorage.setItem('volair-lang', lang);

    const root = document.documentElement;

    if (lang === 'he') {
      if (prev !== 'he') {
        // Reload to restore Hebrew HTML
        location.reload();
      }
      root.lang = 'he';
      root.dir  = 'rtl';
      document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === 'he'));
      return;
    }

    // LTR languages
    root.lang = lang;
    root.dir  = 'ltr';

    const D = TRANS[lang];
    if (!D) return;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = D[el.dataset.i18n];
      if (v != null) el.textContent = v;
    });

    // HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = D[el.dataset.i18nHtml];
      if (v != null) el.innerHTML = v;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = D[el.dataset.i18nPh];
      if (v != null) el.placeholder = v;
    });

    // aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = D[el.dataset.i18nAria];
      if (v != null) el.setAttribute('aria-label', v);
    });

    // Page <title> via <html data-i18n-title="key">
    const titleKey = root.dataset.i18nTitle;
    if (titleKey) { const v = D[titleKey]; if (v) document.title = v; }

    // Lang button states
    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang));
  }

  // ── Pre-DOMContentLoaded: set lang/dir immediately ──────────
  const _savedLang = localStorage.getItem('volair-lang') || 'he';
  window._volairLang = _savedLang;
  if (_savedLang !== 'he') {
    document.documentElement.lang = _savedLang;
    document.documentElement.dir  = 'ltr';
  }

  window.i18n = { t, applyLang, TRANS };
})();
