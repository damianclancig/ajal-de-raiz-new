// scripts/seed.ts
import dotenv from 'dotenv';
// Load environment variables from .env.local BEFORE anything else.
dotenv.config({ path: '.env.local' });

import clientPromise from '../src/lib/mongodb';
import { Product, ProductState } from '../src/lib/types';
import { ObjectId } from 'mongodb';


const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = () => Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
const getRandomStock = () => Math.floor(Math.random() * 101);
const getRandomBoolean = () => Math.random() < 0.2; // 20% chance of being true

const categories = ['Plantas de Interior', 'Plantas de Exterior', 'Macetas', 'Herramientas', 'Fertilizantes', 'Sustratos'];
const brands = ['Ajal', 'VerdeVida', 'TerraFirma', 'JardinPro'];
const imagePlaceholders = [
    'https://placehold.co/800x800.png',
    'https://placehold.co/800x800.png',
    'https://placehold.co/800x800.png',
    'https://placehold.co/800x800.png',
    'https://placehold.co/800x800.png'
];

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        const client = await clientPromise;
        const db = client.db('ajal-de-raiz');
        const productsCollection = db.collection('products');

        console.log('Clearing existing products...');
        await productsCollection.deleteMany({});

        console.log('Generating 100 new products...');
        const productsToInsert: Omit<Product, 'id'>[] = [];

        for (let i = 1; i <= 100; i++) {
            const name = `Producto de Prueba ${i}`;
            const category = getRandomElement(categories);
            
            const product: Omit<Product, 'id'> = {
                _id: new ObjectId(),
                name,
                slug: createSlug(name),
                category,
                images: imagePlaceholders.map(url => url + `?text=Producto\\n${i}`),
                price: getRandomPrice(),
                brand: getRandomElement(brands),
                rating: parseFloat((Math.random() * 5).toFixed(1)),
                numReviews: Math.floor(Math.random() * 100),
                countInStock: getRandomStock(),
                description: `Esta es una descripción detallada para el producto de prueba número ${i}. Pertenece a la categoría de ${category} y es perfecto para tus necesidades de jardinería.`,
                isFeatured: getRandomBoolean(),
                state: 'activo' as ProductState,
                dataAiHint: 'product image',
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
                updatedAt: new Date().toISOString(),
            };
            productsToInsert.push(product);
        }

        console.log('Inserting products into the database...');
        await productsCollection.insertMany(productsToInsert);

        console.log('✅ Seeding complete! 100 products have been added.');
        process.exit(0);

    } catch (error) {
        console.error('❌ An error occurred during seeding:', error);
        process.exit(1);
    }
}

seedDatabase();
