import axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';

export class Translator extends EventEmitter {
  private currentLanguage: string;
  private apiEndpoint: string;

  constructor(defaultLanguage: string, apiEndpoint: string) {
    super();
    this.currentLanguage = defaultLanguage;
    this.apiEndpoint = apiEndpoint;
  }

  public setLanguage(language: string) {
    this.currentLanguage = language;
    this.emit('languageChange', language);
  }

  public async translatePage(): Promise<void> {
    const textNodes = this.getTextNodes(document.body);
    for (const node of textNodes) {
      try {
        await this.translateElement(node);
      } catch (error) {
        console.error(`Error translating text: ${(error as Error).message}`);
      }
    }
  }

  private async translateElement(node: Node): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      const translatedText = await this.fetchTranslation(textNode.data || '');
      textNode.data = translatedText;
    }
  }

  private getTextNodes(node: Node): Node[] {
    const textNodes = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }
    return textNodes;
  }

  private async fetchTranslation(text: string): Promise<string> {
    const response: AxiosResponse<any> = await axios.post(this.apiEndpoint, {
      text: text,
      targetLang: this.currentLanguage,
    });

    if (response.data && response.data.translatedText) {
      return response.data.translatedText;
    }

    throw new Error('No translation found');
  }
}
