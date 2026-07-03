/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
    buttonLink: doc.buttonLink,
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
