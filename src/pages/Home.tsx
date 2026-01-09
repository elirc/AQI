import { Suspense } from 'react'
import Globe from '../components/Globe'
import { Loader2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] pb-16 md:pb-0">
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading globe...</p>
            </div>
          </div>
        }
      >
        <Globe />
      </Suspense>
    </div>
  )
}
