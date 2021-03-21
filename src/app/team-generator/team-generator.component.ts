import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { TeamGeneratorService } from './team-generator.service';
import { Teams } from '../model/teams';
import { Players } from '../model/players';

@Component({
    selector: 'app-team-generator',
    templateUrl: './team-generator.component.html',
    styleUrls: ['./team-generator.component.css'],
})
export class TeamGeneratorComponent implements OnInit {
    public faCopy = faCopy;
    public playersForm: FormGroup;
    public randomTeams: Teams;
    public playersSubmitted = true;
    public maxTeams = new Array(10);
    private defaultNumTeams = 2;

    constructor(
        private formBuilder: FormBuilder,
        private teamGeneratorService: TeamGeneratorService
    ) {}

    /**
     * Initialize form
     */
    ngOnInit() {
        this.onReset();
    }

    /**
     * Reset Form
     */
    onReset() {
        this.randomTeams = {
            teams: [],
        };

        this.playersForm = this.formBuilder.group({
            names: '',
            numTeams: this.defaultNumTeams,
        });
    }

    /**
     * Process form submission
     * @param formData form
     */
    onSubmit(formData) {
        this.playersSubmitted = true;

        if (!formData || !formData.names) {
            this.playersSubmitted = false;
            return;
        }

        const players = formData.names
            .trim()
            .split(/[\r\n]+/)
            .filter((str) => str)
            .map((str) => str.trim());

        const numTeams = parseInt(formData.numTeams, 10);

        if (players.length === 0) {
            this.playersSubmitted = false;
            return;
        }

        const names = new Players();
        names.setNames(players);
        this.randomTeams = this.teamGeneratorService.generateTeams(
            names,
            numTeams
        );
    }

    /**
     * Load test input
     */
    loadTestPlayers() {
        this.teamGeneratorService.getDemoPlayers().subscribe((players) => {
            this.playersForm = this.formBuilder.group({
                names: players.join().replace(/,/g, '\r\n'),
                numTeams: this.defaultNumTeams,
            });
        });
    }

    /**
     * Copy teams list for pasting
     */
    copyTeamsToClipboard() {
      const teamsElement = document.querySelector('.js-teams');
      const rangeToSelect = document.createRange();
      const selection = window.getSelection();
      selection.removeAllRanges();
      rangeToSelect.selectNodeContents(teamsElement);
      selection.addRange(rangeToSelect);
      document.execCommand('copy');
      selection.removeAllRanges();
    }
}
