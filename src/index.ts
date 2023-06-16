import { Translator } from './lib/Translator';
import { LanguageSelector } from './lib/LanguageSelector';

// Since we're in a browser context, make sure the DOM is fully loaded before we start
document.addEventListener('DOMContentLoaded', (event) => {
  // Create a new instance of the Translator class
  // The endpoint is now your own server's /translate endpoint
  const translator = new Translator('en', 'http://localhost:3000/translate');

  // Get the language select HTML element
  const languageSelectElement = document.querySelector(
    '#language-selector'
  ) as HTMLSelectElement;

  // Create a new instance of the LanguageSelector class
  new LanguageSelector(translator, languageSelectElement);

  // Begin translating the page
  translator.translatePage().catch(console.error);
});
