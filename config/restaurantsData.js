// Date Destinations & Food Vibes Options
const foodVibes = [
  {
    id: 'pizza',
    name: 'Pizza Date 🍕',
    emoji: '🍕',
    tagline: 'Cheesy slices, cozy talks & laughter',
    cuisine: 'Italian Pizza'
  },
  {
    id: 'sushi',
    name: 'Sushi Date 🍣',
    emoji: '🍣',
    tagline: 'Fresh rolls, aesthetic vibes & chopstick fun',
    cuisine: 'Japanese Sushi'
  },
  {
    id: 'burgers',
    name: 'Burgers Date 🍔',
    emoji: '🍔',
    tagline: 'Juicy burgers, crispy fries & delicious milkshakes',
    cuisine: 'Gourmet Burgers'
  },
  {
    id: 'pasta',
    name: 'Pasta Date 🍝',
    emoji: '🍝',
    tagline: 'Creamy pasta, garlic bread & candlelit elegance',
    cuisine: 'Italian Pasta'
  },
  {
    id: 'tacos',
    name: 'Tacos Date 🌮',
    emoji: '🌮',
    tagline: 'Crunchy tacos, zesty salsa & vibrant fiesta',
    cuisine: 'Mexican Tacos'
  },
  {
    id: 'ramen',
    name: 'Ramen Date 🍜',
    emoji: '🍜',
    tagline: 'Steaming savory broth, cozy noodles & warmth',
    cuisine: 'Japanese Ramen'
  }
];

const restaurants = [
  ...foodVibes,
  {
    id: 'made-in-india',
    name: 'Made in India — Radisson Blu MBD Hotel',
    location: 'Sector 18, Noida',
    tagline: 'Royal Indian Luxury & Fine Dining',
    cuisine: 'North Indian & Mughlai'
  },
  {
    id: 'desi-vibes',
    name: 'Desi Vibes — Noida',
    location: 'Sector 18, Noida',
    tagline: 'Cozy Ethnic Charm & Heartwarming Flavors',
    cuisine: 'North Indian & Mughlai'
  },
  {
    id: 'the-ancient-barbeque',
    name: 'The Ancient Barbeque — Noida',
    location: 'Sector 63, Noida',
    tagline: 'Sizzling Live Grills & Lively Celebration',
    cuisine: 'Barbecue & Buffet'
  },
  {
    id: 'spezia-bistro',
    name: 'Spezia Bistro — Noida',
    location: 'Sector 38A, Gardens Galleria, Noida',
    tagline: 'Trendy Aesthetics, Italian Pastas & Artisanal Shakes',
    cuisine: 'Italian Cafe Bistro'
  }
];

module.exports = restaurants;
