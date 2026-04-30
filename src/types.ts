export enum EventType {
  TALK = 'talk',
  MEAL = 'meal',
  BREAK = 'break',
  ACTIVITY = 'activity'
}

export interface ConferenceEvent {
  id: string;
  title: string;
  speaker?: string;
  location: string;
  dateTime: string; // ISO String for easier manipulation
  type: EventType;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}
