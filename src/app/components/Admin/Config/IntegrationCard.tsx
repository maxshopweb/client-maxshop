import Image from 'next/image';
import { Badge } from '@/app/components/ui/Badge';

interface IntegrationCardProps {
    logoSrc: string;
    name: string;
    description: string;
    status: 'Activa' | 'Inactiva';
    ambiente: string;
    connectionStatus?: string;
}

export function IntegrationCard({
    logoSrc,
    name,
    description,
    status,
    ambiente,
    connectionStatus = 'Conectado',
}: IntegrationCardProps) {
    const isActive = status === 'Activa';

    return (
        <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-principal/40 dark:hover:border-white/40">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-16 h-16 shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 border border-principal/10 dark:border-white/10">
                        <Image src={logoSrc} alt={name} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-text mb-2">{name}</h3>
                        <p className="text-text/60 text-sm">{description}</p>
                    </div>
                </div>
                <Badge variant={isActive ? 'success' : 'neutral'} className="shrink-0 px-3 py-1">
                    {status}
                </Badge>
            </div>
            <div className="space-y-2 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                <div className="flex justify-between items-center">
                    <span>Estado:</span>
                    <Badge variant={isActive ? 'success' : 'neutral'} className="font-medium">
                        {connectionStatus}
                    </Badge>
                </div>
                <div className="flex justify-between">
                    <span>Ambiente:</span>
                    <span className="text-text font-medium">{ambiente}</span>
                </div>
            </div>
        </div>
    );
}
