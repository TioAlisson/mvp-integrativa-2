'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Tipos para os dados do formulário
export type NovoProcessoInput = {
  titulo: string
  descricao: string
  subcategoria_id: number
  responsavel: string
  status: string
  ferramentas_usadas: string
  passos: Array<{ titulo: string; detalhe: string }>
}

export type AtualizarProcessoInput = NovoProcessoInput & {
  id: string
}

// Tipo de retorno padronizado
type ActionResult = {
  success: boolean
  error?: string
  data?: string
}


// Count status
export async function getProcessosStatusCount() {
  const supabase = await createClient();

  const statuses = ['Ativo', 'Em Análise', 'Obsoleto', 'Sugestão'];
  const results: Record<string, number> = {};

  for (const status of statuses) {
    const { count } = await supabase
      .from('processos')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    results[status] = count || 0;
  }

  return results;
}


 // CREATE
export async function createProcesso(input: NovoProcessoInput): Promise<ActionResult> {
  console.log('🚀 CREATE - Iniciando criação de processo:', input.titulo)
  
  try {
    const supabase = await createClient()

    // Converte ferramentas de string para array
    const ferramentasArray = input.ferramentas_usadas
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    console.log('📝 Dados preparados para inserção')

    // Insere no banco
    const { data, error } = await supabase
      .from('processos')
      .insert({
        titulo: input.titulo,
        descricao: input.descricao || null,
        subcategoria_id: input.subcategoria_id,
        responsavel: input.responsavel || null,
        status: input.status || '',
        ferramentas_usadas: ferramentasArray,
        passo_a_passo: input.passos,
        ultima_atualizacao: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar processo:', error)
      return { 
        success: false, 
        error: `Falha ao criar processo: ${error.message}` 
      }
    }

    console.log('✅ Processo criado com sucesso:', data.id)

    // Revalida a página para mostrar o novo processo
    revalidatePath('/processos')

    return { success: true, data }
  } catch (error) {
    console.error('💥 Erro inesperado ao criar:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao criar processo.' 
    }
  }
}

/**
 * UPDATE - Atualiza um processo existente
 */
export async function updateProcesso(input: AtualizarProcessoInput): Promise<ActionResult> {
  console.log('✏️ UPDATE - Iniciando atualização de processo:', input.id)
  
  try {
    const supabase = await createClient()

    // Converte ferramentas de string para array
    const ferramentasArray = input.ferramentas_usadas
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    console.log('📝 Atualizando dados no banco...')

    // Atualiza no banco
    const { data, error } = await supabase
      .from('processos')
      .update({
        titulo: input.titulo,
        descricao: input.descricao || null,
        subcategoria_id: input.subcategoria_id,
        responsavel: input.responsavel || null,
        status: input.status || '',
        ferramentas_usadas: ferramentasArray,
        passo_a_passo: input.passos,
        ultima_atualizacao: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select()

    if (error) {
      console.error('❌ Erro ao atualizar processo:', error)
      return { 
        success: false, 
        error: `Falha ao atualizar processo: ${error.message}` 
      }
    }

    if (!data || data.length === 0) {
      console.error('❌ Processo não encontrado:', input.id)
      return { 
        success: false, 
        error: 'Processo não encontrado.' 
      }
    }

    console.log('✅ Processo atualizado com sucesso')

    // Revalida a página para mostrar as alterações
    revalidatePath('/processos')

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('💥 Erro inesperado ao atualizar:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao atualizar processo.' 
    }
  }
}

/**
 * DELETE - Exclui um processo
 */
export async function deleteProcesso(id: string): Promise<ActionResult> {
  console.log('🗑️ DELETE - Iniciando exclusão de processo:', id)
  
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('processos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erro ao excluir processo:', error)
      return { 
        success: false, 
        error: `Falha ao excluir processo: ${error.message}` 
      }
    }

    console.log('✅ Processo excluído com sucesso')

    // Revalida a página para remover o processo da lista
    revalidatePath('/processos')

    return { success: true }
  } catch (error) {
    console.error('💥 Erro inesperado ao excluir:', error)
    return { 
      success: false, 
      error: 'Erro inesperado ao excluir processo.' 
    }
  }
}