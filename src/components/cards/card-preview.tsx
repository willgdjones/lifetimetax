import { Surface } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';

export function CardPreview({ shareId }: { shareId: string }) {
  return (
    <Surface className="p-6">
      <h3 className="text-xl font-bold">The Number Card</h3>
      <p className="mt-2 text-sm text-slate-600">Share your lifetime tax total in one click.</p>
      <ButtonLink href={`/share/${shareId}`} className="mt-4">
        Open share page
      </ButtonLink>
    </Surface>
  );
}
