import type { CategoryId } from './products'

export type Lang = 'ar' | 'en'
export const LANG_COOKIE = 'petwise-lang'
export const DEFAULT_LANG: Lang = 'ar'

const en = {
  meta: {
    home: {
      title: 'PetWise | Pet Shop in Amman',
      description:
        'PetWise is a pet shop in Amman, Jordan offering premium food, accessories, vet care and grooming for dogs, cats, birds, fish and small pets.',
    },
    shop: {
      title: 'Shop | PetWise Amman',
      description: 'Browse pet food, toys and accessories for dogs, cats, birds, fish and small pets. Order easily on WhatsApp.',
    },
    services: {
      title: 'Vet & Grooming | PetWise Amman',
      description: 'Vet check-ups, vaccinations, grooming, bathing, nail trimming, dental care and pet boarding in Amman.',
    },
    about: {
      title: 'About Us | PetWise Amman',
      description: 'The story of PetWise, a pet shop in Amman built on smart nutrition and happier pets.',
    },
    contact: {
      title: 'Contact | PetWise Amman',
      description: 'Visit PetWise on Rafaa Shammout Street, Amman. Open daily 10:00 AM to midnight. Reach us on WhatsApp.',
    },
  },
  nav: {
    home: 'Home',
    shop: 'Shop',
    services: 'Vet & Grooming',
    about: 'About',
    contact: 'Contact',
    menu: 'Open menu',
    close: 'Close menu',
    switchLang: 'Switch language',
  },
  common: {
    currency: 'JOD',
    orderWhatsapp: 'Order on WhatsApp',
    bookWhatsapp: 'Book on WhatsApp',
    viewAll: 'View all',
    viewDetails: 'View details',
    learnMore: 'Learn more',
    chatWhatsapp: 'Chat with us on WhatsApp',
    tagline: 'Smart nutrition. Happier pets.',
  },
  hero: {
    badge: 'Your neighborhood pet shop in Amman',
    title: 'Everything your pet needs, chosen with care',
    subtitle:
      'Premium food, trusted brands, cozy accessories and caring vet and grooming services, all under one roof on Rafaa Shammout Street.',
    shop: 'Shop Products',
    book: 'Book a Vet Visit',
    imageAlt: 'The PetWise shop front in Amman with shelves full of pet products',
    openDaily: 'Open daily',
    hours: '10:00 AM - 12:00 AM',
    brands: 'Official Royal Canin stockist',
  },
  categories: {
    title: 'Shop by category',
    subtitle: 'Find the right products for every kind of pet.',
    names: {
      dog: 'Dogs',
      cat: 'Cats',
      birds: 'Birds',
      fish: 'Fish',
      'small-pets': 'Small Pets',
      accessories: 'Accessories',
    } satisfies Record<CategoryId, string>,
    all: 'All',
  },
  featured: {
    title: 'Best sellers',
    subtitle: 'Pet parents in Amman love these.',
  },
  why: {
    title: 'Why PetWise',
    items: [
      { title: 'Quality products', text: 'Fresh stock and carefully selected food and supplies.' },
      { title: 'Trusted brands', text: 'Royal Canin and other brands vets recommend.' },
      { title: 'Expert advice', text: 'We help you choose the right nutrition for your pet.' },
      { title: 'Friendly service', text: 'A warm welcome for you and your pet, every day.' },
    ],
  },
  servicesPreview: {
    eyebrow: 'Vet & Grooming',
    title: 'Care that goes beyond the shelf',
    text: 'From routine check-ups and vaccinations to a full grooming session, our team keeps your pet healthy, clean and happy.',
    cta: 'Explore services',
    imageAlt: 'A groomer gently brushing a fluffy white dog',
  },
  reviews: {
    title: 'What our customers say',
    items: [
      { name: 'Lina A.', text: 'Great selection and the staff really know their stuff. They helped me pick the perfect food for my kitten.' },
      { name: 'Omar K.', text: 'My dog came back from grooming looking amazing. Clean shop, friendly people and fair prices.' },
      { name: 'Rania S.', text: 'Ordering on WhatsApp is so easy. Fast replies and everything was ready when I arrived.' },
    ],
  },
  shop: {
    title: 'Shop',
    subtitle: 'Browse our products and order directly on WhatsApp.',
    search: 'Search products...',
    searchLabel: 'Search products',
    empty: 'No products match your search.',
    results: (n: number) => `${n} ${n === 1 ? 'product' : 'products'}`,
    back: 'Back to shop',
    related: 'You may also like',
    whatsappMessage: (name: string) => `Hello PetWise, I would like to order: ${name}`,
  },
  services: {
    title: 'Vet & Grooming Services',
    subtitle: 'Gentle, professional care for your pet. Book any service on WhatsApp.',
    items: {
      checkup: { title: 'Vet check-ups', text: 'Full health examinations to keep your pet in great shape.' },
      vaccination: { title: 'Vaccinations', text: 'Essential vaccines on schedule to protect your pet.' },
      grooming: { title: 'Grooming', text: 'Haircuts and styling for a clean, comfortable coat.' },
      bathing: { title: 'Bathing', text: 'Gentle shampoo and blow-dry with pet-safe products.' },
      nails: { title: 'Nail trimming', text: 'Quick, stress-free nail care for healthy paws.' },
      dental: { title: 'Dental care', text: 'Teeth cleaning and checks for fresh breath and healthy gums.' },
      boarding: { title: 'Pet boarding', text: 'A safe, caring place for your pet while you are away.' },
    },
    whatsappMessage: (service: string) => `Hello PetWise, I would like to book: ${service}`,
  },
  appointment: {
    title: 'Request an appointment',
    subtitle: 'Fill in the details and we will confirm with you on WhatsApp.',
    name: 'Your name',
    namePlaceholder: 'e.g. Sara Ahmad',
    phone: 'Phone number',
    phonePlaceholder: '07X XXX XXXX',
    petType: 'Pet type',
    petTypePlaceholder: 'Select pet type',
    petTypes: ['Dog', 'Cat', 'Bird', 'Small pet', 'Other'],
    service: 'Service',
    servicePlaceholder: 'Select a service',
    date: 'Preferred date',
    submit: 'Send via WhatsApp',
    message: (d: { name: string; phone: string; pet: string; service: string; date: string }) =>
      `Hello PetWise, I would like to request an appointment.\nName: ${d.name}\nPhone: ${d.phone}\nPet: ${d.pet}\nService: ${d.service}\nPreferred date: ${d.date}`,
  },
  about: {
    title: 'About PetWise',
    subtitle: 'Smart nutrition. Happier pets.',
    storyTitle: 'Our story',
    story: [
      'PetWise started with a simple idea: pet parents in Amman deserve a shop they can trust. A place with quality products, honest advice and people who genuinely love animals.',
      'Today our shop on Rafaa Shammout Street is home to premium food from brands like Royal Canin, a wide range of accessories, and caring vet and grooming services, so everything your pet needs is in one place.',
    ],
    imageAlt: 'The PetWise shop front on Rafaa Shammout Street, Amman',
    valuesTitle: 'What we stand for',
    values: [
      { title: 'Care first', text: 'Every recommendation starts with what is best for your pet.' },
      { title: 'Honest advice', text: 'We guide you to the right product, not the most expensive one.' },
      { title: 'Quality always', text: 'We only stock products we would give our own pets.' },
    ],
  },
  contact: {
    title: 'Contact us',
    subtitle: 'Visit the shop, message us on WhatsApp, or send us a note below.',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    hoursTitle: 'Opening hours',
    hours: 'Every day, 10:00 AM to 12:00 AM (midnight)',
    addressTitle: 'Address',
    address: 'Petwise petshop, Rafaa Shammout Street, Amman',
    directions: 'Get directions',
    mapTitle: 'Map showing the PetWise location in Amman',
    formTitle: 'Send us a message',
    name: 'Your name',
    namePlaceholder: 'e.g. Sara Ahmad',
    phone: 'Phone number',
    phonePlaceholder: '07X XXX XXXX',
    messageLabel: 'Message',
    messagePlaceholder: 'How can we help?',
    submit: 'Send via WhatsApp',
    composed: (d: { name: string; phone: string; message: string }) =>
      `Hello PetWise,\nName: ${d.name}\nPhone: ${d.phone}\n\n${d.message}`,
  },
  footer: {
    about: 'Your trusted pet shop in Amman for premium food, accessories, vet care and grooming.',
    quickLinks: 'Quick links',
    contact: 'Contact',
    hours: 'Opening hours',
    hoursValue: 'Every day, 10:00 AM - 12:00 AM',
    follow: 'Follow us',
    rights: 'All rights reserved.',
  },
}

