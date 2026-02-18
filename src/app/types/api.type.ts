export interface PaginationProps { 
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
}

export interface ResponseProps<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
    pagination?: PaginationProps;
}