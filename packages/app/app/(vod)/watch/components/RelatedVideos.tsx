import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { fetchAllSessions } from '@/lib/data'
import VideoCard from '@/components/misc/VideoCard'
export default async function RelatedVideos({
  event,
}: {
  event: string
}) {
  const videos = (
    await fetchAllSessions({
      event: event,
      onlyVideos: true,
      limit: 5,
    })
  ).sessions

  return (
    <div className="max-w-screen bg-transparent border-none ">
      <div className="grid grid-cols-1 gap-4">
        {videos.map((session, index) => (
          <VideoCard session={session} key={index} />
        ))}
      </div>
    </div>
  )
}