export type Dictionary = typeof en

const ar: Dictionary = {
  meta: {
    home: {
      title: 'PetWise | متجر حيوانات أليفة في عمّان',
      description:
        'PetWise متجر حيوانات أليفة في عمّان يقدم طعامًا فاخرًا وإكسسوارات وخدمات بيطرية وتجميل للكلاب والقطط والطيور والأسماك والحيوانات الصغيرة.',
    },
    shop: {
      title: 'المتجر | PetWise عمّان',
      description: 'تصفح طعام وألعاب وإكسسوارات الكلاب والقطط والطيور والأسماك والحيوانات الصغيرة، واطلب بسهولة عبر واتساب.',
    },
    services: {
      title: 'الخدمات البيطرية والتجميل | PetWise عمّان',
      description: 'فحوصات بيطرية، تطعيمات، تجميل، استحمام، قص أظافر، العناية بالأسنان واستضافة الحيوانات في عمّان.',
    },
    about: {
      title: 'من نحن | PetWise عمّان',
      description: 'قصة PetWise، متجر حيوانات أليفة في عمّان قائم على التغذية الذكية وحيوانات أسعد.',
    },
    contact: {
      title: 'تواصل معنا | PetWise عمّان',
      description: 'زورونا في شارع رفعة شموط، عمّان. مفتوح يوميًا من 10 صباحًا حتى منتصف الليل. تواصلوا معنا عبر واتساب.',
    },
  },
  nav: {
    home: 'الرئيسية',
    shop: 'المتجر',
    services: 'البيطرة والتجميل',
    about: 'من نحن',
    contact: 'تواصل معنا',
    menu: 'فتح القائمة',
    close: 'إغلاق القائمة',
    switchLang: 'تغيير اللغة',
  },
  common: {
    currency: 'د.أ',
    orderWhatsapp: 'اطلب عبر واتساب',
    bookWhatsapp: 'احجز عبر واتساب',
    viewAll: 'عرض الكل',
    viewDetails: 'عرض التفاصيل',
    learnMore: 'اعرف المزيد',
    chatWhatsapp: 'تحدث معنا عبر واتساب',
    tagline: 'تغذية ذكية. حيوانات أسعد.',
  },
  hero: {
    badge: 'متجر الحيوانات الأليفة في حيّك بعمّان',
    title: 'كل ما يحتاجه حيوانك الأليف، مختار بعناية',
    subtitle:
      'طعام فاخر، علامات تجارية موثوقة، إكسسوارات مريحة، وخدمات بيطرية وتجميل بكل حب، كلها تحت سقف واحد في شارع رفعة شموط.',
    shop: 'تسوق المنتجات',
    book: 'احجز زيارة بيطرية',
    imageAlt: 'واجهة متجر PetWise في عمّان مع رفوف مليئة بمنتجات الحيوانات الأليفة',
    openDaily: 'مفتوح يوميًا',
    hours: '10:00 صباحًا - 12:00 منتصف الليل',
    brands: 'موزع معتمد لـ Royal Canin',
  },
  categories: {
    title: 'تسوق حسب الفئة',
    subtitle: 'اعثر على المنتجات المناسبة لكل نوع من الحيوانات الأليفة.',
    names: {
      dog: 'الكلاب',
      cat: 'القطط',
      birds: 'الطيور',
      fish: 'الأسماك',
      'small-pets': 'الحيوانات الصغيرة',
      accessories: 'الإكسسوارات',
    },
    all: 'الكل',
  },
  featured: {
    title: 'الأكثر مبيعًا',
    subtitle: 'منتجات يحبها أصحاب الحيوانات الأليفة في عمّان.',
  },
  why: {
    title: 'لماذا PetWise',
    items: [
      { title: 'منتجات عالية الجودة', text: 'مخزون طازج وطعام ومستلزمات مختارة بعناية.' },
      { title: 'علامات تجارية موثوقة', text: 'Royal Canin وعلامات أخرى يوصي بها الأطباء البيطريون.' },
      { title: 'نصائح الخبراء', text: 'نساعدك على اختيار التغذية المناسبة لحيوانك.' },
      { title: 'خدمة ودودة', text: 'ترحيب دافئ بك وبحيوانك الأليف كل يوم.' },
    ],
  },
  servicesPreview: {
    eyebrow: 'البيطرة والتجميل',
    title: 'رعاية تتجاوز الرفوف',
    text: 'من الفحوصات الدورية والتطعيمات إلى جلسة تجميل كاملة، يحرص فريقنا على أن يبقى حيوانك صحيًا ونظيفًا وسعيدًا.',
    cta: 'استكشف الخدمات',
    imageAlt: 'مختص تجميل يمشط كلبًا أبيض كثيف الفرو بلطف',
  },
  reviews: {
    title: 'ماذا يقول عملاؤنا',
    items: [
      { name: 'لينا أ.', text: 'تشكيلة رائعة والموظفون خبراء فعلًا. ساعدوني في اختيار الطعام المثالي لقطتي الصغيرة.' },
      { name: 'عمر ك.', text: 'عاد كلبي من جلسة التجميل بمظهر رائع. متجر نظيف وأشخاص ودودون وأسعار مناسبة.' },
      { name: 'رانيا س.', text: 'الطلب عبر واتساب سهل جدًا. ردود سريعة وكان كل شيء جاهزًا عند وصولي.' },
    ],
  },
  shop: {
    title: 'المتجر',
    subtitle: 'تصفح منتجاتنا واطلب مباشرة عبر واتساب.',
    search: 'ابحث عن المنتجات...',
    searchLabel: 'البحث عن المنتجات',
    empty: 'لا توجد منتجات مطابقة لبحثك.',
    results: (n: number) => `${n} ${n === 1 ? 'منتج' : n === 2 ? 'منتجان' : n <= 10 ? 'منتجات' : 'منتجًا'}`,
    back: 'العودة إلى المتجر',
    related: 'قد يعجبك أيضًا',
    whatsappMessage: (name: string) => `مرحبًا PetWise، أرغب في طلب: ${name}`,
  },
  services: {
    title: 'الخدمات البيطرية والتجميل',
    subtitle: 'رعاية لطيفة واحترافية لحيوانك الأليف. احجز أي خدمة عبر واتساب.',
    items: {
      checkup: { title: 'الفحوصات البيطرية', text: 'فحوصات صحية شاملة ليبقى حيوانك بأفضل حال.' },
      vaccination: { title: 'التطعيمات', text: 'التطعيمات الأساسية في مواعيدها لحماية حيوانك.' },
      grooming: { title: 'التجميل', text: 'قص وتصفيف الفرو لمظهر نظيف ومريح.' },
      bathing: { title: 'الاستحمام', text: 'شامبو لطيف وتجفيف بمنتجات آمنة للحيوانات.' },
      nails: { title: 'قص الأظافر', text: 'عناية سريعة وهادئة بالأظافر لأقدام صحية.' },
      dental: { title: 'العناية بالأسنان', text: 'تنظيف وفحص الأسنان لنفَس منعش ولثة صحية.' },
      boarding: { title: 'استضافة الحيوانات', text: 'مكان آمن ومليء بالرعاية لحيوانك أثناء غيابك.' },
    },
    whatsappMessage: (service: string) => `مرحبًا PetWise، أرغب في حجز: ${service}`,
  },
  appointment: {
    title: 'اطلب موعدًا',
    subtitle: 'املأ التفاصيل وسنؤكد موعدك عبر واتساب.',
    name: 'الاسم',
    namePlaceholder: 'مثال: سارة أحمد',
    phone: 'رقم الهاتف',
    phonePlaceholder: '07X XXX XXXX',
    petType: 'نوع الحيوان',
    petTypePlaceholder: 'اختر نوع الحيوان',
    petTypes: ['كلب', 'قطة', 'طائر', 'حيوان صغير', 'أخرى'],
    service: 'الخدمة',
    servicePlaceholder: 'اختر الخدمة',
    date: 'التاريخ المفضل',
    submit: 'إرسال عبر واتساب',
    message: (d) =>
      `مرحبًا PetWise، أرغب في طلب موعد.\nالاسم: ${d.name}\nالهاتف: ${d.phone}\nالحيوان: ${d.pet}\nالخدمة: ${d.service}\nالتاريخ المفضل: ${d.date}`,
  },
  about: {
    title: 'عن PetWise',
    subtitle: 'تغذية ذكية. حيوانات أسعد.',
    storyTitle: 'قصتنا',
    story: [
      'بدأت PetWise بفكرة بسيطة: أصحاب الحيوانات الأليفة في عمّان يستحقون متجرًا يثقون به. مكان يقدم منتجات عالية الجودة ونصائح صادقة وأشخاصًا يحبون الحيوانات حقًا.',
      'اليوم يضم متجرنا في شارع رفعة شموط طعامًا فاخرًا من علامات مثل Royal Canin، وتشكيلة واسعة من الإكسسوارات، وخدمات بيطرية وتجميل بكل عناية، ليكون كل ما يحتاجه حيوانك في مكان واحد.',
    ],
    imageAlt: 'واجهة متجر PetWise في شارع رفعة شموط، عمّان',
    valuesTitle: 'ما نؤمن به',
    values: [
      { title: 'الرعاية أولًا', text: 'كل توصية تبدأ بما هو أفضل لحيوانك الأليف.' },
      { title: 'نصيحة صادقة', text: 'نرشدك إلى المنتج المناسب، وليس الأغلى.' },
      { title: 'الجودة دائمًا', text: 'لا نبيع إلا ما نقدمه لحيواناتنا الأليفة.' },
    ],
  },
  contact: {
    title: 'تواصل معنا',
    subtitle: 'زورونا في المتجر، راسلونا عبر واتساب، أو أرسلوا لنا رسالة أدناه.',
    whatsapp: 'واتساب',
    instagram: 'إنستغرام',
    facebook: 'فيسبوك',
    hoursTitle: 'ساعات العمل',
    hours: 'يوميًا من 10:00 صباحًا حتى 12:00 منتصف الليل',
    addressTitle: 'العنوان',
    address: 'بيت الحيوانات PetWise، شارع رفعة شموط، عمّان',
    directions: 'احصل على الاتجاهات',
    mapTitle: 'خريطة تُظهر موقع PetWise في عمّان',
    formTitle: 'أرسل لنا رسالة',
    name: 'الاسم',
    namePlaceholder: 'مثال: سارة أحمد',
    phone: 'رقم الهاتف',
    phonePlaceholder: '07X XXX XXXX',
    messageLabel: 'الرسالة',
    messagePlaceholder: 'كيف يمكننا مساعدتك؟',
    submit: 'إرسال عبر واتساب',
    composed: (d) => `مرحبًا PetWise،\nالاسم: ${d.name}\nالهاتف: ${d.phone}\n\n${d.message}`,
  },
  footer: {
    about: 'متجرك الموثوق للحيوانات الأليفة في عمّان للطعام الفاخر والإكسسوارات والرعاية البيطرية والتجميل.',
    quickLinks: 'روابط سريعة',
    contact: 'تواصل',
    hours: 'ساعات العمل',
    hoursValue: 'يوميًا، 10:00 صباحًا - 12:00 منتصف الليل',
    follow: 'تابعنا',
    rights: 'جميع الحقوق محفوظة.',
  },
}

export const dictionaries: Record<Lang, Dictionary> = { en, ar }

export function resolveLang(value: string | undefined): Lang {
  return value === 'en' || value === 'ar' ? value : DEFAULT_LANG
}

export function formatPrice(price: number, lang: Lang) {
  const amount = price.toFixed(2)
  return lang === 'ar' ? `${amount} د.أ` : `${amount} JOD`
}
