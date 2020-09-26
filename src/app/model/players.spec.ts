import { Players } from './players';

describe('Players', () => {
    it('should initialize', () => {
        const players = new Players();
        expect(players.members).toBeDefined();
        expect(players.members.length).toEqual(0);
    });

    it('should set players with names', () => {
        const names = ['chocolate', 'strawberry', 'vanilla'];
        const players = new Players();
        players.setNames(names);

        const members = players.members;
        expect(members.length).toEqual(3);
        expect(members[0].name).toEqual('chocolate');
        expect(members[0].isCaptain).toEqual(false);
        expect(members[1].name).toEqual('strawberry');
        expect(members[1].isCaptain).toEqual(false);
        expect(members[2].name).toEqual('vanilla');
        expect(members[2].isCaptain).toEqual(false);
    });
});
