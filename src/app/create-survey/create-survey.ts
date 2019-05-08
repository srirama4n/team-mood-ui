export class CreateSurvey {
    group: Group;
    tower: Tower;
    project: Project;
    squad: Squad;
    expiresOn: string;
    respondents: number;
    createdAt?: string;
    createdBy?: string;
}

export class Group {
    id: string;
    name: string;

    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }
}

export class Tower {
    id: string;
    name: string;

    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }
}

export class Project {
    id: string;
    name: string;

    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }
}

export class Squad {
    id: string;
    name: string;

    constructor(id?: string, name?: string) {
        this.id = id;
        this.name = name;
    }
}
