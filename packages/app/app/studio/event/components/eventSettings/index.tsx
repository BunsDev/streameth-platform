import SettingsNavigation from './settingsAccordion'
import Iframe from './iframe'
import { IEvent } from 'streameth-server/model/event'

const EventSettings = ({ event }: { event: IEvent }) => {
  return (
    <>
      <div className="w-2/6 min-w-[400px] h-full border-r">
        <SettingsNavigation event={event} />
      </div>
      <div className="w-full h-full">
        <Iframe
          organizationId={event.organizationId}
          eventId={event.id}
        />
      </div>
    </>
  )
}

export default EventSettings
