import {browser, by, element} from 'protractor';

export class LoginPage {
  static isDisplayed() {
    return browser.getCurrentUrl().then(function(actualUrl) {
      return actualUrl.indexOf('/auth/realms/endeavour/protocol/openid-connect') > 0;
    });
  }

  static login(username: string, password: string) {
    element(by.name('username')).sendKeys(username);
    element(by.name('password')).sendKeys(password);
    element(by.name('login')).click();
  }
}

