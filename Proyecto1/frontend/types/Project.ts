

export interface ProjectI {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
}


type CreateProjectI = Omit<ProjectI, 'id'>;

export enum ProjectPriviliges {
    View = 1,
    Modify = 2,
    Delete = 3,
    Invite = 4
}

export type RoleT = "Creador" | "Colaborador" | "Visualizador"