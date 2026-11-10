export interface Ingredient {
  name: string;
  measure: string;
}

export interface RecipeSummary {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface Recipe extends RecipeSummary {
  area: string;
  tags: string[];
  youtube: string | null;
  instructions: string;
  ingredients: Ingredient[];
}
