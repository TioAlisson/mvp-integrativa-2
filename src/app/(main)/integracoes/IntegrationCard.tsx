import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface IntegrationCardProps {
  logo: StaticImageData;
  companyName: string;
  jobTitle: string;
  tags: string[];
  level: string;
  price: string;
  isConnected: boolean;
  applyUrl: string;
};

export default function IntegrationCard({
  logo,
  companyName,
  jobTitle,
  tags,
  level,
  price,
  isConnected,
  applyUrl,
}: IntegrationCardProps) {
  return (
    <div className="shadow-[1px_1px_10px_rgba(0,0,0,0.2)] p-8 rounded-3xl w-full max-w-sm">
      <div className="flex justify-between items-center">
        <Image src={logo} alt={`Logo ${companyName}`} width={50} height={50} className="min-h-[72px] object-contain" />
        {isConnected && (
          <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-full">
            Conectado
          </span>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-semibold">{companyName}</h2>
        <h3 className="text-lg font-semibold min-h-14">{jobTitle}</h3>
        <div className="flex gap-2 flex-wrap mb-16 min-h-14 items-center">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            {level}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-xl">{price}</h4>
        <Link
          href={applyUrl}
          className="bg-zinc-900 text-white/90 font-semibold px-4 py-2 rounded-md opacity-90 cursor-pointer"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
