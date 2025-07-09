export interface Organization {
    _id: string;
    organisation: string;
    github: string;
    technologies: string[];
    topics: string[];
    lfx_years: Record<string, any>;
    followers: number;
    forks: number;
}

export interface Issue {
    id: number;
    title: string;
    body: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    comments: number;
    labels: Label[];
    assignee: any;
    state: 'open' | 'closed';
}

export interface Label {
    name: string;
    color: string;
}

export interface Repository {
    name: string;
    full_name: string;
    open_issues: number;
    forks: number;
    stargazers_count: number;
}

export interface PaginatedResponse<T> {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    data: T[];
}