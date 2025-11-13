export interface Processo {
  id: string;
  titulo: string;
  descricao: string;
  subCategoria: string;
  status: 'Ativo' | 'Em Análise' | 'Obsoleto' | 'Sugestão';
  responsavel: string;
  ultimaAtualizacao: string;
  setor: string;
  ferramentasUsadas: string[];
  passoAPasso: {
    titulo: string;
    detalhe: string;
  }[];
  preRequisitos?: string[];
  linksUteis?: { nome: string; url: string }[];
  palavrasChave?: string[];
  publicoAlvo?: string[];
}

export interface ProcessoFromDB {
  id: string;
  created_at: string;
  titulo: string;
  descricao: string | null;
  status: string;
  responsavel: string | null;
  ultima_atualizacao: string | null;
  ferramentas_usadas: string[] | null;
  passo_a_passo: string | null;
  subcategoria_id: number;
  subcategorias: {
    id: number;
    name: string;
    categorias: {
      id: number;
      name: string;
    } | null;
  } | null;
}