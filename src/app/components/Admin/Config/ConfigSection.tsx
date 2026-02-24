interface ConfigSectionProps {
    title: string;
    children: React.ReactNode;
    /** Si se omite, el contenido no se envuelve en grid (útil para paneles de ancho completo). */
    columns?: 2 | 3;
}

export function ConfigSection({ title, children, columns }: ConfigSectionProps) {
    const gridCols =
        columns === 3
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : columns === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : null;

    return (
        <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
            <h2 className="text-2xl font-bold text-text mb-6">{title}</h2>
            {gridCols ? (
                <div className={`grid ${gridCols} gap-6`}>{children}</div>
            ) : (
                children
            )}
        </div>
    );
}
