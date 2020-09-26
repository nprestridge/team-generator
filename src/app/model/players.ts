import { Member } from './member';

export class Players {
    members: Array<Member> = new Array<Member>();

    setNames(names: Array<string>) {
        for (const name of names) {
            this.members.push(new Member(name));
        }
    }
}
