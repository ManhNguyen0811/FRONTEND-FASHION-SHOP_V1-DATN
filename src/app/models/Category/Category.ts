import {CategoryTranslation} from './CategoriesTranslation';

export interface Category {
  id: number;
  imageUrl: string;
  isActive: boolean;
  parentCategory: Category | null;
  translations: CategoryTranslation[];
  subCategories: Category[];

  getTranslationByLanguage(languageCode: string): string | null;
  getAllSubCategories(): Category[];
}

export class CategoryImpl implements Category {
  id: number;
  imageUrl: string;
  isActive: boolean;
  parentCategory: Category | null;
  translations: CategoryTranslation[];
  subCategories: Category[];

  constructor(
    id: number,
    imageUrl: string,
    isActive: boolean,
    parentCategory: Category | null,
    translations: CategoryTranslation[],
    subCategories: Category[]
  ) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.isActive = isActive;
    this.parentCategory = parentCategory;
    this.translations = translations;
    this.subCategories = subCategories;
  }

  getTranslationByLanguage(languageCode: string): string | null {
    const translation = this.translations.find(
      (t) => t.language.code === languageCode
    );
    return translation ? translation.name : null;
  }

  getAllSubCategories(): Category[] {
    const subCategories: Category[] = [];
    const collectSubCategories = (category: Category) => {
      subCategories.push(category);
      category.subCategories.forEach(collectSubCategories);
    };
    this.subCategories.forEach(collectSubCategories);
    return subCategories;
  }
}

