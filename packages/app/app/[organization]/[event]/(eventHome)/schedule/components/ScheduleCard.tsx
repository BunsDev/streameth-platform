'use client'

import { ModalContext } from '@/context/ModalContext'
import { useContext } from 'react'
import ScheduleCardModal from './ScheduleCardModal'
import moment from 'moment-timezone'
import { ISession } from 'streameth-server/model/session'
import { IEvent } from 'streameth-server/model/event'
import { getEventTimezoneText } from '@/utils/time'

const ScheduleCard = ({
  event,
  session,
  showTime = false,
  speakers = false,
}: {
  event: IEvent
  session: ISession
  showTime?: boolean
  speakers?: boolean
}) => {
  const { openModal } = useContext(ModalContext)
  const isActive =
    new Date(session.start).getTime() < Date.now() &&
    new Date(session.end).getTime() > Date.now()

  return (
    <div
      className="bg-black/20 flex space-y-3 flex-col w-full h-full   rounded p-2 md:p-2 text-white cursor-pointer transition-colors"
      onClick={() => {
        openModal(
          <ScheduleCardModal event={event} session={session} />
        )
      }}>
      <div className="border-l border-white  hover:border-l-2 flex flex-col px-2 rounded-tr rounded-br w-full h-full">
        {showTime && (
          <p className="text-main-text text-sm py-1">
            {moment(session.start)
              .tz(event?.timezone)
              .format('HH:mm')}{' '}
            -{' '}
            {moment(session.end)
              .tz(event?.timezone)
              .format('HH:mm')}{' '}
            {getEventTimezoneText(event?.timezone)}
          </p>
        )}
        <p className="flex text-ellipsis text-main-text text-sm lg:text-md">
          {session.name}
        </p>
        {speakers && (
          <div className="flex py-1 items-center flex-row space-x-2 overflow-x-scroll mt-auto">
            {session.speakers.map((speaker) => (
              <p
                key={speaker.id}
                className="text-sm text-main-text border p-1 px-2 rounded-full whitespace-nowrap ">
                {speaker.name}
              </p>
            ))}
          </div>
        )}
        {isActive && (
          <p className="text-bold text-red-500 ml-auto animate-pulse">
            Live
          </p>
        )}
      </div>
    </div>
  )
}

export default ScheduleCard
