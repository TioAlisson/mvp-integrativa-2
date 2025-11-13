'use client';

import { useState } from 'react';
import ProcessCard from './ProcessCard';
import type { Processo } from '@/types/processo';

interface TaskInfoProps {
  processos: Processo[];
  onEdit: (processo: Processo) => void;
}

export default function TaskInfo({ processos, onEdit }: TaskInfoProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (processos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">
          Nenhum processo encontrado nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {processos.map((processo) => (
        <ProcessCard
          key={processo.id}
          processo={processo}
          isExpanded={expandedId === processo.id}
          onToggleExpand={() => handleToggleExpand(processo.id)}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}