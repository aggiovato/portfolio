import type { Locale } from '../config';
import { en } from './en';
import { es } from './es';
import { it } from './it';
import { ja } from './ja';

export type UiKey = keyof typeof en;
/** Every locale provides exactly the keys of the default dictionary (missing or extra keys fail `astro check`). */
export type UiDictionary = Record<UiKey, string>;

export const dictionaries: Record<Locale, UiDictionary> = { en, es, it, ja };
