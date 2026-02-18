'use client';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-3xl font-bold text-text">{title}</h1>
                {description != null && (
                    <p className="mt-1 text-sm text-text">{description}</p>
                )}
            </div>
            {children != null && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
