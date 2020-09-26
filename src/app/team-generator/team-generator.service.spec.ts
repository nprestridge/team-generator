import { TestBed, waitForAsync } from '@angular/core/testing';

import { TeamGeneratorService } from './team-generator.service';
import { HttpClientModule } from '@angular/common/http';
import { Players } from '../model/players';

describe('TeamGeneratorService', () => {
    let service: TeamGeneratorService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientModule],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        service = TestBed.inject(TeamGeneratorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getDemoPlayers', () => {
        it('should retrieve demo players', () => {
            const response = service.getDemoPlayers();
            expect(response).toBeDefined();

            response.subscribe((result: Array<string>) => {
                expect(result).toBeDefined();
                expect(result.length).toEqual(24);
            });
        });
    });

    describe('generateTeams', () => {
        const containsAllPlayers = (input, target) =>
            input.every((p) => target.includes(p));

        xit('should return empty list when no players', () => {
            const result = service.generateTeams(null, 2);
            expect(result).toBeDefined();
            expect(result.teams.length).toEqual(0);
        });

        xit('should return empty list when empty players', () => {
            const result = service.generateTeams(new Players(), 2);
            expect(result).toBeDefined();
            expect(result.teams.length).toEqual(0);
        });

        xit('should return empty list when no team count', () => {
            const result = service.generateTeams(new Players(), 0);
            expect(result).toBeDefined();
            expect(result.teams.length).toEqual(0);
        });

        it('should evenly distribute players', () => {
            const namesInput = [
                'aqua',
                'burnt orange',
                'chartreuse',
                'dandelion',
                'eggplant',
                'fuschia',
            ];
            const input = new Players();
            input.setNames(namesInput);

            const result = service.generateTeams(input, 2);
            const teams = result.teams;
            const team1 = teams[0].members;
            const team2 = teams[1].members;

            expect(teams.length).toBe(2);
            expect(team1.length).toBe(3);
            expect(team2.length).toBe(3);

            const namesResult = [
                ...team1.map((x) => x.name),
                ...team2.map((x) => x.name),
            ];
            expect(containsAllPlayers(namesResult, namesInput)).toEqual(true);

            expect(team1.filter((x) => x.isCaptain).length).toBe(1);
            expect(team2.filter((x) => x.isCaptain).length).toBe(1);
        });

        it('should distribute uneven number of players', () => {
            const namesInput = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
            const input = new Players();
            input.setNames(namesInput);

            const result = service.generateTeams(input, 3);
            const teams = result.teams;
            const team1 = teams[0].members;
            const team2 = teams[1].members;
            const team3 = teams[2].members;

            expect(teams.length).toBe(3);
            expect(team1.length).toBe(3);
            expect(team2.length).toBe(2);
            expect(team3.length).toBe(2);

            const namesResult = [
                ...team1.map((x) => x.name),
                ...team2.map((x) => x.name),
                ...team3.map((x) => x.name),
            ];

            expect(containsAllPlayers(namesResult, namesInput)).toEqual(true);

            expect(team1.filter((x) => x.isCaptain).length).toBe(1);
            expect(team2.filter((x) => x.isCaptain).length).toBe(1);
            expect(team3.filter((x) => x.isCaptain).length).toBe(1);
        });

        it('should generate teams with number of players < number of teams', () => {
            const input = new Players();
            input.setNames(['a']);

            const result = service.generateTeams(input, 2);
            const teams = result.teams;
            const team1 = teams[0].members;
            const team2 = teams[1].members;

            expect(teams.length).toBe(2);
            expect(team1.length).toBe(1);
            expect(team1[0].name).toBe('a');
            expect(team1[0].isCaptain).toBe(true);
            expect(team2.length).toBe(0);
        });
    });
});
