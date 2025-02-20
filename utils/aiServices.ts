import { LanguageDetector } from "./languageDetector";
import { Translator } from "./translator";
import { Summarizer } from "./summarizer";

export const languageDetector = new LanguageDetector();
export const translator = new Translator();
export const summarizer = new Summarizer();