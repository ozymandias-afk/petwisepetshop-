import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vet & Grooming Services | PetWise',
  description: 'Professional pet care services including grooming, bath & trimming, deworming, and diet planning.',
}

export default function ServicesPage() {
  const services = [
    {
      id: 'grooming',
      title: { en: 'Full Grooming', ar: 'العناية الشاملة' },
      desc: { 
        en: 'Complete coat styling, sanitary trim, nail clipping, and ear cleaning tailored to your pet breed.', 
        ar: 'تصميم الفراء الكامل، القص الصحي، تقليم الأظافر، وتنظيف الأذنين المخصص لسلالة أليفك.' 
      },
      icon: '✂️'
    },
    {
      id: 'bath-trimming',
      title: { en: 'Bath & Trimming', ar: 'الحمام والقص' },
      desc: { 
        en: 'Professional shampooing, blow-drying, brushing out loose undercoat, and light trimming.', 
        ar: 'غسيل احترافي بالشامبو، التجفيف بالنفخ، تمشيط الفراء المتساقط، وقص خفيف.' 
      },
      icon: '🛁'
    },
    {
      id: 'deworming',
      title: { en: 'Deworming & Health Check', ar: 'التخلص من الديدان والفحص الصحي' },
      desc: { 
        en: 'Safe, professional administration of preventative treatments and basic wellness checks.', 
        ar: 'إعطاء العلاجات الوقائية بأمان واحترافية مع فحوصات الصحة العامة الأساسية.' 
      },
      icon: '🩺'
    },
    {
      id: 'hair-trimming',
      title: { en: 'Hair Trimming', ar: 'قص الشعر' },
      desc: { 
        en: 'Breed-specific or custom hair styling to keep your pets cool, clean, and looking their best.', 
        ar: 'تصميم شعر مخصص للحفاظ على راحة ونظافة أليفك بمظهر جذاب.' 
      },
      icon: '🐾'
    },
    {
      id: 'diet-planning',
      title: { en: 'Diet & Nutrition Planning', ar: 'تخطيط النظام الغذائي' },
      desc: { 
        en: 'Customized nutritional consultation based on your pet’s age, weight, activity level, and health needs.', 
        ar: 'استشارات غذائية مخصصة بناءً على عمر أليفك، وزنه، مستوى نشاطه وااحتياجاته الصحية.' 
      },
      icon: '🥗'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            PetWise Vet & Grooming Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Expert care designed to keep your pets happy, healthy, and looking great.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title.en} <span className="block text-lg font-medium text-gray-500 font-arabic">{service.title.ar}</span>
                </h3>
                <p className="text-gray-600 mt-4">
                  {service.desc.en}
                </p>
                <p className="text-gray-500 mt-2 text-sm font-arabic">
                  {service.desc.ar}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <a 
                  href="https://wa.me/962790000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
                >
                  Book via WhatsApp / احجز عبر واتساب
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
