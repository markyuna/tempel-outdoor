// src/lib/chat/knowledge.ts

export type ChatSuggestion = {
  label: string;
  value: string;
  action?: "message" | "contact";
};

export type KnowledgeItem = {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
};

export const chatSuggestions: ChatSuggestion[] = [
  {
    label: "Livraison",
    value: "Livrez-vous en France ?",
  },
  {
    label: "Paiement",
    value: "Puis-je payer en plusieurs fois ?",
  },
  {
    label: "Demander un devis",
    value: "Comment demander un devis ?",
  },
  {
    label: "Parler à un conseiller",
    value: "Je souhaite parler à un conseiller.",
    action: "contact",
  },
];

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: "livraison",
    title: "Livraison",
    keywords: [
      "livraison",
      "livrer",
      "livrez",
      "transport",
      "expedition",
      "expédition",
      "france",
      "delai",
      "délai",
      "delais",
      "délais",
      "when",
      "quand",
    ],
    answer:
      "Nous livrons partout en France métropolitaine. Les délais varient selon le produit et le stock fournisseur — en général entre 2 et 6 semaines. Pour un délai précis sur un modèle, n'hésitez pas à demander un devis ou à contacter un conseiller.",
  },
  {
    id: "paiement",
    title: "Paiement",
    keywords: [
      "paiement",
      "payer",
      "alma",
      "fois",
      "2x",
      "3x",
      "4x",
      "financement",
      "credit",
      "crédit",
      "mensualite",
      "mensualité",
      "facilite",
      "facilité",
      "carte",
      "virement",
    ],
    answer:
      "Vous pouvez régler en plusieurs fois avec Alma : 2×, 3× ou 4× sans frais selon éligibilité. Le paiement est sécurisé et proposé directement au moment du devis ou de la commande. Nous acceptons également les paiements par carte bancaire et virement.",
  },
  {
    id: "devis",
    title: "Devis personnalisé",
    keywords: [
      "devis",
      "prix",
      "tarif",
      "tarifs",
      "combien",
      "coute",
      "coûte",
      "cout",
      "coût",
      "commande",
      "acheter",
      "commander",
    ],
    answer:
      "Vous pouvez demander un devis personnalisé directement depuis la fiche produit ou la page Contact. Un conseiller Tempel Outdoor vous répondra rapidement avec un tarif adapté à vos options, votre lieu de livraison et vos éventuels aménagements.",
  },
  {
    id: "garantie",
    title: "Garantie & SAV",
    keywords: [
      "garantie",
      "garanti",
      "sav",
      "service",
      "apres",
      "après",
      "panne",
      "reparation",
      "réparation",
      "retour",
      "remboursement",
      "probleme",
      "problème",
      "defaut",
      "défaut",
    ],
    answer:
      "Tous nos produits bénéficient d'une garantie fabricant. En cas de panne ou de défaut, notre équipe SAV vous accompagne pour trouver la meilleure solution. Pour toute demande après-vente, contactez-nous directement et un conseiller prendra en charge votre dossier.",
  },
  {
    id: "installation",
    title: "Installation & montage",
    keywords: [
      "installation",
      "installer",
      "montage",
      "monter",
      "assembler",
      "pose",
      "poser",
      "raccordement",
      "raccorder",
      "electrique",
      "électrique",
      "eau",
      "plomberie",
      "mise en service",
    ],
    answer:
      "L'installation dépend du produit. Les spas nécessitent un raccordement électrique et une arrivée d'eau, les saunas un branchement électrique ou un conduit pour poêle à bois. Nous pouvons vous orienter vers des installateurs partenaires selon votre région. Parlez-en à un conseiller pour plus de détails.",
  },
  {
    id: "spa",
    title: "Conseil spa",
    keywords: [
      "spa",
      "jacuzzi",
      "bain",
      "nage",
      "swim",
      "places",
      "jets",
      "choisir",
      "hydromassage",
      "balnéo",
      "balneo",
      "remous",
    ],
    answer:
      "Pour bien choisir un spa, il faut considérer le nombre de places (2 à 7), l'espace disponible, l'usage souhaité (détente ou nage) et les options comme les jets, la filtration et l'habillage. Retrouvez notre sélection dans la section Bien-être > Spa. Un conseiller peut aussi vous guider vers le modèle le plus adapté.",
  },
  {
    id: "sauna",
    title: "Conseil sauna",
    keywords: [
      "sauna",
      "hammam",
      "chaleur",
      "poêle",
      "poele",
      "bois",
      "extérieur",
      "exterieur",
      "vapeur",
      "finlandais",
      "infrarouge",
      "thermowood",
    ],
    answer:
      "Nos saunas extérieurs sont disponibles de 2 à 10 places, en épicéa ou thermo-bois, avec chauffage électrique ou poêle à bois. Le choix dépend du nombre de personnes, de l'espace disponible et de l'ambiance souhaitée. Découvrez la collection dans Bien-être > Sauna.",
  },
  {
    id: "fitness",
    title: "Fitness & home gym",
    keywords: [
      "fitness",
      "sport",
      "muscu",
      "musculation",
      "gym",
      "cardio",
      "velo",
      "vélo",
      "tapis",
      "rameur",
      "haltere",
      "haltère",
      "banc",
      "home gym",
      "entrainement",
      "entraînement",
    ],
    answer:
      "Tempel Outdoor propose une sélection d'équipements fitness premium pour créer votre espace d'entraînement à domicile : cardio, musculation, cross-training et home gym haut de gamme. Retrouvez toute la collection dans la section Fitness.",
  },
  {
    id: "baby-foot",
    title: "Baby-foot extérieur",
    keywords: [
      "baby-foot",
      "babyfoot",
      "baby foot",
      "babyfoot",
      "football",
      "fussball",
    ],
    answer:
      "Nos baby-foot d'extérieur sont conçus pour résister aux intempéries, en version duo ou familiale. Idéals pour une terrasse, un jardin ou un espace loisirs. Découvrez la sélection dans Loisirs > Baby-foot.",
  },
  {
    id: "billard",
    title: "Billard convertible",
    keywords: [
      "billard",
      "convertible",
      "plateau",
      "queue",
      "billes",
      "snooker",
      "pool",
    ],
    answer:
      "Nos billards extérieurs convertibles se transforment en tables à manger de 6 à 10 couverts — un équipement premium qui allie jeu et convivialité. Disponibles dans la section Loisirs > Billard.",
  },
  {
    id: "loisirs",
    title: "Loisirs & jeux",
    keywords: [
      "loisir",
      "loisirs",
      "jeu",
      "jeux",
      "detente",
      "détente",
      "jardin",
      "terrasse",
      "exterieur",
      "extérieur",
      "outdoor",
    ],
    answer:
      "Tempel Outdoor propose plusieurs univers loisirs pour l'extérieur : baby-foot résistants aux intempéries, billards convertibles en table à manger, et équipements bien-être. N'hésitez pas à explorer le site ou à nous demander conseil.",
  },
  {
    id: "contact",
    title: "Contact conseiller",
    keywords: [
      "contact",
      "conseiller",
      "rappel",
      "appeler",
      "telephone",
      "téléphone",
      "email",
      "mail",
      "aide",
      "assistance",
      "humain",
      "personne",
    ],
    answer:
      "Bien sûr. Laissez vos coordonnées et un conseiller Tempel Outdoor vous recontactera rapidement.",
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function getChatAnswer(question: string) {
  const normalizedQuestion = normalizeText(question);

  if (!normalizedQuestion) {
    return null;
  }

  const matchedItem = knowledgeBase.find((item) =>
    item.keywords.some((keyword) =>
      normalizedQuestion.includes(normalizeText(keyword))
    )
  );

  return matchedItem?.answer ?? null;
}

export function shouldOpenContactForm(question: string) {
  const normalizedQuestion = normalizeText(question);

  return [
    "conseiller",
    "contact",
    "rappel",
    "appeler",
    "telephone",
    "email",
    "mail",
    "assistance",
    "humain",
    "personne",
  ].some((keyword) => normalizedQuestion.includes(normalizeText(keyword)));
}
