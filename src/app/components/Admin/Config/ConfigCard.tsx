import { Badge } from '@/app/components/ui/Badge';

interface ConfigField {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
}

interface ConfigCardProps {
    title: string;
    status?: 'Activo' | 'Inactivo';
    fields?: ConfigField[];
    children?: React.ReactNode;
}

export function ConfigCard({ title, status, fields, children }: ConfigCardProps) {
    return (
        <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">{title}</h3>
                {status && (
                    <Badge variant={status === 'Activo' ? 'success' : 'neutral'} className="px-3 py-1">
                        {status}
                    </Badge>
                )}
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                {fields?.map(({ label, value, highlight }) => (
                    <div key={label}>
                        <span className="font-medium text-text">{label}:</span>
                        <p className={`mt-1 ${highlight ? 'text-principal font-semibold' : ''}`}>
                            {value}
                        </p>
                    </div>
                ))}
                {children}
            </div>
        </div>
    );
}
