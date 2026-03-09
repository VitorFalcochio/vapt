window.VAPT_DATA = {
  categories: [
    { id: "cat-1", name: "Eletronicos", icon: "EL" },
    { id: "cat-2", name: "Casa e decor", icon: "CD" },
    { id: "cat-3", name: "Moda", icon: "MD" },
    { id: "cat-4", name: "Mercado", icon: "MR" },
    { id: "cat-5", name: "Esporte", icon: "ES" },
    { id: "cat-6", name: "Beleza", icon: "BZ" }
  ],
  products: [
    { id: "prod-1", slug: "fone-bluetooth-orbit", title: "Fone Bluetooth Orbit com cancelamento leve", category: "Eletronicos", store: "VAPT Prime", price: 249.9, oldPrice: 299.9, rating: 4.8, reviews: 214, stock: 18, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80", "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80"], description: "Audio limpo, bateria longa e uma pagina de produto montada para vender com clareza comercial.", installments: "10x de R$ 24,99 sem juros", badge: "Entrega rapida" },
    { id: "prod-2", slug: "smartphone-air-max-128gb", title: "Smartphone Air Max 128GB com tela OLED", category: "Eletronicos", store: "Mobile Center", price: 1999.9, oldPrice: 2199.9, rating: 4.7, reviews: 163, stock: 12, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"], description: "Tela viva, leitura clara de beneficios e compra com confianca.", installments: "12x de R$ 166,65", badge: "Loja verificada" },
    { id: "prod-3", slug: "luminaria-halo-home-office", title: "Luminaria Halo para mesa e home office", category: "Casa e decor", store: "Casa Studio", price: 139.9, oldPrice: 179.9, rating: 4.6, reviews: 89, stock: 25, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"], description: "Design leve com posicionamento mais premium na vitrine.", installments: "5x de R$ 27,98", badge: "Frete nacional" },
    { id: "prod-4", slug: "tenis-pulse-street", title: "Tenis Pulse Street para uso urbano diario", category: "Moda", store: "Fast Lane", price: 319.9, oldPrice: 359.9, rating: 4.9, reviews: 304, stock: 9, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"], description: "Card comercial com foco em moda, status e conversao.", installments: "12x de R$ 26,65", badge: "Mais vendido" },
    { id: "prod-5", slug: "garrafa-termica-sprint-750", title: "Garrafa termica Sprint 750ml em aco inox", category: "Esporte", store: "Move Store", price: 89.9, oldPrice: 109.9, rating: 4.7, reviews: 118, stock: 32, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"], description: "Produto de giro rapido com leitura imediata de preco e parcelamento.", installments: "3x de R$ 29,96", badge: "Full VAPT" },
    { id: "prod-6", slug: "jaqueta-north-casual", title: "Jaqueta North casual com tecido leve", category: "Moda", store: "Wardrobe Co.", price: 219.9, oldPrice: 259.9, rating: 4.5, reviews: 71, stock: 14, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80", thumbnails: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"], description: "Visual renovado para categorias com apelo de moda.", installments: "8x de R$ 27,48", badge: "Compra segura" }
  ],
  customer: {
    name: "Vitoria Nunes",
    email: "vitoria@vapt.com",
    tier: "Cliente VAPT Plus",
    addresses: [
      { label: "Casa", street: "Rua das Palmeiras, 320", city: "Sao Paulo", state: "SP", zipCode: "04567-120" },
      { label: "Trabalho", street: "Av. Faria Lima, 1888", city: "Sao Paulo", state: "SP", zipCode: "01451-001" }
    ]
  },
  orders: [
    { id: "PED-24031", status: "Pagamento aprovado", total: 339.8, customer: "Vitoria Nunes", address: "Rua das Palmeiras, 320 - Sao Paulo/SP", paymentMethod: "Pix", deliveryStatus: "Em separacao", store: "VAPT Prime" },
    { id: "PED-24018", status: "Em transporte", total: 199.9, customer: "Carlos Mendes", address: "Rua do Carmo, 88 - Campinas/SP", paymentMethod: "Cartao", deliveryStatus: "Em rota", store: "Move Store" },
    { id: "PED-23994", status: "Entregue", total: 249.9, customer: "Julia Prado", address: "Rua Bahia, 54 - Curitiba/PR", paymentMethod: "Pagar na entrega", deliveryStatus: "Entregue", store: "VAPT Prime" }
  ],
  sellerMetrics: { activeProducts: 28, orders: 124, revenue: 18420.5, pendingInvoices: 7 },
  adminMetrics: { users: 1840, stores: 124, orders: 5842, deliveries: 726 },
  deliveries: [
    { id: "DEL-1031", status: "Em rota", customer: "Vitoria Nunes", address: "Rua das Palmeiras, 320 - Sao Paulo/SP", notes: "Entregar na portaria A.", orderId: "PED-24031" },
    { id: "DEL-1028", status: "Pendente", customer: "Carlos Mendes", address: "Rua do Carmo, 88 - Campinas/SP", notes: "Telefone ativo no cadastro.", orderId: "PED-24018" }
  ]
};
