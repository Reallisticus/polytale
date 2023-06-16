import { Translator } from './Translator';

export class LanguageSelector {
  private translator: Translator;
  private element: HTMLSelectElement;

  constructor(translator: Translator, element: HTMLSelectElement) {
    this.translator = translator;
    this.element = element;

    this.element.addEventListener('change', this.handleLanguageChange);
  }

  private handleLanguageChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    this.translator.setLanguage(selectElement.value);
  };
}
