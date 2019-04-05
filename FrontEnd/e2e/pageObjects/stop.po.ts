import {browser} from 'protractor';

export class StopPage {
  static isDisplayed() {
    return browser.getCurrentUrl().then(function(actualUrl) {
      return actualUrl.endsWith('/#/stop');
    });
  }
}

