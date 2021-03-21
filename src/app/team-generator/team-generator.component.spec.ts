import { HttpClientModule } from '@angular/common/http';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, of } from 'rxjs';
import { TeamGeneratorComponent } from './team-generator.component';
import { TeamGeneratorService } from './team-generator.service';
import { Member } from '../model/member';
import { Teams } from '../model/teams';
import { Players } from '../model/players';

class MockTeamGeneratorService {
    public getDemoPlayers(): Observable<any> {
        return of(['demo1', 'demo2', 'demo3']);
    }

    public generateTeams(
        players: Array<string>,
        numTeams: number
    ): Array<Array<string>> {
        return [
            ['bear', 'elephant'],
            ['lion', 'zebra'],
        ];
    }
}

describe('TeamGeneratorComponent', () => {
    const pascal = 'Pascal';
    const gullivar = 'Gullivar';
    const gullivarr = 'Gullivarr';
    const blathers = 'Blathers';

    const mockPlayers: Players = new Players();
    mockPlayers.setNames([pascal, gullivar, gullivarr, blathers]);

    const mockTeam1: Players = new Players();
    mockTeam1.setNames([pascal, gullivarr]);
    mockTeam1.members[1].isCaptain = true;

    const mockTeam2: Players = new Players();
    mockTeam2.setNames([blathers, gullivar]);
    mockTeam2.members[0].isCaptain = true;

    const mockTeams: Teams = {
        teams: [mockTeam1, mockTeam2],
    };

    let component: TeamGeneratorComponent;
    let teamGeneratorService: TeamGeneratorService;
    let fixture: ComponentFixture<TeamGeneratorComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, HttpClientModule, FormsModule, FontAwesomeModule],
                declarations: [TeamGeneratorComponent],
                providers: [
                    {
                        provide: TeamGeneratorService,
                        useClass: MockTeamGeneratorService,
                    },
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        teamGeneratorService = TestBed.inject(TeamGeneratorService);
        fixture = TestBed.createComponent(TeamGeneratorComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();

        expect(component).toBeDefined();
        expect(component.randomTeams.teams).toEqual([]);

        const compiled: HTMLElement = fixture.debugElement.nativeElement;

        const textarea = compiled.querySelector('textarea');
        expect(textarea.textContent.trim()).toEqual('');

        const dropdown = compiled.querySelector('select');
        const selectedValue = dropdown.options[dropdown.selectedIndex].value;
        expect(selectedValue).toEqual('2');
        expect(dropdown.options.length).toEqual(10);
    });

    describe('onReset', () => {
        it('should go back to form defaults', () => {
            component.onReset();
            fixture.detectChanges();

            expect(component.randomTeams.teams).toEqual([]);

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const textarea = compiled.querySelector('textarea');
            expect(textarea.textContent.trim()).toEqual('');

            const dropdown = compiled.querySelector('select');
            const selectedValue =
                dropdown.options[dropdown.selectedIndex].value;
            expect(selectedValue).toEqual('2');
        });

        it('should go back to form defaults after changing values', fakeAsync(() => {
            fixture.detectChanges();
            tick();

            component.playersForm.value.names = 'test';
            component.playersForm.value.numTeams = 3;

            component.onReset();
            fixture.detectChanges();

            expect(component.playersForm.value.names).toEqual('');
            expect(component.randomTeams.teams).toEqual([]);
        }));
    });

    describe('onSubmit', () => {
        const ERROR_MESSAGE = 'Enter players!';

        it('should generate teams', fakeAsync(() => {
            const spy = spyOn(
                teamGeneratorService,
                'generateTeams'
            ).and.returnValue(mockTeams);

            fixture.detectChanges();
            tick();

            component.onSubmit({
                names: `${pascal} \r\n ${gullivar} \r\n ${gullivarr} \r\n ${blathers}`,
                numTeams: '2',
            });
            fixture.detectChanges();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(mockPlayers, 2);

            const compiled: HTMLElement = fixture.debugElement.nativeElement;

            const teamHeaders = compiled.querySelectorAll('.card-header');
            expect(teamHeaders.length).toEqual(2);
            expect(teamHeaders[0].textContent.trim()).toEqual('Team 1');
            expect(teamHeaders[1].textContent.trim()).toEqual('Team 2');

            const teams = compiled.querySelectorAll('ul');
            expect(teams.length).toEqual(2);

            const team1 = teams[0].querySelectorAll('li');
            expect(team1.length).toEqual(2);
            expect(team1[0].textContent.trim()).toEqual(pascal);
            expect(team1[1].textContent.trim()).toEqual(gullivarr);

            const team2 = teams[1].querySelectorAll('li');
            expect(team2.length).toEqual(2);
            expect(team2[0].textContent.trim()).toEqual(blathers);
            expect(team2[1].textContent.trim()).toEqual(gullivar);

            // Show Team Captain
            const captainToggle: HTMLElement = compiled.querySelector(
                '#showCaptain'
            );

            captainToggle.click();
            fixture.detectChanges();

            const captains = compiled.querySelectorAll(
                'li.list-group-item-warning'
            );
            expect(captains.length).toEqual(2);
            expect(captains[0].textContent.trim()).toEqual(gullivarr);
            expect(captains[1].textContent.trim()).toEqual(blathers);
        }));

        it('should display error with formdata is null', () => {
            component.onSubmit(null);
            fixture.detectChanges();

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const validationError = compiled.querySelector('.alert-danger');

            expect(validationError).toBeDefined();
            expect(validationError.textContent.trim()).toEqual(ERROR_MESSAGE);
        });

        it('should display error with names is null', () => {
            component.onSubmit({ names: null });
            fixture.detectChanges();

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const validationError = compiled.querySelector('.alert-danger');

            expect(validationError).toBeDefined();
            expect(validationError.textContent.trim()).toEqual(ERROR_MESSAGE);
        });

        it('should display error with names is empty', () => {
            component.onSubmit({ names: '' });
            fixture.detectChanges();

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const validationError = compiled.querySelector('.alert-danger');

            expect(validationError).toBeDefined();
            expect(validationError.textContent.trim()).toEqual(ERROR_MESSAGE);
        });

        it('should display error with names only contains whitepsace', () => {
            component.onSubmit({ names: '    \r\n   ' });
            fixture.detectChanges();

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const validationError = compiled.querySelector('.alert-danger');

            expect(validationError).toBeDefined();
            expect(validationError.textContent.trim()).toEqual(ERROR_MESSAGE);
        });
    });

    describe('loadTestPlayers', () => {
        it('should load demo players', fakeAsync(() => {
            const spy = spyOn(
                teamGeneratorService,
                'getDemoPlayers'
            ).and.returnValue(of(['a', 'b', 'c']));

            fixture.detectChanges();
            tick();

            component.loadTestPlayers();
            fixture.detectChanges();

            expect(spy).toHaveBeenCalledTimes(1);
            expect(
                component.playersForm.value.names.replace(/\s+/g, '')
            ).toEqual('abc');
        }));
    });

    describe('copyTeamsToClipboard', () => {
        it('should not show copy button when no teams', () => {
            fixture.detectChanges();
            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const copyButton = compiled.querySelector('.js-copy-button');
            expect(copyButton).toBeNull();
        });

        it('should copy teams to clipboard', fakeAsync(() => {
            fixture.detectChanges();
            spyOn(document, 'execCommand');
            spyOn(
                teamGeneratorService,
                'generateTeams'
            ).and.returnValue(mockTeams);

            component.onSubmit({
                names: `${pascal} \r\n ${gullivar} \r\n ${gullivarr} \r\n ${blathers}`,
                numTeams: '2',
            });
            fixture.detectChanges();

            const compiled: HTMLElement = fixture.debugElement.nativeElement;
            const copyButton: HTMLElement = compiled.querySelector('.js-copy-button');
            expect(copyButton).not.toBeNull();

            copyButton.click();
            fixture.detectChanges();
            expect(document.execCommand).toHaveBeenCalledWith('copy');
        }));
    });
});
