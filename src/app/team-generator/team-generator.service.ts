import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../model/member';
import { Players } from '../model/players';
import { Teams } from '../model/teams';

@Injectable({
    providedIn: 'root',
})
export class TeamGeneratorService {
    private DEMO_DATA = 'assets/demo.json';

    constructor(private http: HttpClient) {}

    /**
     * Return test data
     */
    public getDemoPlayers(): Observable<any> {
        return this.http.get(this.DEMO_DATA);
    }

    /**
     * Generate random teams
     * @param players Array of player names
     * @param numTeams Number of teams to form
     */
    public generateTeams(players: Players, numTeams: number): Teams {
        if (!players || players.members.length <= 0 || numTeams <= 0) {
            return { teams: [] };
        }

        // Determine count per team
        const numPlayers = players.members.length;
        const countPerTeam = numPlayers / numTeams;

        // teamCount array - each element represents the number of players on team x
        const teamCount = Array(numTeams).fill(countPerTeam);
        let remainingCount = numPlayers % numTeams;

        // redistribute remaining count to other teams
        for (let i = 0; i < numTeams; i++) {
            if (remainingCount > 0) {
                ++teamCount[i];
                --remainingCount;
            } else {
                break;
            }
        }

        // randomize!
        const shuffled = players.members.sort(() => Math.random() - 0.5);

        // form the teams
        const teams = new Array<Players>();
        teamCount.map((count) => {
            const members: Member[] = shuffled.splice(0, count);
            const team = new Players();
            team.members = members;

            // Randomly pick captain
            const teamCaptain =
                members[Math.floor(Math.random() * members.length)];

            if (teamCaptain) {
                teamCaptain.isCaptain = true;
            }

            teams.push(team);
        });

        return { teams };
    }
}
