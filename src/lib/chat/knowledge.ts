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
      label: "Paiement Alma",
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
        "expédition",
        "expedition",
        "france",
        "delai",
        "délai",
        "delais",
        "délais",
      ],
      answer:
        "Nous livrons en France. Les délais peuvent varier selon le produit, le stock fournisseur et la préparation de la commande. Pour un délai précis, un conseiller Tempel Outdoor peut vous recontacter.",
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
      ],
      answer:
        "Vous pouvez payer en plusieurs fois avec Alma : 2×, 3× ou 4× selon éligibilité. Le paiement est simple, sécurisé et proposé au moment de la commande ou du devis.",
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
        "coûte",
        "cout",
        "coût",
        "commande",
        "acheter",
      ],
      answer:
        "Vous pouvez demander un devis personnalisé directement depuis le site. Un conseiller Tempel Outdoor pourra vous accompagner selon le produit, les options souhaitées et votre lieu de livraison.",
    },
    {
      id: "spa",
      title: "Conseil spa",
      keywords: [
        "spa",
        "jacuzzi",
        "bain",
        "nage",
        "swim spa",
        "places",
        "jets",
        "choisir",
      ],
      answer:
        "Pour bien choisir un spa, il faut regarder le nombre de places, l’espace disponible, l’usage souhaité, détente ou nage, ainsi que les options comme les jets, la filtration et l’habillage. Si vous hésitez, un conseiller peut vous orienter vers le modèle le plus adapté.",
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
      ],
      answer:
        "Les saunas Tempel Outdoor sont pensés pour un usage bien-être haut de gamme. Le choix dépend principalement du nombre de personnes, de l’espace disponible, du type d’installation et du rendu esthétique souhaité.",
    },
    {
      id: "billard",
      title: "Billard",
      keywords: [
        "billard",
        "table",
        "convertible",
        "loisir",
        "plateau",
        "jeu",
        "baby-foot",
        "babyfoot",
      ],
      answer:
        "Tempel Outdoor propose des équipements de loisirs comme les billards, billards convertibles et baby-foot. Pour connaître les modèles disponibles, les finitions et les délais, vous pouvez demander un devis ou parler à un conseiller.",
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
      "téléphone",
      "email",
      "mail",
    ].some((keyword) => normalizedQuestion.includes(normalizeText(keyword)));
  }