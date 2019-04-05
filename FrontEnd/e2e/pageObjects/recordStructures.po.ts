import {browser} from 'protractor';

export class RecordStructuresPage {
  static isDisplayed() {
    return browser.getCurrentUrl().then(function(actualUrl) {
      return actualUrl.endsWith('/#/recordStructure');
    });
  }
}

