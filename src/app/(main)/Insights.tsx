import ColorCircles from "./ColorCircles";
import headerCardJson from "../(main)/headerCard.json"
import HeaderCard from "./HeaderCard";


export default function Insights() {
    return (
        <div className="shadow-[1px_1px_10px_rgba(0,0,0,0.15)] rounded-xl p-6 bg-white mt-12 lg:mt-0 lg:min-h-[255px]">
            <div className="flex justify-between">
                <h2 className="text-black font-semibold mb-6">Insights da Equipe</h2>
                <div className="flex gap-2">
                    <ColorCircles color="bg-blue-300" />
                    <ColorCircles color="bg-green-300" />
                    <ColorCircles color="bg-yellow-300" />
                </div>
            </div>
            <div>
                {headerCardJson.map((item, index) => (
                    <HeaderCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        bgColor={item.bgColor}
                        textColor={item.textColor}
                        perc={item.perc}
                    />
                ))}
            </div>
        </div >
    );
}