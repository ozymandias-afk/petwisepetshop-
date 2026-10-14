export const site = {
  name: 'PetWise',
  whatsappNumber: '962795606749',
  phoneDisplay: '+962 7 9560 6749',
  instagram: 'https://www.instagram.com/petwise.jo',
  facebook: 'https://web.facebook.com/people/Petwise/61594722458695/',
  mapEmbed:
    'https://www.google.com/maps?q=Petwise+petshop,+Rafaa+Shammout+Street,+Amman,+Jordan&output=embed',
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=Petwise+petshop+Rafaa+Shammout+Street+Amman',
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
