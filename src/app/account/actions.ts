'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import type { CalculatorDefinition } from '@/lib/types';

interface SaveCalculatorPayload {
  userId: string;
  calculator: CalculatorDefinition;
}

export async function saveCalculatorAction(payload: SaveCalculatorPayload) {
  try {
    await addDoc(collection(db, 'user_calculators'), {
      userId: payload.userId,
      ...payload.calculator,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSavedCalculatorsAction(userId: string) {
    try {
      const q = query(collection(db, 'user_calculators'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const calculators = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (CalculatorDefinition & { id: string })[];
      return { success: true, data: calculators };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
}
