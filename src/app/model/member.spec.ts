import { Member } from './member';

describe('Member', () => {
    it('should initialize with isCaptain defaulted to false', () => {
        const member = new Member('Tom Nook');
        expect(member.name).toEqual('Tom Nook');
        expect(member.isCaptain).toEqual(false);
    });

    it('should initialize with isCaptain set to true', () => {
        const member = new Member('Tom Nook', true);
        expect(member.name).toEqual('Tom Nook');
        expect(member.isCaptain).toEqual(true);
    });

    it('should set fields', () => {
        const member = new Member('Tom Nook');
        member.name = 'Timmy';
        member.isCaptain = true;
        expect(member.name).toEqual('Timmy');
        expect(member.isCaptain).toEqual(true);
    });
});
