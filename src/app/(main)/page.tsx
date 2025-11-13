import { getProcessosStatusCount } from "@/lib/actions/processos";
import CardDash from "./CardDash";
import Insights from "./Insights";
import MappedProcessesChart from "./MappedProcessesChart";
import ProcessHealthChart from "./ProcessHealthChart";
import ProcessTable from "./ProcessTable";
import { getProcessos } from "@/lib/queries/processos";

export default async function Home() {
  try {
    const [processos, statusCounts] = await Promise.all([
      getProcessos(),
      getProcessosStatusCount(),
    ]);

    const cards = [
      {
        id: 1,
        titulo: "Total de Processos",
        valor: processos.length,
      },
      {
        id: 2,
        titulo: "Quantidade de Funcionários",
        valor: 34, // você pode substituir por valor dinâmico se tiver API
      },
      {
        id: 3,
        titulo: "Novos Processos",
        valor: processos.filter(p => {
          const hoje = new Date();
          const created = new Date(p.ultimaAtualizacao);
          const diff = (hoje.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return diff <= 7; // processos da última semana
        }).length,
      },
    ];

    return (
      <>
        <div className="grid grid-cols-12 lg:gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="shadow-[1px_1px_10px_rgba(0,0,0,0.15)] rounded-xl p-6 bg-white mt-12 lg:mt-0 lg:min-h-[255px]">
              <h1 className="text-black font-semibold mb-6">Summary</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card) => (
                  <CardDash key={card.id} titulo={card.titulo} valor={card.valor} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Insights />
          </div>
        </div>

        <div className="grid grid-cols-12 mt-10 lg:gap-8 -z-10">
          <div className="col-span-12 lg:col-span-6">
            <ProcessHealthChart statusCounts={statusCounts} />
          </div>
          <div className="col-span-12 lg:col-span-6 mt-5 lg:mt-0">
            <MappedProcessesChart />
          </div>
        </div>

        <div className="mt-8">
          <ProcessTable processos={processos} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    return <p>Falha ao carregar dados do dashboard.</p>;
  }
}
