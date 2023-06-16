import * as cheerio from 'cheerio';
import axios from 'axios';

export class Scraper {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  generateSelector(elem: cheerio.Cheerio<cheerio.Element>): string {
    let selector = '';
    const element = elem.get(0);

    if (element && element.type === 'tag') {
      selector = element.name;

      if (element.attribs.id) {
        selector += `#${element.attribs.id}`;
      }

      if (element.attribs.class) {
        const classes = element.attribs.class.split(/\s+/);
        for (const cls of classes) {
          if (cls) {
            selector += `.${cls}`;
          }
        }
      }
    }
    return selector;
  }

  recursiveTextExtraction(
    elem: cheerio.Cheerio<cheerio.Element>,
    texts: { [selector: string]: string[] },
    $: cheerio.CheerioAPI,
    tags: string[]
  ) {
    elem.each((i, el) => {
      if ((el as any).type !== 'tag') {
        return;
      }
      const $el = $(el);

      if (el.type === 'tag' && tags.includes(el.name)) {
        const text = $el.text().trim();

        // Ignore elements with no meaningful text
        if (text !== '' && /[a-z0-9]/i.test(text)) {
          const parentSelector = this.generateSelector(elem);
          if (!texts[parentSelector]) {
            texts[parentSelector] = [];
          }
          texts[parentSelector].push(text);
        }

        // Continue the recursion with children that match the tags
        tags.forEach((tag) => {
          this.recursiveTextExtraction($el.find(tag), texts, $, tags);
        });
      }
    });
  }

  async scrapeWebpage() {
    const response = await axios.get(this.url);
    const $ = cheerio.load(response.data);

    const tags = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'button',
      'li',
      'span',
      'div',
      'td',
      'th',
    ];
    const texts: { [selector: string]: string[] } = {};

    tags.forEach((tag) => {
      this.recursiveTextExtraction($(tag), texts, $, tags);
    });

    // Combine texts from the same selector into a single string
    const combinedTexts: { [selector: string]: string } = {};
    for (const selector in texts) {
      combinedTexts[selector] = texts[selector].join(' ');
    }

    return combinedTexts;
  }
}
