import {$, browser, by, element, protractor} from 'protractor';

export class Application {
  initialize() {
    browser.waitForAngularEnabled(false);
    browser.get('/');
  }

  isLoaded() {
    return element(by.id('content')).isPresent();
  }

  expandSidebar() {
    const sidebar = element(by.css('nav.sidebar'));
    browser.actions().mouseMove(sidebar).perform();
  }

  logout() {
    this.expandSidebar();
    element(by.cssContainingText('span.nav-text', 'Logout')).click();
  }

  getTitleText() {
    return element(by.className('title-text')).getText();
  }
}

