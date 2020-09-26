export class Member {
    name: string;
    isCaptain: boolean;

    constructor(name: string, isCaptain?: boolean) {
        this.name = name;
        this.isCaptain = isCaptain || false;
    }
}
