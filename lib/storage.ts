import { beans as mockBeans } from "@/data/beans";
import { brewRecipes as mockRecipes } from "@/data/brewRecipes";
import type { Bean } from "@/types/bean";
import type { BrewRecipe } from "@/types/brew";
import type { SensoryRecord } from "@/types/sensory";

const SENSORY_KEY = "coffeeos_sensory_records";
const CUSTOM_BEANS_KEY = "coffeeos_custom_beans";
const CUSTOM_RECIPES_KEY = "coffeeos_custom_recipes";
const CART_KEY = "coffeeos_purchase_intents";
const CUPPING_KEY = "coffeeos_cupping_rsvps";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCustomBeans() {
  return readJson<Bean[]>(CUSTOM_BEANS_KEY, []).filter(
    (bean) => bean && typeof bean.name === "object" && Array.isArray(bean.cupNotes)
  );
}

export function getCustomRecipes() {
  return readJson<BrewRecipe[]>(CUSTOM_RECIPES_KEY, []).filter(
    (recipe) => recipe && typeof recipe.intent === "object" && Array.isArray(recipe.steps)
  );
}

export function getAllBeansClient() {
  return [...mockBeans, ...getCustomBeans()];
}

export function getBeanByIdClient(id: string) {
  return getAllBeansClient().find((bean) => bean.id === id);
}

export function getRecipeByBeanIdClient(beanId: string) {
  return [...mockRecipes, ...getCustomRecipes()].find((recipe) => recipe.beanId === beanId);
}

export function addCustomBean(bean: Bean, recipe: BrewRecipe) {
  const beans = getCustomBeans();
  const recipes = getCustomRecipes();
  writeJson(CUSTOM_BEANS_KEY, [bean, ...beans.filter((item) => item.id !== bean.id)]);
  writeJson(CUSTOM_RECIPES_KEY, [recipe, ...recipes.filter((item) => item.id !== recipe.id)]);
}

export function getSensoryRecords() {
  return readJson<SensoryRecord[]>(SENSORY_KEY, []);
}

export function saveSensoryRecord(record: SensoryRecord) {
  const records = getSensoryRecords();
  writeJson(SENSORY_KEY, [record, ...records]);
}

export function deleteSensoryRecord(id: string) {
  writeJson(
    SENSORY_KEY,
    getSensoryRecords().filter((record) => record.id !== id)
  );
}

export type PurchaseIntent = {
  id: string;
  beanId: string;
  beanName: string;
  price?: number | null;
  createdAt: string;
};

export function addPurchaseIntent(intent: PurchaseIntent) {
  const intents = readJson<PurchaseIntent[]>(CART_KEY, []);
  writeJson(CART_KEY, [intent, ...intents]);
}

export function getPurchaseIntents() {
  return readJson<PurchaseIntent[]>(CART_KEY, []);
}

export function getCuppingRsvps() {
  return readJson<string[]>(CUPPING_KEY, []);
}

export function toggleCuppingRsvp(eventId: string) {
  const rsvps = getCuppingRsvps();
  const next = rsvps.includes(eventId)
    ? rsvps.filter((id) => id !== eventId)
    : [...rsvps, eventId];
  writeJson(CUPPING_KEY, next);
  return next;
}
