import { Application } from '../pageObjects/app.po';
import {$, browser, by, element} from 'protractor';
import {StopPage} from '../pageObjects/stop.po';
import {LoginPage} from '../pageObjects/login.po';

describe('Logon with no permissions', () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();
  });

  it ('should initialize', () => {
    app.initialize();
    browser.wait(() => LoginPage.isDisplayed());
  });

  it ('should login', () => {
    LoginPage.login('e2etest', 'e2eTestPass');
    browser.wait(() => app.isLoaded());
  });

  it ('should load the application', () => {
    expect(app.getTitleText()).toBe('Information Modeller', 'Application failed to load');
  });

  it ('should display "permission denied" message', () => {
    expect(StopPage.isDisplayed()).toBe(true, 'Stop page should be displayed for user with no permissions');
  });

  it ('should logout', () => {
    app.logout();
    browser.wait(browser.ExpectedConditions.urlContains('/auth/realms/endeavour/protocol/openid-connect'));
  });
});
