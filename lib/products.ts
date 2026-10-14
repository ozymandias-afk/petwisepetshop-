// Edit this file to add, remove, or update products shown on the site.
// Prices are in JOD. Images live in /public/images/products.

export type CategoryId = 'dog' | 'cat' | 'birds' | 'fish' | 'small-pets' | 'accessories'

export type Localized = { ar: string; en: string }

export type Product = {
  slug: string
  category: CategoryId
  price: number
  image: string
  images?: string[]
  stock?: number
  active?: boolean
  featured?: boolean
  name: Localized
  description: Localized
}

export const categoryIds: CategoryId[] = ['dog', 'cat', 'birds', 'fish', 'small-pets', 'accessories']

export const products: Product[] = [
  {
    slug: 'premium-adult-dog-food',
    category: 'dog',
    price: 32.5,
    image: '/images/products/dog-food.png',
    featured: true,
    name: { ar: 'طعام كلاب جاف للبالغين - 10 كغ', en: 'Premium Adult Dog Food - 10kg' },
    description: {
      ar: 'تركيبة متوازنة غنية بالبروتين تدعم صحة العضلات والمفاصل ولمعان الفرو، مناسبة للكلاب البالغة من جميع السلالات.',
      en: 'A balanced, protein-rich formula that supports healthy muscles, joints and a shiny coat. Suitable for adult dogs of all breeds.',
    },
  },
  {
    slug: 'indoor-cat-food',
    category: 'cat',
    price: 18,
    image: '/images/products/cat-food.png',
    featured: true,
    name: { ar: 'طعام قطط داخلية - 4 كغ', en: 'Indoor Cat Food - 4kg' },
    description: {
      ar: 'غذاء متكامل للقطط التي تعيش داخل المنزل، يساعد على التحكم بالوزن وتقليل كرات الشعر.',
      en: 'Complete nutrition for indoor cats that helps with weight control and reduces hairballs.',
    },
  },
  {
    slug: 'cat-scratching-tree',
    category: 'cat',
    price: 45,
    image: '/images/products/cat-tree.png',
    featured: true,
    name: { ar: 'شجرة خدش للقطط', en: 'Cat Scratching Tree' },
    description: {
      ar: 'برج متعدد الطوابق مع منصات ناعمة وأعمدة خدش متينة، يمنح قطتك مكانًا للعب والراحة.',
      en: 'A multi-level tower with plush platforms and sturdy scratching posts, giving your cat a place to play and rest.',
    },
  },
  {
    slug: 'bird-cage-classic',
    category: 'birds',
    price: 38,
    image: '/images/products/bird-cage.png',
    name: { ar: 'قفص طيور كلاسيكي', en: 'Classic Bird Cage' },
    description: {
      ar: 'قفص معدني متين مع مجاثم خشبية ووعاء للطعام، مناسب للكناري والببغاوات الصغيرة.',
      en: 'A sturdy metal cage with wooden perches and a food bowl, ideal for canaries and small parrots.',
    },
  },
  {
    slug: 'starter-aquarium-kit',
    category: 'fish',
    price: 55,
    image: '/images/products/aquarium.png',
    featured: true,
    name: { ar: 'حوض أسماك متكامل للمبتدئين', en: 'Starter Aquarium Kit' },
    description: {
      ar: 'حوض زجاجي أنيق يأتي مع فلتر وإضاءة، الخيار المثالي لبدء هواية تربية الأسماك.',
      en: 'An elegant glass tank with a filter and lighting. The perfect way to start your fishkeeping hobby.',
    },
  },
  {
    slug: 'wooden-small-pet-house',
    category: 'small-pets',
    price: 14.5,
    image: '/images/products/small-pet-house.png',
    name: { ar: 'بيت خشبي للحيوانات الصغيرة', en: 'Wooden Small Pet House' },
    description: {
      ar: 'مخبأ خشبي طبيعي وآمن للهامستر والأرانب وخنازير غينيا.',
      en: 'A safe, natural wooden hideout for hamsters, rabbits and guinea pigs.',
    },
  },
  {
    slug: 'red-leash-collar-set',
    category: 'accessories',
    price: 12,
    image: '/images/products/leash.png',
    featured: true,
    name: { ar: 'طقم رسن وطوق أحمر', en: 'Red Leash & Collar Set' },
    description: {
      ar: 'رسن نايلون متين مع طوق مبطن مريح وقابل للتعديل لنزهات يومية آمنة.',
      en: 'A durable nylon leash with a comfortable, adjustable padded collar for safe daily walks.',
    },
  },
  {
    slug: 'plush-round-pet-bed',
    category: 'accessories',
    price: 28,
    image: '/images/products/pet-bed.png',
    featured: true,
    name: { ar: 'سرير دائري ناعم للحيوانات', en: 'Plush Round Pet Bed' },
    description: {
      ar: 'سرير مريح وناعم جدًا يمنح حيوانك الأليف نومًا هادئًا، قابل للغسل.',
      en: 'An extra-soft, cozy bed that gives your pet calm, restful sleep. Machine washable.',
    },
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}
