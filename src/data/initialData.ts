import { Category, Product, RestaurantInfo, TableInfo, Coupon, Order, Review } from '../types';

export const INITIAL_RESTAURANT_INFO: RestaurantInfo = {
  name: "Thalassa · Frutos do Mar & Cozinha Caiçara",
  greekName: "Θάλασσα",
  subtitle: "Cozinha do Litoral Sul",
  tagline: "Peixes nobres e frutos do mar frescos do litoral sul, direto da pesca do dia para a sua mesa.",
  isOpen: true,
  opensAt: "11:30",
  closesAt: "23:30",
  avgPrepTime: "25 - 35 min",
  rating: 4.9,
  reviewCount: 428,
  address: "Av. Beira-Mar, 1420",
  neighborhood: "Centro",
  city: "Peruíbe - SP",
  mapsUrl: "https://maps.google.com/?q=Peruibe+SP",
  whatsapp: "5513998765432",
  phone: "(13) 3455-8900",
  instagram: "@thalassarestaurante",
  acceptedPaymentMethods: [
    "PIX Instantâneo",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Vale Refeição (VR/VA)",
    "Dinheiro",
    "Pagamento na Mesa"
  ],
  pixKey: "thalassa-peruibe@bancopix.com.br"
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: "entradas", name: "Entradas", description: "Para petiscar e compartilhar enquanto o prato principal chega", displayOrder: 1, active: true },
  { id: "peixes", name: "Peixes Frescos", description: "Pescados do dia grelhados na brasa ou assados no forno caiçara", displayOrder: 2, active: true },
  { id: "frutos-do-mar", name: "Frutos do Mar", description: "Camarões selecionados, lulas tenras, polvo e mexilhões", displayOrder: 3, active: true },
  { id: "pratos-principais", name: "Pratos Principais", description: "Moquecas tradicionais e clássicos da gastronomia litorânea", displayOrder: 4, active: true },
  { id: "massas", name: "Massas & Risotos", description: "Massas frescas artesanais e risotos cremosos com sabor de maré", displayOrder: 5, active: true },
  { id: "carnes", name: "Carnes Nobres", description: "Cortes selecionados na brasa para quem prefere carne vermelha", displayOrder: 6, active: true },
  { id: "hamburgueres", name: "Hambúrgueres Artesanais", description: "Blends nobres de picanha e fraldinha, e opções com camarão empanado", displayOrder: 7, active: true },
  { id: "pizzas", name: "Pizzas no Forno a Lenha", description: "Fermentação natural de 48h com ingredientes frescos da praia", displayOrder: 8, active: true },
  { id: "sobremesas", name: "Sobremesas Artesanais", description: "Doces caiçaras clássicos e criações contemporâneas", displayOrder: 9, active: true },
  { id: "bebidas", name: "Bebidas & Sucos", description: "Água de coco gelada, sucos da fruta e refrigerantes", displayOrder: 10, active: true },
  { id: "coqueteis", name: "Coquetéis da Casa", description: "Caipirinhas de cachaça artesanal e drinks autorais refrescantes", displayOrder: 11, active: true },
  { id: "combos", name: "Combos & Promoções", description: "Experiências completas com entrada, prato e sobremesa para até 4 pessoas", displayOrder: 12, active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Entradas
  {
    id: "prod-1",
    categoryId: "entradas",
    name: "Casquinha de Siri Especial",
    description: "Carne de siri pura desfiada e temperada com azeite de dendê, leite de coco e especiarias caiçaras. Gratinada com queijo parmesão e servida na casca com limão cravo.",
    price: 32.0,
    promoPrice: 28.0,
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 15,
    tags: ["Mais pedido", "Promoção"],
    ingredients: ["Carne de siri pura", "Azeite de dendê", "Leite de coco", "Pimentão vermelho", "Alho", "Coentro fresco", "Parmesão ralado"],
    allergens: ["Crustáceos", "Lactose"],
    servesCount: 1,
    optionGroups: [
      {
        id: "siri-pimenta",
        name: "Nível de Pimenta",
        type: "single",
        required: true,
        options: [
          { id: "p0", name: "Sem Pimenta (Suave)", price: 0 },
          { id: "p1", name: "Pimenta Suave Caiçara", price: 0 },
          { id: "p2", name: "Bem Apimentado (Dedo-de-moça)", price: 0 }
        ]
      },
      {
        id: "siri-extras",
        name: "Adicionais para a Casquinha",
        type: "multiple",
        required: false,
        max: 2,
        options: [
          { id: "ex-queijo", name: "Parmesão Gratinado Extra", price: 5.0 },
          { id: "ex-farofa", name: "Farofinha de Dendê Crocante", price: 4.0 }
        ]
      }
    ]
  },
  {
    id: "prod-2",
    categoryId: "entradas",
    name: "Bolinho de Bacalhau da Taberna (6 un)",
    description: "Seis unidades artesanais crocantes por fora e aveludados por dentro, preparados com legítimo bacalhau Gadus Morhua e batata asterix. Acompanha maionese de ervas frescas da horta.",
    price: 44.0,
    imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 15,
    tags: ["Mais pedido"],
    ingredients: ["Bacalhau Gadus Morhua", "Batata asterix", "Azeite extravirgem", "Alho dourado", "Salsinha fresca", "Maionese de ervas"],
    allergens: ["Peixes", "Ovos"],
    servesCount: 2,
    optionGroups: [
      {
        id: "molho-bacalhau",
        name: "Molho Acompanhante",
        type: "single",
        required: true,
        options: [
          { id: "m-ervas", name: "Maionese de Ervas Frescas", price: 0 },
          { id: "m-tartaro", name: "Molho Tártaro da Casa", price: 0 },
          { id: "m-pimenta", name: "Geléia de Pimenta Biquinho", price: 3.0 }
        ]
      }
    ]
  },
  {
    id: "prod-3",
    categoryId: "entradas",
    name: "Isca de Pescada Branca Crocante",
    description: "Tiras suculentas de pescada branca fresca empanadas em crosta crocante de panko temperado com limão siciliano. Acompanha molho tártaro artesanal e gomos de limão.",
    price: 48.0,
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 18,
    tags: ["Mais pedido"],
    ingredients: ["Filé de pescada branca fresca", "Farinha Panko", "Limão siciliano", "Molho tártaro caseiro", "Cebolinha"],
    allergens: ["Peixes", "Glúten", "Ovos"],
    servesCount: 2
  },
  {
    id: "prod-4",
    categoryId: "entradas",
    name: "Salada Caiçara de Palmito Pupunha e Manga",
    description: "Palmito pupunha fresco assado na brasa com lâminas de manga espada, folhas nobres da horta, tomate cereja confitado e castanha-de-caju crocante ao vinagrete de maracujá.",
    price: 38.0,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 12,
    tags: ["Vegetariano", "Vegano", "Sem glúten", "Sem lactose"],
    ingredients: ["Palmito pupunha fresco", "Manga espada madura", "Folhas nobres", "Tomate cereja confitado", "Castanha-de-caju tostada", "Vinagrete de maracujá"],
    allergens: ["Castanhas"],
    servesCount: 2
  },

  // 2. Peixes Frescos
  {
    id: "prod-5",
    categoryId: "peixes",
    name: "Robalo Grelhado na Brasa com Arroz de Limão",
    description: "Generoso filé de robalo fresco grelhado lentamente na brasa de carvão com azeite de alecrim. Acompanha legumes salteados na manteiga clarified e nosso famoso arroz aromático de limão siciliano.",
    price: 94.0,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 25,
    tags: ["Mais pedido", "Sem glúten"],
    ingredients: ["Filé alto de robalo fresco", "Azeite de alecrim", "Arroz aromático", "Raspas de limão siciliano", "Abobrinha grelhada", "Cenoura baby"],
    allergens: ["Peixes", "Lactose"],
    servesCount: 1,
    optionGroups: [
      {
        id: "ponto-peixe",
        name: "Ponto do Peixe",
        type: "single",
        required: true,
        options: [
          { id: "peixe-suave", name: "Ao Ponto (Suculento e Macio)", price: 0 },
          { id: "peixe-bem", name: "Mais Grelhado (Crosta Dourada)", price: 0 }
        ]
      },
      {
        id: "acompanhamento-extra",
        name: "Turbine seu prato (Opcional)",
        type: "multiple",
        required: false,
        max: 2,
        options: [
          { id: "pirao", name: "Porção Extra de Pirão Caiçara", price: 12.0 },
          { id: "farofa-banana", name: "Farofa de Banana da Terra", price: 10.0 }
        ]
      }
    ]
  },
  {
    id: "prod-6",
    categoryId: "peixes",
    name: "Tainha Recheada na Brasa (Para 3 pessoas)",
    description: "Tainha inteira fresca assada na brasa de lenha nobre, recheada com farofa úmida de banana-da-terra e camarão seco. Acompanha arroz branco soltinho, pirão de peixe e vinagrete da praia.",
    price: 178.0,
    promoPrice: 165.0,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 35,
    tags: ["Promoção", "Mais pedido"],
    ingredients: ["Tainha inteira fresca", "Banana-da-terra", "Camarão seco defumado", "Farinha de mandioca de Morretes", "Pirão caiçara", "Vinagrete"],
    allergens: ["Peixes", "Crustáceos"],
    servesCount: 3
  },
  {
    id: "prod-7",
    categoryId: "peixes",
    name: "Salmão Grelhado com Crosta de Ervas",
    description: "Filé de salmão fresco grelhado com crosta crocante de amêndoas e ervas mediterrâneas, servido sobre mousseline de mandioquinha e aspargos salteados.",
    price: 86.0,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 22,
    tags: ["Novo", "Sem glúten"],
    ingredients: ["Filé de salmão", "Lâminas de amêndoas", "Mousseline de mandioquinha", "Aspargos frescos", "Azeite extravirgem"],
    allergens: ["Peixes", "Castanhas", "Lactose"],
    servesCount: 1
  },

  // 3. Frutos do Mar
  {
    id: "prod-8",
    categoryId: "frutos-do-mar",
    name: "Camarão na Moranga Tradicional",
    description: "O maior clássico do restaurante! Camarões médios e grandes refogados em azeite de oliva e alho, envoltos em creme especial de requeijão catupiry original, servidos dentro da abóbora moranga inteira assada com arroz branco e batata palha artesanal.",
    price: 139.0,
    promoPrice: 124.0,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 30,
    tags: ["Mais pedido", "Promoção"],
    ingredients: ["Camarões rosa selecionados", "Abóbora moranga fresca", "Requeijão Catupiry legítimo", "Creme de leite fresco", "Tomate cereja", "Arroz branco"],
    allergens: ["Crustáceos", "Lactose"],
    servesCount: 2,
    optionGroups: [
      {
        id: "camarao-tamanho",
        name: "Porção de Camarão",
        type: "single",
        required: true,
        options: [
          { id: "cam-padrao", name: "Porção Tradicional (Serve 2 pessoas)", price: 0 },
          { id: "cam-extra", name: "Porção Família com Camarões GG Extra (+R$ 45,00)", price: 45.0 }
        ]
      }
    ]
  },
  {
    id: "prod-9",
    categoryId: "frutos-do-mar",
    name: "Polvo Grelhado à Moda Thalassa",
    description: "Tentáculos macios e crocantes de polvo grelhados no azeite extravirgem com dentes de alho dourados, páprica defumada espanhola e batatas ao murro assadas na brasa com alecrim.",
    price: 138.0,
    imageUrl: "https://images.unsplash.com/photo-1533745848184-3db07256e163?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 28,
    tags: ["Mais pedido", "Sem glúten", "Sem lactose"],
    ingredients: ["Polvo fresco do litoral", "Azeite extravirgem", "Alho confit", "Batatas ao murro", "Páprica doce e picante", "Sal marinho defumado"],
    allergens: ["Moluscos"],
    servesCount: 1
  },
  {
    id: "prod-10",
    categoryId: "frutos-do-mar",
    name: "Lulas Crocantes à Dorê com Molho Tártaro",
    description: "Anéis de lula fresca tenra marinados com limão e salpicados com farinha de trigo temperada, fritos até ficarem dourados e crocantes. Acompanha nosso tártaro caseiro cremoso.",
    price: 76.0,
    imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 18,
    tags: ["Mais pedido"],
    ingredients: ["Lula fresca", "Farinha de trigo selecionada", "Molho tártaro caseiro", "Limão taiti", "Pimenta-do-reino"],
    allergens: ["Moluscos", "Glúten", "Ovos"],
    servesCount: 2
  },

  // 4. Pratos Principais (Moquecas & Grelhados)
  {
    id: "prod-11",
    categoryId: "pratos-principais",
    name: "Moqueca Caiçara Mista de Peixe & Camarão (2 pessoas)",
    description: "Cozida lentamente na tradicional panela de barro capixaba com robalo fresco em postas, camarões selecionados, azeite de dendê da Bahia, leite de coco artesanal, tomate, cebola e pimentões coloridos. Acompanha arroz branco, pirão bem aveludado e farofa de dendê.",
    price: 168.0,
    promoPrice: 154.0,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 30,
    tags: ["Mais pedido", "Promoção", "Sem glúten", "Sem lactose"],
    ingredients: ["Robalo fresco em postas", "Camarões limpos", "Azeite de dendê", "Leite de coco artesanal", "Pimentão verde, amarelo e vermelho", "Coentro fresco", "Pirão"],
    allergens: ["Peixes", "Crustáceos"],
    servesCount: 2,
    optionGroups: [
      {
        id: "moqueca-coentro",
        name: "Opção de Coentro",
        type: "single",
        required: true,
        options: [
          { id: "c-trad", name: "Coentro Tradicional Caiçara", price: 0 },
          { id: "c-sem", name: "Sem Coentro (Apenas Salsinha)", price: 0 }
        ]
      },
      {
        id: "moqueca-pimenta",
        name: "Intensidade da Pimenta",
        type: "single",
        required: true,
        options: [
          { id: "p-leve", name: "Suave / Criança pode comer", price: 0 },
          { id: "p-media", name: "Picância Média Tradicional", price: 0 },
          { id: "p-forte", name: "Pimenta Caiçara Forte", price: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-12",
    categoryId: "pratos-principais",
    name: "Moqueca Vegana de Banana-da-Terra e Palmito",
    description: "Versão 100% vegetal com rodelas douradas de banana-da-terra, palmito pupunha fresco da Mata Atlântica e cogumelos shimeji frescos cozidos em leite de coco e especiarias. Acompanha arroz e farofa de castanhas.",
    price: 88.0,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 22,
    tags: ["Vegetariano", "Vegano", "Sem glúten", "Sem lactose"],
    ingredients: ["Banana-da-terra", "Palmito pupunha", "Cogumelos shimeji", "Leite de coco", "Pimentões coloridos", "Farofa de castanhas"],
    allergens: ["Castanhas"],
    servesCount: 2
  },

  // 5. Massas & Risotos
  {
    id: "prod-13",
    categoryId: "massas",
    name: "Risoto de Camarão Rosa & Limão Siciliano",
    description: "Arroz italiano Arbóreo de grão nobre amanteigado com vinho branco seco, caldo caseiro de frutos do mar, camarões rosa salteados e raspas frescas de limão siciliano.",
    price: 89.0,
    imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 25,
    tags: ["Mais pedido", "Sem glúten"],
    ingredients: ["Arroz arbóreo italiano", "Camarão rosa", "Vinho branco seco", "Limão siciliano", "Queijo Grana Padano", "Manteiga"],
    allergens: ["Crustáceos", "Lactose"],
    servesCount: 1
  },
  {
    id: "prod-14",
    categoryId: "massas",
    name: "Espaguete Artesanal Frutos do Mar",
    description: "Massa fresca caseira envolvida em molho de tomate pelado San Marzano, camarões médios, anéis de lula tenra e mexilhões frescos perfumados com vinho branco e manjericão fresco.",
    price: 96.0,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 22,
    tags: ["Mais pedido"],
    ingredients: ["Espaguete fresco", "Tomate San Marzano", "Camarão", "Lula", "Mexilhões", "Alho", "Manjericão fresco"],
    allergens: ["Crustáceos", "Moluscos", "Glúten", "Ovos"],
    servesCount: 1
  },
  {
    id: "prod-15",
    categoryId: "massas",
    name: "Risoto de Cogumelos e Azeite Trufado",
    description: "Mix generoso de cogumelos frescos (Paris, Shimeji e Portobello) salteados com ervas frescas, finalizado com queijo parmesão maturado e gotas de azeite trufado aromático.",
    price: 74.0,
    imageUrl: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 22,
    tags: ["Vegetariano", "Sem glúten"],
    ingredients: ["Arroz arbóreo", "Cogumelos frescos", "Azeite trufado", "Parmesão maturado", "Cebola roxa", "Vinho branco"],
    allergens: ["Lactose"],
    servesCount: 1
  },

  // 6. Carnes Nobres
  {
    id: "prod-16",
    categoryId: "carnes",
    name: "Picanha Grelhada na Brasa (2 pessoas)",
    description: "600 g de picanha nobre de novilho precoce fatiada na tábua de madeira rústica, acompanhada de arroz biro-biro com bacon crocante, batatas rústicas fritas, farofa de alho e vinagrete.",
    price: 158.0,
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 28,
    tags: ["Mais pedido"],
    ingredients: ["Picanha nobre 600g", "Sal grosso marinho", "Arroz biro-biro", "Batata rústica", "Farofa de alho", "Vinagrete"],
    allergens: ["Lactose"],
    servesCount: 2,
    optionGroups: [
      {
        id: "ponto-picanha",
        name: "Ponto da Picanha",
        type: "single",
        required: true,
        options: [
          { id: "carne-mal", name: "Mal Passada (Vermelha e Suculenta)", price: 0 },
          { id: "carne-ponto", name: "Ao Ponto para Mal Passada (Rosada)", price: 0 },
          { id: "carne-ponto-mais", name: "Ao Ponto (Centro Rosado)", price: 0 },
          { id: "carne-bem", name: "Bem Passada", price: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-17",
    categoryId: "carnes",
    name: "Filé Mignon ao Molho Madeira e Champignon",
    description: "Medalhões altos de filé mignon grelhados com redução clássica de vinho Madeira, cogumelos champignon frescos laminados e arroz cremoso de queijo brie.",
    price: 92.0,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 25,
    tags: ["Novo"],
    ingredients: ["Filé mignon", "Vinho Madeira", "Champignon fresco", "Queijo brie", "Arroz cremoso"],
    allergens: ["Lactose"],
    servesCount: 1
  },

  // 7. Hambúrgueres Artesanais
  {
    id: "prod-18",
    categoryId: "hamburgueres",
    name: "Burger Thalassa Costeiro (Picanha & Camarão)",
    description: "Nosso burger assinatura! 180g de blend de picanha na brasa, camarões salteados no azeite de alho, queijo monterey jack derretido, maionese artesanal de limão cravo e rúcula fresca no pão brioche amanteigado.",
    price: 52.0,
    promoPrice: 47.0,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 20,
    tags: ["Mais pedido", "Promoção"],
    ingredients: ["Blend picanha 180g", "Camarões rosa", "Pão brioche tostado", "Queijo Monterey Jack", "Maionese de limão cravo", "Rúcula"],
    allergens: ["Crustáceos", "Glúten", "Lactose", "Ovos"],
    servesCount: 1,
    optionGroups: [
      {
        id: "burger-ponto",
        name: "Ponto da Carne",
        type: "single",
        required: true,
        options: [
          { id: "b-mal", name: "Mal Passado (Carne bem vermelha)", price: 0 },
          { id: "b-ponto", name: "Ao Ponto (Centro rosado e suculento)", price: 0 },
          { id: "b-bem", name: "Bem Passado", price: 0 }
        ]
      },
      {
        id: "burger-pao",
        name: "Tipo de Pão",
        type: "single",
        required: true,
        options: [
          { id: "pao-brioche", name: "Pão Brioche Tradicional Amanteigado", price: 0 },
          { id: "pao-australiano", name: "Pão Australiano com Toque de Mel", price: 2.0 },
          { id: "pao-gergelim", name: "Pão com Gergelim Tostado", price: 0 }
        ]
      },
      {
        id: "burger-adicionais",
        name: "Adicionais Especiais",
        type: "multiple",
        required: false,
        max: 4,
        options: [
          { id: "add-queijo", name: "Queijo Cheddar Inglês Extra", price: 6.0 },
          { id: "add-bacon", name: "Bacon Artesanal Crocante Fatiado", price: 7.0 },
          { id: "add-camarao", name: "Camarões Salteados Extra (+3 un)", price: 14.0 },
          { id: "add-batata", name: "Acompanhamento: Batata Rústica", price: 12.0 }
        ]
      }
    ]
  },
  {
    id: "prod-19",
    categoryId: "hamburgueres",
    name: "Burger Artesanal Bacon & Queijo Canastra",
    description: "180g de hambúrguer grelhado na brasa de carvão, generosa camada de queijo meia cura da Serra da Canastra derretido, tiras de bacon crocante, cebola caramelizada e maionese defumada no pão brioche.",
    price: 45.0,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 20,
    tags: ["Mais pedido"],
    ingredients: ["Blend bovino 180g", "Queijo Canastra", "Bacon crocante", "Cebola caramelizada", "Maionese defumada", "Pão brioche"],
    allergens: ["Glúten", "Lactose", "Ovos"],
    servesCount: 1,
    optionGroups: [
      {
        id: "ponto-canastra",
        name: "Ponto da Carne",
        type: "single",
        required: true,
        options: [
          { id: "pt-mal", name: "Mal Passado", price: 0 },
          { id: "pt-ponto", name: "Ao Ponto", price: 0 },
          { id: "pt-bem", name: "Bem Passado", price: 0 }
        ]
      }
    ]
  },

  // 8. Pizzas no Forno a Lenha
  {
    id: "prod-20",
    categoryId: "pizzas",
    name: "Pizza Camarão com Catupiry Especial",
    description: "Massa de fermentação lenta 48h, molho de tomate pelado San Marzano, queijo muçarela, farta quantidade de camarões selecionados puxados no azeite e ervas, e requeijão Catupiry legítimo em espiral.",
    price: 98.0,
    promoPrice: 89.0,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 25,
    tags: ["Mais pedido", "Promoção"],
    ingredients: ["Massa artesanal 48h", "Molho San Marzano", "Muçarela de búfala", "Camarões rosa", "Catupiry original", "Orégano fresco"],
    allergens: ["Crustáceos", "Glúten", "Lactose"],
    servesCount: 3,
    optionGroups: [
      {
        id: "pizza-tamanho",
        name: "Tamanho da Pizza",
        type: "single",
        required: true,
        options: [
          { id: "pz-media", name: "Individual (4 fatias - 25cm)", price: -25.0 },
          { id: "pz-grande", name: "Grande (8 fatias - 35cm)", price: 0 },
          { id: "pz-familia", name: "Família (10 fatias - 40cm)", price: 20.0 }
        ]
      },
      {
        id: "pizza-borda",
        name: "Borda Recheada",
        type: "single",
        required: true,
        options: [
          { id: "borda-simples", name: "Borda Tradicional Crocante (Sem recheio)", price: 0 },
          { id: "borda-catupiry", name: "Borda Recheada com Catupiry Legítimo", price: 12.0 },
          { id: "borda-cheddar", name: "Borda Recheada com Cheddar Cremoso", price: 12.0 }
        ]
      }
    ]
  },
  {
    id: "prod-21",
    categoryId: "pizzas",
    name: "Pizza Marguerita Especial da Praia",
    description: "Massa rústica de fermentação natural, molho de tomate italiano San Marzano, fatias de muçarela de búfala fresca derretida, rodelas de tomate cereja doce e folhas frescas de manjericão gigante.",
    price: 74.0,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 20,
    tags: ["Vegetariano"],
    ingredients: ["Massa de longa fermentação", "Molho artesanal de tomate", "Muçarela de búfala", "Tomate cereja", "Manjericão fresco", "Azeite extravirgem"],
    allergens: ["Glúten", "Lactose"],
    servesCount: 3
  },

  // 9. Sobremesas
  {
    id: "prod-22",
    categoryId: "sobremesas",
    name: "Pudim de Leite Condensado Caiçara",
    description: "Receita secular da família: textura lisinha sem furinhos, aveludado e cremoso, com abundante calda dourada de caramelo artesanal.",
    price: 22.0,
    imageUrl: "https://images.unsplash.com/photo-1514944298352-7b56f4d3fcb6?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 8,
    tags: ["Mais pedido", "Vegetariano", "Sem glúten"],
    ingredients: ["Leite condensado", "Leite fresco", "Ovos caipiras", "Açúcar cristal caramelizado"],
    allergens: ["Lactose", "Ovos"],
    servesCount: 1
  },
  {
    id: "prod-23",
    categoryId: "sobremesas",
    name: "Torta Quente de Banana com Sorvete",
    description: "Fatias de banana-da-terra caramelizadas na canela e especiarias, assadas sobre massa folhada crocante, servidas fumegantes com uma bola de sorvete artesanal de baunilha de Madagascar.",
    price: 32.0,
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 12,
    tags: ["Mais pedido", "Vegetariano"],
    ingredients: ["Banana-da-terra madura", "Massa folhada amanteigada", "Canela em pó", "Sorvete artesanal de creme"],
    allergens: ["Glúten", "Lactose", "Ovos"],
    servesCount: 1
  },
  {
    id: "prod-24",
    categoryId: "sobremesas",
    name: "Sorvete Artesanal de Coco Queimado na Casquinha",
    description: "Duas bolas generosas de sorvete cremoso de coco queimado da casa, acompanhado de calda morna de maracujá azedinho e crocante de castanhas.",
    price: 26.0,
    imageUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 8,
    tags: ["Vegetariano", "Sem glúten"],
    ingredients: ["Coco ralado queimado", "Leite fresco", "Calda artesanal de maracujá", "Pralinê de castanha"],
    allergens: ["Lactose", "Castanhas"],
    servesCount: 1
  },

  // 10. Bebidas & Sucos
  {
    id: "prod-25",
    categoryId: "bebidas",
    name: "Água de Coco Natural Geladinha",
    description: "Direto do coco verde furado na hora na bancada, estupidamente gelada e refrescante como deve ser à beira-mar.",
    price: 12.0,
    imageUrl: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 5,
    tags: ["Mais pedido", "Vegano", "Sem glúten", "Sem lactose"],
    ingredients: ["Água de coco verde fresca"],
    allergens: [],
    servesCount: 1
  },
  {
    id: "prod-26",
    categoryId: "bebidas",
    name: "Suco Natural da Fruta (500ml)",
    description: "Suco 100% natural preparado na hora com frutas frescas selecionadas.",
    price: 16.0,
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 8,
    tags: ["Vegetariano", "Vegano", "Sem glúten"],
    ingredients: ["Frutas frescas selecionadas", "Gelo filtrado"],
    allergens: [],
    servesCount: 1,
    optionGroups: [
      {
        id: "suco-sabor",
        name: "Escolha o Sabor",
        type: "single",
        required: true,
        options: [
          { id: "s-abacaxi", name: "Abacaxi com Hortelã Fresca", price: 0 },
          { id: "s-laranja", name: "Laranja Pêra Espremida", price: 0 },
          { id: "s-maracuja", name: "Maracujá Puro", price: 0 },
          { id: "s-limonada", name: "Limonada Suíça Cremosa", price: 2.0 }
        ]
      },
      {
        id: "suco-adocante",
        name: "Adoçar",
        type: "single",
        required: true,
        options: [
          { id: "ac-sem", name: "Sem Açúcar (Natural)", price: 0 },
          { id: "ac-pouco", name: "Pouco Açúcar", price: 0 },
          { id: "ac-adocante", name: "Adoçante", price: 0 },
          { id: "ac-normal", name: "Normal", price: 0 }
        ]
      }
    ]
  },
  {
    id: "prod-27",
    categoryId: "bebidas",
    name: "Cerveja Artesanal Caiçara IPA (600ml)",
    description: "Cerveja artesanal produzida na serra do mar paulista, aromas cítricos de maracujá e lúpulos americanos, harmoniza perfeitamente com frutos do mar fritos.",
    price: 28.0,
    imageUrl: "https://images.unsplash.com/photo-1608270192864-77291a27e7f7?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 5,
    tags: ["Mais pedido"],
    ingredients: ["Água purificada", "Malte de cevada", "Lúpulo", "Levedura"],
    allergens: ["Glúten"],
    servesCount: 2
  },

  // 11. Coquetéis da Casa
  {
    id: "prod-28",
    categoryId: "coqueteis",
    name: "Caipirinha da Taberna Thalassa",
    description: "Preparada com limão tahiti e limão siciliano macerados com rapadura artesanal e cachaça envelhecida em barril de amburana.",
    price: 32.0,
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 8,
    tags: ["Mais pedido"],
    ingredients: ["Cachaça artesanal de amburana", "Limão tahiti", "Limão siciliano", "Rapadura líquida", "Gelo"],
    allergens: [],
    servesCount: 1,
    optionGroups: [
      {
        id: "bebida-base",
        name: "Base Alcoólica",
        type: "single",
        required: true,
        options: [
          { id: "b-cachaca", name: "Cachaça Especial de Amburana", price: 0 },
          { id: "b-vodka", name: "Vodka Importada (+R$ 6,00)", price: 6.0 },
          { id: "b-sake", name: "Saquê Japonês (+R$ 6,00)", price: 6.0 }
        ]
      }
    ]
  },
  {
    id: "prod-29",
    categoryId: "coqueteis",
    name: "Gin Tônica Marítimo de Tangerina & Alecrim",
    description: "Gin botânico artesanal, infusão de tangerina fresca da estação, ramo de alecrim tostado no maçarico e água tônica premium.",
    price: 36.0,
    imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 8,
    tags: ["Novo"],
    ingredients: ["Gin artesanal", "Tangerina", "Alecrim fresco", "Água tônica premium", "Bagos de zimbro"],
    allergens: [],
    servesCount: 1
  },

  // 12. Combos & Promoções
  {
    id: "prod-30",
    categoryId: "combos",
    name: "Combo Al Mare Completo (Para 2 Pessoas)",
    description: "A experiência definitiva da casa: 2 Casquinhas de Siri especiais de entrada + Moqueca Mista de Robalo e Camarão (acompanha arroz e pirão) + 2 Pudins de Leite Condensado de sobremesa. Economize R$ 38,00!",
    price: 242.0,
    promoPrice: 204.0,
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 30,
    tags: ["Promoção", "Mais pedido"],
    ingredients: ["2 Casquinhas de siri", "Moqueca mista para 2", "Arroz e pirão", "2 Pudins artesanais"],
    allergens: ["Crustáceos", "Peixes", "Lactose", "Ovos"],
    servesCount: 2
  },
  {
    id: "prod-31",
    categoryId: "combos",
    name: "Combo Happy Hour Caiçara",
    description: "1 Porção generosa de Isca de Pescada Crocante + 1 Porção de Batata Rústica com queijo derretido + 2 Chopes ou Cervejas Artesanais. O pedido ideal para o fim de tarde na praia.",
    price: 110.0,
    promoPrice: 89.0,
    imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
    active: true,
    preparationTimeMin: 20,
    tags: ["Promoção", "Novo"],
    ingredients: ["Isca de pescada crocante", "Batatas rústicas com queijo", "Molho tártaro", "2 Cervejas artesanais 600ml"],
    allergens: ["Peixes", "Glúten", "Lactose"],
    servesCount: 2
  }
];

export const INITIAL_TABLES: TableInfo[] = [
  { id: "tbl-01", number: "01", name: "Mesa 01 · Deck Varanda", capacity: 4, qrCodeUrl: "/pedido?mesa=01", status: "occupied", activeComandaTotal: 184.0, activeOrdersCount: 1 },
  { id: "tbl-02", number: "02", name: "Mesa 02 · Deck Varanda", capacity: 4, qrCodeUrl: "/pedido?mesa=02", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
  { id: "tbl-03", number: "03", name: "Mesa 03 · Salão Principal", capacity: 2, qrCodeUrl: "/pedido?mesa=03", status: "occupied", activeComandaTotal: 96.0, activeOrdersCount: 1 },
  { id: "tbl-04", number: "04", name: "Mesa 04 · Salão Principal", capacity: 6, qrCodeUrl: "/pedido?mesa=04", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
  { id: "tbl-05", number: "05", name: "Mesa 05 · Vista Mar", capacity: 2, qrCodeUrl: "/pedido?mesa=05", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
  { id: "tbl-06", number: "06", name: "Mesa 06 · Vista Mar", capacity: 4, qrCodeUrl: "/pedido?mesa=06", status: "occupied", activeComandaTotal: 242.0, activeOrdersCount: 2 },
  { id: "tbl-07", number: "07", name: "Mesa 07 · Lounge Jardim", capacity: 6, qrCodeUrl: "/pedido?mesa=07", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
  { id: "tbl-08", number: "08", name: "Mesa 08 · Lounge Jardim", capacity: 4, qrCodeUrl: "/pedido?mesa=08", status: "occupied", activeComandaTotal: 139.0, activeOrdersCount: 1 },
  { id: "tbl-09", number: "09", name: "Mesa 09 · Espaço Família", capacity: 8, qrCodeUrl: "/pedido?mesa=09", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
  { id: "tbl-10", number: "10", name: "Mesa 10 · Espaço Família", capacity: 8, qrCodeUrl: "/pedido?mesa=10", status: "available", activeComandaTotal: 0, activeOrdersCount: 0 },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "BEMVINDO10", discountType: "percentage", value: 10, minOrderValue: 50, description: "10% de desconto na primeira comanda", active: true },
  { id: "c2", code: "THALASSA15", discountType: "percentage", value: 15, minOrderValue: 120, description: "15% de desconto para pedidos acima de R$ 120", active: true },
  { id: "c3", code: "PRAIA20", discountType: "fixed", value: 20, minOrderValue: 100, description: "R$ 20 OFF em pedidos acima de R$ 100", active: true },
  { id: "c4", code: "FRETEGRATIS", discountType: "fixed", value: 12, minOrderValue: 80, description: "Frete Grátis no Delivery", active: true },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1039",
    orderNumber: 1039,
    orderType: "local",
    tableNumber: "06",
    customerName: "Camila Rocha",
    customerPhone: "(13) 99123-4567",
    items: [
      {
        productId: "prod-5",
        productName: "Robalo Grelhado na Brasa com Arroz de Limão",
        quantity: 1,
        unitPrice: 94.0,
        selectedOptions: [{ groupName: "Ponto do Peixe", optionName: "Ao Ponto", price: 0 }],
        totalPrice: 94.0
      },
      {
        productId: "prod-25",
        productName: "Água de Coco Natural Geladinha",
        quantity: 2,
        unitPrice: 12.0,
        selectedOptions: [],
        totalPrice: 24.0
      }
    ],
    subtotal: 118.0,
    serviceFee: 11.8,
    deliveryFee: 0,
    discount: 0,
    total: 129.8,
    status: "delivered",
    paymentMethod: "pix",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedMinutes: 25
  },
  {
    id: "ord-1040",
    orderNumber: 1040,
    orderType: "local",
    tableNumber: "01",
    customerName: "Rodrigo Mendonça",
    customerPhone: "(11) 98765-4321",
    items: [
      {
        productId: "prod-9",
        productName: "Polvo Grelhado à Moda Thalassa",
        quantity: 1,
        unitPrice: 138.0,
        selectedOptions: [],
        totalPrice: 138.0
      },
      {
        productId: "prod-2",
        productName: "Bolinho de Bacalhau da Taberna (6 un)",
        quantity: 1,
        unitPrice: 44.0,
        selectedOptions: [{ groupName: "Molho Acompanhante", optionName: "Maionese de Ervas Frescas", price: 0 }],
        totalPrice: 44.0
      }
    ],
    subtotal: 182.0,
    serviceFee: 18.2,
    deliveryFee: 0,
    discount: 0,
    total: 200.2,
    status: "ready",
    paymentMethod: "credit",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    estimatedMinutes: 25
  },
  {
    id: "ord-1041",
    orderNumber: 1041,
    orderType: "local",
    tableNumber: "03",
    customerName: "Marina Silveira",
    customerPhone: "(13) 98877-6655",
    items: [
      {
        productId: "prod-13",
        productName: "Risoto de Camarão Rosa & Limão Siciliano",
        quantity: 1,
        unitPrice: 89.0,
        selectedOptions: [],
        notes: "Pouco sal por favor",
        totalPrice: 89.0
      }
    ],
    subtotal: 89.0,
    serviceFee: 8.9,
    deliveryFee: 0,
    discount: 0,
    total: 97.9,
    status: "preparing",
    paymentMethod: "table",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    estimatedMinutes: 25
  },
  {
    id: "ord-1042",
    orderNumber: 1042,
    orderType: "local",
    tableNumber: "08",
    customerName: "Lucas Alencar",
    customerPhone: "(13) 97766-5544",
    items: [
      {
        productId: "prod-18",
        productName: "Burger Thalassa Costeiro (Picanha & Camarão)",
        quantity: 2,
        unitPrice: 47.0,
        selectedOptions: [
          { groupName: "Ponto da Carne", optionName: "Ao Ponto", price: 0 },
          { groupName: "Pão", optionName: "Brioche", price: 0 },
          { groupName: "Adicionais Especiais", optionName: "Bacon Artesanal Crocante Fatiado", price: 7.0 }
        ],
        removedIngredients: ["Cebola"],
        notes: "Molho de limão cravo servido à parte",
        totalPrice: 108.0
      },
      {
        productId: "prod-27",
        productName: "Cerveja Artesanal Caiçara IPA (600ml)",
        quantity: 1,
        unitPrice: 28.0,
        selectedOptions: [],
        totalPrice: 28.0
      }
    ],
    subtotal: 136.0,
    serviceFee: 13.6,
    deliveryFee: 0,
    discount: 10.0,
    couponCode: "BEMVINDO10",
    total: 139.6,
    status: "received",
    paymentMethod: "pix",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    estimatedMinutes: 25
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    orderId: "ord-1035",
    orderNumber: 1035,
    customerName: "Fernanda Albuquerque",
    rating: 5,
    comment: "Melhor moqueca de Peruíbe! O peixe estava derretendo de tão fresco e o atendimento pelo cardápio digital na mesa foi super rápido e cômodo.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-2",
    orderId: "ord-1036",
    orderNumber: 1036,
    customerName: "Marcelo Fonseca",
    rating: 5,
    comment: "A casquinha de siri e o polvo grelhado são impecáveis. Ambiente agradável com brisa do mar e comanda na mesa muito fácil de usar.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-3",
    orderId: "ord-1038",
    orderNumber: 1038,
    customerName: "Patricia Guimarães",
    rating: 5,
    comment: "Adorei a facilidade de pedir pelo QR code na mesa sem precisar esperar garçom em dia de praia lotada. A comida chegou quentinha!",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];
