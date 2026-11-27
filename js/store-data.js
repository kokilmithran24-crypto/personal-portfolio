export const PRODUCTS = [
  { id: "linen-notebook", name: "Linen Notebook", category: "Desk", price: 18, emoji: "📓", color: "#e9ddca", badge: "Bestseller", description: "A calm place for big ideas and everyday notes. A tactile linen-style cover and thoughtfully simple pages make it a desk staple." },
  { id: "ceramic-mug", name: "Everyday Ceramic Mug", category: "Home", price: 24, emoji: "☕", color: "#e6d6c8", badge: "Popular", description: "Your favourite warm drink, in a comfortable everyday shape. A simple ceramic-inspired piece for slow mornings." },
  { id: "desk-lamp", name: "Arc Desk Lamp", category: "Desk", price: 64, emoji: "💡", color: "#dce7d8", badge: "New", description: "A clean, modern desk accent that brings a little focus to your workspace. Designed as a timeless product concept." },
  { id: "canvas-tote", name: "Daily Canvas Tote", category: "Accessories", price: 28, emoji: "👜", color: "#eadfc7", badge: "", description: "A lightweight carry-all for books, errands and everyday essentials. Easygoing, versatile and ready to go." },
  { id: "wireless-headphones", name: "Studio Headphones", category: "Tech", price: 89, emoji: "🎧", color: "#d9e1ef", badge: "Featured", description: "A minimal over-ear audio concept for focused work sessions, playlists and everything in between." },
  { id: "water-bottle", name: "Flow Bottle", category: "Accessories", price: 32, emoji: "🧴", color: "#d7e8e8", badge: "", description: "A reusable bottle concept with a clean silhouette, made to fit into your everyday routine." },
  { id: "plant-pot", name: "Little Green Planter", category: "Home", price: 21, emoji: "🪴", color: "#dce8d9", badge: "", description: "A small botanical touch for your shelf or desk. A cheerful home accent for a little everyday green." },
  { id: "wireless-mouse", name: "Quiet Click Mouse", category: "Tech", price: 39, emoji: "🖱️", color: "#e3e1ee", badge: "", description: "A streamlined mouse concept for a tidy desk setup and comfortable everyday navigation." },
  { id: "planner-set", name: "Weekly Planner Set", category: "Desk", price: 16, emoji: "🗓️", color: "#f0dfdf", badge: "", description: "A simple weekly planning companion to organise priorities, notes and the small things that matter." }
];

export const CATEGORIES = ["All", ...new Set(PRODUCTS.map(product => product.category))];
export const formatPrice = amount => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);
