import { getProcessos, getCategorias } from '@/lib/queries/processos'
import ProcessosClient from './ProcessosClient'

// Server Component - Busca os dados
export default async function ProcessosPage() {
  try {
    const [processos, categorias] = await Promise.all([
      getProcessos(),
      getCategorias()
    ])

 
    return <ProcessosClient processos={processos} categorias={categorias} />
  } catch (error) {
    console.error('Erro ao carregar página de processos:', error)
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Erro ao Carregar Dados
          </h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro ao buscar os dados do banco.
          </p>
          <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </pre>
        </div>
      </div>
    )
  }
}

export const revalidate = 0 