import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('random-team-generator app', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display page', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Random Team Generator');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.SEVERE,
            } as logging.Entry)
        );
    });
});
