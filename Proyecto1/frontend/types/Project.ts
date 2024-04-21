

interface ProjectI {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
}


type CreateProjectI = Omit<ProjectI, 'id'>;