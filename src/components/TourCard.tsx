import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface TourCardProps {
  slug: string;
  name: string;
  dates: string;
  price: string;
  difficulty: string;
  image?: string;
}

export default function TourCard({ slug, name, dates, price, difficulty, image }: TourCardProps) {
  return (
    <div className="bg-white rounded-card shadow-sm border border-primary/5 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="h-48 bg-accent/40 flex items-center justify-center relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-primary/30 text-sm font-medium">Изображение тура</div>
        )}
        <span className="absolute top-3 left-3 bg-primary/90 text-background text-xs font-medium px-2.5 py-1 rounded-full">
          {difficulty}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-semibold text-primary text-lg mb-2">{name}</h3>

        <div className="flex items-center gap-1.5 text-primary/60 text-sm mb-3">
          <img src="/icons/icon-clock.png" alt="Даты" className="w-5 h-5 object-contain" />
          <span>{dates}</span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-heading font-bold text-primary text-lg">{price}</span>
          <Link
            to={`/tours/${slug}`}
            className="inline-flex items-center gap-1.5 bg-primary text-background text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Подробнее
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
