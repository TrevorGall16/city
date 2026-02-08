export interface FAQItem {
  question: string
  answer: string
}

export const PLACE_FAQS: Record<string, FAQItem[]> = {
  'summit-one': [
    {
      question: 'Is Summit One Vanderbilt worth the price?',
      answer:
        "Yes, absolutely. Unlike the Empire State Building, Summit One offers an immersive art experience ('Air') with mirrored floors. It is the best observation deck in NYC for photos.",
    },
    {
      question: 'Can I wear a skirt?',
      answer:
        'We strongly recommend wearing pants or shorts. The floors are mirrors, and anyone below can see up.',
    },
  ],
  'pie-and-mash': [
    {
      question: 'What is traditional Pie and Mash?',
      answer:
        "It is a historic working-class meal from East London consisting of a minced beef pie, mashed potatoes, and a green parsley sauce called 'liquor'.",
    },
    {
      question: 'Is the green sauce made of eels?',
      answer:
        'No. It is a non-alcoholic parsley sauce made with the water used to stew eels, but it tastes of herbs and vinegar, not fish.',
    },
  ],
  'pei-jie-hotpot': [
    {
      question: 'Is Pei Jie Hotpot spicy?',
      answer:
        "Yes, extremely. Even the 'mild' version has a significant kick. We recommend ordering a split pot (half spicy, half mushroom).",
    },
  ],
}
