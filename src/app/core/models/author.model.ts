export type Sexe = 'Homme' | 'Femme' | 'Non-binaire';

export interface Author {
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: Sexe;
  email: string;
}
