import { IStage } from 'streameth-server/model/stage'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import Player from '@/components/ui/Player'
import { livepeer } from '@/lib/services/livepeer'
const StreamConfig = async ({ stage }: { stage: IStage }) => {
  const stream = (
    await livepeer.stream.get(stage.streamSettings.streamId)
  ).stream
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{stage.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        <div className="flex flex-col w-1/2 gap-4">
          <Player
            playerName={stage.name}
            playbackId={stream?.playbackId}
          />
          <Card>
            <CardHeader>
              <CardTitle>Stream Details</CardTitle>
              <CardDescription>
                {/* id: {isLoading ? stream?.playbackId : 'loading...'} */}
              </CardDescription>
            </CardHeader>
            <CardContent className="lg:pt-0 flex flex-col space-y-2">
              <p className="text-base">
                Copy and paste the stream key into your streaming
                software. Use either the RTMP or SRT ingest, depending
                on your use-case. The RTMP ingest is more common with
                OBS users
              </p>
              <p className="font-bold">RTMP Ingest:</p>
              <p>rtmp://rtmp.livepeer.com/live</p>
              <p className="font-bold">Stream key:</p>
              <p>{stream?.streamKey}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col w-1/2">
          {/* <MultistreamCard streamId={stage.streamSettings.streamId} /> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default StreamConfig
