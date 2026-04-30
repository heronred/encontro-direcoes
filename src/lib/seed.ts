import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { EventType } from '../types';

const INITIAL_EVENTS = [
  // 20/05/2026
  { title: "Credenciamento e Fala Inicial", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T08:30:00", type: EventType.ACTIVITY },
  { title: "Espiritualidade: Construir a Nova l'Hermitage", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T09:00:00", type: EventType.ACTIVITY },
  { title: "Irmãos – Capítulo Geral e Liderança Marista", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T09:45:00", type: EventType.TALK },
  { title: "Intervalo", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T10:45:00", type: EventType.BREAK },
  { title: "Expectativa sobre as Lideranças no Marista Brasil", speaker: "Anele", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T11:15:00", type: EventType.TALK },
  { title: "Acolhimento da Superintendência", speaker: "Alessandro", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T11:40:00", type: EventType.TALK },
  { title: "Almoço", location: "Hotel Green Place Ibirapuera", dateTime: "2026-05-20T12:00:00", type: EventType.MEAL },
  { title: "Liderança e Visão Estratégica", speaker: "Jaqueline Mânica", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-20T14:00:00", type: EventType.TALK },
  { title: "Programação Livre", location: "Hotel Green Place Ibirapuera", dateTime: "2026-05-20T18:00:00", type: EventType.ACTIVITY },

  // 21/05/2026
  { title: "Espiritualidade: Chamados a construir em Comunhão", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-21T08:15:00", type: EventType.ACTIVITY },
  { title: "Liderança e Desenvolvimento", speaker: "Jaqueline Mânica", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-21T08:45:00", type: EventType.TALK },
  { title: "Liderança e Feedback", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-21T09:30:00", type: EventType.TALK },
  { title: "Almoço", location: "Hotel Green Place Ibirapuera", dateTime: "2026-05-21T12:15:00", type: EventType.MEAL },
  { title: "Dinâmica", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-21T14:00:00", type: EventType.ACTIVITY },
  { title: "Estratégia e Criação de Valor", speaker: "Professor Luiz Vieira (Insper)", location: "Hotel Green Place Ibirapuera - Sala Ibirapuera - 1º andar", dateTime: "2026-05-21T14:45:00", type: EventType.TALK },
  { title: "Confraternização", location: "Hotel Green Place Ibirapuera", dateTime: "2026-05-21T18:00:00", type: EventType.ACTIVITY },

  // 22/05/2026
  { title: "Oração Inicial", location: "Col. Arquidiocesano - Anfiteatro - 1º andar - Prédio Histórico", dateTime: "2026-05-22T08:15:00", type: EventType.ACTIVITY },
  { title: "Apresentação do PDL", location: "Col. Arquidiocesano - Anfiteatro - 1º andar - Prédio Histórico", dateTime: "2026-05-22T08:30:00", type: EventType.TALK },
  { title: "Partilhas Maristas", location: "Col. Arquidiocesano - Anfiteatro - 1º andar - Prédio Histórico", dateTime: "2026-05-22T09:00:00", type: EventType.TALK },
  { title: "Intervalo", location: "Col. Arquidiocesano - Anfiteatro - 1º andar - Prédio Histórico", dateTime: "2026-05-22T10:30:00", type: EventType.BREAK },
  { title: "Encerramento", location: "Col. Arquidiocesano - Anfiteatro - 1º andar - Prédio Histórico", dateTime: "2026-05-22T10:45:00", type: EventType.ACTIVITY },
  { title: "Missa", location: "Col. Arquidiocesano - Capela", dateTime: "2026-05-22T12:00:00", type: EventType.ACTIVITY },
];

export async function seedData() {
  const eventsCol = collection(db, 'events');
  const existing = await getDocs(query(eventsCol, limit(1)));
  if (existing.empty) {
    console.log("Seeding data...");
    for (const event of INITIAL_EVENTS) {
      await addDoc(eventsCol, event);
    }
    console.log("Seeding complete.");
  }
}
