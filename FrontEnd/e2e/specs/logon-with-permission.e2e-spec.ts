import { Application } from '../pageObjects/app.po';
import {browser} from 'protractor';
import {StopPage} from '../pageObjects/stop.po';
import {LoginPage} from '../pageObjects/login.po';
import {RecordStructuresPage} from '../pageObjects/recordStructures.po';

describe('Logon with permissions', () => {
  let app: Application;

  beforeEach(() => {
    app = new Application();
  });
  it ('should initialize', () => {
    app.initialize();
    browser.wait(() => LoginPage.isDisplayed());
  });

  it ('should login', () => {
    LoginPage.login('e2eTestWithPermission', 'e2eTestPass');
    browser.wait(() => app.isLoaded());
  });

  it ('should load the application', () => {
    expect(app.getTitleText()).toBe('Information Modeller', 'Application failed to load');
    expect(StopPage.isDisplayed()).toBe(false, 'Stop page should not be displayed');
  });

  it ('should default to the record structures page', () => {
    expect(RecordStructuresPage.isDisplayed()).toBe(true, 'Record structures page should display as default');
  });

  it ('Logout', () => {
    app.logout();
    browser.wait(browser.ExpectedConditions.urlContains('/auth/realms/endeavour/protocol/openid-connect'));
  });
});
