import { Author } from './author.model';
import { Observation } from './observation.model';

export interface Signalement {
  id: number;
  author: Author;
  description: string;
  observations: Observation[];
}

export interface SignalementPayload {
  author: Author;
  description: string;
  observations: number[];
}

export interface ApiFieldError {
  author?: {
    email?: string[];
  };
}
