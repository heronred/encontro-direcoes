import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ConferenceEvent, OperationType } from '../types';

export async function fetchEvents(): Promise<ConferenceEvent[]> {
  const eventsCol = collection(db, 'marista_sp_events');
  try {
    const q = query(eventsCol, orderBy('dateTime', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ConferenceEvent));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'events');
    return [];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {} // Minimal for now
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
