import type { User } from './user';

export interface Emotion {
  id: number;
  label: string;
  color?: string;
  parentId?: number;
  createdByUserId?: number;
  createdByUser?: User;
  parent?: Emotion;
  inverseParent?: Emotion[];
}
