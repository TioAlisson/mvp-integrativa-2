import IntegrationCard from "./IntegrationCard";
import LogoSupabase from "../../../../public/logo-supabase.png";
import LogoNotion from "../../../../public/logo-notion.png";
import LogoSlack from "../../../../public/logo-slack.png";
import LogoTrello from "../../../../public/logo-trello.png";

export default function IntegrationCardInfo() {
 const cards = [
    {
      logo: LogoSupabase,
      companyName: "Supabase",
      jobTitle: "Banco de dados principal.",
      tags: ["Database", "Core"], 
      level: "Conectado", 
      price: "Incluso",
      isConnected: true,
      applyUrl: "#",
    },
    {
      logo: LogoNotion,
      companyName: "Notion",
      jobTitle: "Importe e exporte documentações.", 
      tags: ["Produtividade", "Docs"],
      level: "Planejado", 
      price: "Plano Pro", 
      isConnected: false,
      applyUrl: "#", 
    },
    {
      logo: LogoSlack,
      companyName: "Slack",
      jobTitle: "Receba notificações de processos.", 
      tags: ["Comunicação", "Equipe"],
      level: "Planejado",
      price: "Plano Pro", 
      isConnected: false,
      applyUrl: "#",
    },
    {
      logo: LogoTrello,
      companyName: "Trello",
      jobTitle: "Sincronize seus quadros e cartões.",
      tags: ["Gestão", "Projetos"], 
      level: "Planejado", 
      price: "Plano Pro", 
      isConnected: false,
      applyUrl: "#", 
    },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
      {cards.map((card, index) => (
        <IntegrationCard key={index} {...card} />
      ))}
    </div>
  );
}
