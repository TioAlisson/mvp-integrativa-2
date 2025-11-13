'use client'

import { useState } from 'react';
import Plus from '@/app/components/icons/Plus';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteProcesso } from '@/lib/actions/processos';
import { useRouter } from 'next/navigation';
import type { Processo } from '@/types/processo';

interface ProcessCardProps {
  processo: Processo;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (processo: Processo) => void;
}

export default function ProcessCard({
  processo,
  isExpanded,
  onToggleExpand,
  onEdit
}: ProcessCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    titulo,
    descricao,
    responsavel,
    ultimaAtualizacao,
    status,
    subCategoria,
    setor,
    ferramentasUsadas,
    passoAPasso,
  } = processo;

  const dataFormatada = new Date(ultimaAtualizacao).toLocaleDateString('pt-BR');

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o processo "${titulo}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteProcesso(processo.id);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Erro ao excluir processo');
      }
    } catch (error) {
      alert('Erro inesperado ao excluir processo');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColors = {
    'Ativo': 'bg-green-100 text-green-800',
    'Em Análise': 'bg-yellow-100 text-yellow-800',
    'Obsoleto': 'bg-red-100 text-red-800',
    'Sugestão': 'bg-blue-100 text-blue-800',
  };


  return (
    <div className="flex flex-col shadow-[1px_1px_10px_rgba(0,0,0,0.15)] rounded-xl bg-white">
      <div className="p-6 rounded-b-xl flex flex-col grow">
        <div className="grow">
          <div className="flex items-center justify-between flex-wrap mb-3">
            <div className='flex gap-4'>
              <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold">
                {subCategoria}
              </span>

              <span
                className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-xs font-semibold`}
              >
                {status}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onEdit(processo)}
                className="text-blue-600 rounded-lg transition-colors cursor-pointer"
                title="Editar processo"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 text-red-600 rounded-lg transition-colors cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                title="Excluir processo"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={onToggleExpand}
                className={`transition-transform duration-300 ease-in-out cursor-pointer ${isExpanded ? 'rotate-45' : 'rotate-0'
                  }`}
                aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
              >
                <Plus width={14} height={14} />
              </button>
            </div>
          </div>

          <h1 className="font-bold text-xl text-black mt-4 mb-3 min-h-[60px] line-clamp-2">
            {titulo}
          </h1>

          <h2
            className={`mb-4 text-gray-700 overflow-hidden transition-all duration-1000 ease-in-out min-h-12
            ${!isExpanded ? 'max-h-12 opacity-100 line-clamp-2' : 'max-h-[600px] opacity-100 pt-1'}`}
          >
            {descricao}
          </h2>

          <div className="text-sm mb-4 text-gray-600">
            {passoAPasso.length > 0 && (
              <span className={`block ${!isExpanded ? 'truncate' : ''}`}>
                <span className="text-secondary-500 font-semibold">
                  Passo 1
                </span>: {passoAPasso[0].titulo}
                {passoAPasso[0].detalhe && ` - ${passoAPasso[0].detalhe}`}
              </span>
            )}

            <div
              className={`transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100 pt-1' : 'max-h-0 opacity-0'
                }`}
            >
              {passoAPasso.slice(1).map((passo, index) => (
                <span key={index} className="block my-2">
                  <span className="text-secondary-500 font-semibold">
                    Passo {index + 2}
                  </span>: {passo.titulo}
                  {passo.detalhe && ` - ${passo.detalhe}`}
                </span>
              ))}
            </div>
          </div>

          <h3 className="mb-2 text-sm">
            Responsável: <span className="font-medium">{responsavel}</span>
          </h3>

          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Ferramentas:
            </h4>
            <p
              className={`text-sm text-gray-600 ${!isExpanded ? 'line-clamp-2 min-h-10 mt-1' : 'whitespace-normal'
                }`}
            >
              {ferramentasUsadas.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3 mt-4">
          <p>
            Setor: <span className="font-medium text-gray-700">{setor}</span>
          </p>
          <p>
            Atualizado em:{' '}
            <span className="font-medium text-gray-700">{dataFormatada}</span>
          </p>
        </div>
      </div>
    </div>
  );
}