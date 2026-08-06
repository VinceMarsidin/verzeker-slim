import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { StoredReview } from '@/lib/services/insurance'

interface ReviewListProps {
  reviews: StoredReview[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-[4px] border border-dashed border-line p-10 text-center text-ink-soft">
        Nog geen reviews voor deze maatschappij. Wees de eerste om je ervaring te delen.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-line bg-paper-raised p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{review.title}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {review.userName} ·{' '}
                {review.createdAt.toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'fill-stamp-dark text-stamp-dark' : 'text-line'}`}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 text-ink-soft leading-relaxed">{review.body}</p>
        </Card>
      ))}
    </div>
  )
}
