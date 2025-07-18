
import clientPromise from '@/lib/mongodb';
import type { HeroSlide } from './types';
import { ObjectId } from 'mongodb';

const getDb = async () => {
  const client = await clientPromise;
  return client.db('ajal-de-raiz');
};

const slideFromDoc = (doc: any): HeroSlide | null => {
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    headline: doc.headline,
    subtext: doc.subtext,
    image: doc.image,
    state: doc.state || 'deshabilitado',
    dataAiHint: doc.dataAiHint || 'promotional banner',
    createdAt: doc.createdAt?.toString(),
    updatedAt: doc.updatedAt?.toString(),
  };
};

export const getAllSlides = async (): Promise<HeroSlide[]> => {
  const db = await getDb();
  const slidesCollection = db.collection('heroSlides');
  const slides = await slidesCollection.find({}).sort({ createdAt: -1 }).toArray();
  return slides.map(doc => slideFromDoc(doc)).filter(s => s !== null) as HeroSlide[];
};

export const getActiveSlides = async (): Promise<HeroSlide[]> => {
  const db = await getDb();
  const slidesCollection = db.collection('heroSlides');
  const slides = await slidesCollection.find({ state: 'habilitado' }).sort({ createdAt: -1 }).toArray();
  return slides.map(doc => slideFromDoc(doc)).filter(s => s !== null) as HeroSlide[];
};

export const getSlideById = async (id: string): Promise<HeroSlide | null> => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const db = await getDb();
  const slidesCollection = db.collection('heroSlides');
  const slide = await slidesCollection.findOne({ _id: new ObjectId(id) });
  return slideFromDoc(slide);
};
