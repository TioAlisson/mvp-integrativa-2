'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Plus from '../../components/icons/Plus';
import { createProcesso, updateProcesso } from '@/lib/actions/processos';
import type { Processo } from '@/types/processo';
import type { Categoria } from '@/lib/queries/processos';

type Passo = {
  titulo: string;
  detalhe: string;
};

type NovoProcessoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categorias: Categoria[];
  processoParaEditar?: Processo | null;
};

const statusOptions = [
  { id: 'Ativo', name: 'Ativo' },
  { id: 'Em Análise', name: 'Em Análise' },
  { id: 'Obsoleto', name: 'Obsoleto' },
  { id: 'Sugestão', name: 'Sugestão' },
];

export default function NovoProcessoModal({ 
  isOpen, 
  onClose, 
  categorias,
  processoParaEditar 
}: NovoProcessoModalProps) {
  const router = useRouter();
  const styleBorder = `rounded-md border border-zinc-200 shadow-sm`;
  
  const [passos, setPassos] = useState<Partial<Passo>[]>([
    { titulo: '', detalhe: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modo de edição: preenche o formulário com dados existentes
  useEffect(() => {
    if (processoParaEditar) {
      setPassos(processoParaEditar.passoAPasso || [{ titulo: '', detalhe: '' }]);
    } else {
      setPassos([{ titulo: '', detalhe: '' }]);
    }
  }, [processoParaEditar]);

  const handleStepChange = (index: number, field: 'titulo' | 'detalhe', value: string) => {
    const newPassos = [...passos];
    newPassos[index] = { ...newPassos[index], [field]: value };
    setPassos(newPassos);
  };

  const addStep = () => {
    setPassos([...passos, { titulo: '', detalhe: '' }]);
  };

  const removeStep = (index: number) => {
    if (passos.length <= 1) return;
    const newPassos = passos.filter((_, i) => i !== index);
    setPassos(newPassos);
  };

  // Encontra o subcategoria_id baseado no setor e subCategoria
  const getSubcategoriaId = (setor: string, subCategoria: string): number | undefined => {
    const categoria = categorias.find(c => c.name === setor);
    const subcategoria = categoria?.subcategorias.find(s => s.name === subCategoria);
    return subcategoria?.id;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const data = {
        titulo: formData.get('titulo') as string,
        descricao: formData.get('descricao') as string,
        subcategoria_id: Number(formData.get('subcategoria_id')),
        responsavel: formData.get('responsavel') as string,
        status: formData.get('status') as string,
        ferramentas_usadas: formData.get('ferramentas_usadas') as string,
        passos: passos.filter(p => p.titulo && p.detalhe) as Passo[],
      };

      let result;
      
      if (processoParaEditar) {
        result = await updateProcesso({
          ...data,
          id: processoParaEditar.id,
        });
      } else {
        result = await createProcesso(data);
      }

      if (result.success) {
        onClose();
        setPassos([{ titulo: '', detalhe: '' }]);
        (event.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        setError(result.error || 'Erro ao salvar processo');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const defaultSubcategoriaId = processoParaEditar 
    ? getSubcategoriaId(processoParaEditar.setor, processoParaEditar.subCategoria)
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 cursor-pointer rotate-45"
        >
          <Plus width={18} />
        </button>

        <h2 className="text-2xl font-bold text-zinc-900 mb-6">
          {processoParaEditar ? 'Editar Processo' : 'Cadastrar Novo Processo'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="titulo" className="font-semibold text-zinc-700">
              Nome do Processo
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              defaultValue={processoParaEditar?.titulo}
              className={`${styleBorder} py-2 px-4`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="descricao" className="font-semibold text-zinc-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              defaultValue={processoParaEditar?.descricao}
              className={`${styleBorder} px-2 pt-4`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="subcategoria_id" className="font-semibold text-zinc-700">
                Categoria
              </label>
              <select
                id="subcategoria_id"
                name="subcategoria_id"
                required
                defaultValue={defaultSubcategoriaId}
                className={`${styleBorder} py-2 px-4`}
              >
                <option value="">Selecione...</option>
                {categorias.map(cat => (
                  <optgroup label={cat.name} key={cat.id}>
                    {cat.subcategorias.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="responsavel" className="font-semibold text-zinc-700">
                Responsável
              </label>
              <input
                type="text"
                id="responsavel"
                name="responsavel"
                defaultValue={processoParaEditar?.responsavel}
                className={`${styleBorder} py-2 px-4`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ferramentas_usadas" className="font-semibold text-zinc-700">
              Ferramentas Usadas
            </label>
            <input
              type="text"
              id="ferramentas_usadas"
              name="ferramentas_usadas"
              placeholder="Separe por vírgulas (ex: FortiClient, E-mail)"
              defaultValue={processoParaEditar?.ferramentasUsadas.join(', ')}
              className={`${styleBorder} py-2 px-4`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-semibold text-zinc-700">
              Status do Processo
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={processoParaEditar?.status}
              className={`${styleBorder} py-2 px-4`}
            >
              <option value="">Selecione...</option>
              {statusOptions.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="rounded-lg border border-zinc-300 p-4">
            <legend className="px-2 font-semibold text-zinc-700">Passo a Passo</legend>
            <div className="space-y-4">
              {passos.map((passo, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-md bg-zinc-50 border border-zinc-200"
                >
                  <span className="font-bold text-lg text-secondary-500">#{index + 1}</span>
                  <div className="grow space-y-2">
                    <input
                      type="text"
                      placeholder="Título do Passo"
                      value={passo.titulo || ''}
                      onChange={(e) => handleStepChange(index, 'titulo', e.target.value)}
                      required
                      className={`${styleBorder} w-full py-2 px-4 mb-3`}
                    />
                    <textarea
                      placeholder="Detalhe do Passo"
                      value={passo.detalhe || ''}
                      onChange={(e) => handleStepChange(index, 'detalhe', e.target.value)}
                      required
                      rows={2}
                      className={`${styleBorder} w-full py-2 px-4`}
                    />
                  </div>
                  {passos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="shrink-0 text-red-500 hover:text-red-700 self-center cursor-pointer rotate-45"
                      title="Remover Passo"
                    >
                      <Plus width={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addStep}
                className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-secondary-500 py-3 font-semibold text-secondary-500 transition-all hover:bg-secondary-50"
              >
                <Plus width={18} /> Adicionar Novo Passo
              </button>
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full cursor-pointer lg:w-fit uppercase font-semibold rounded-xl px-8 py-3 text-white bg-secondary-500 shadow-[0_8px_0_0_#4274CC] transition-all ease-in-out duration-500 hover:shadow-[0_4px_0_0_#4274CC] hover:translate-y-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}