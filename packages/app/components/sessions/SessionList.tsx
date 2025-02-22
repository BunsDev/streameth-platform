'use client'
import React, { useEffect } from 'react'
import Scroll, { Element } from 'react-scroll'
import ScheduleCard from '@/app/[organization]/[event]/schedule/components/ScheduleCard'
import { IExtendedEvent, IExtendedSession } from '@/lib/types'
interface Props {
  event: IExtendedEvent
  sessions: IExtendedSession[]
  currentSession?: IExtendedSession
}

const scroll = Scroll.scroller

function NoSessionComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-60 m-4 p-4">
      <p className="text-gray-600">
        No sessions scheduled for this stage!
      </p>
    </div>
  )
}

export default function SessionList({
  event,
  sessions,
  currentSession,
}: Props) {
  const getCurrDaySessions = () => {
    return sessions.filter(
      (session) =>
        new Date(session.start).toLocaleDateString() ==
        new Date().toLocaleDateString()
    )
  }

  const sortedSessions = getCurrDaySessions().length
    ? getCurrDaySessions().sort((a, b) => {
        if (a.start < b.start) {
          return -1
        } else if (a.start > b.start) {
          return 1
        } else {
          return 0
        }
      })
    : sessions.slice().sort((a, b) => {
        if (a.start < b.start) {
          return -1
        } else if (a.start > b.start) {
          return 1
        } else {
          return 0
        }
      })

  useEffect(() => {
    if (currentSession) {
      scroll.scrollTo(currentSession._id, {
        duration: 1500,
        smooth: true,
        offset: 0,
        containerId: 'sessionList',
      })
    }
  }, [currentSession])

  if (sessions === undefined || sessions.length === 0) {
    return <NoSessionComponent />
  }

  return (
    <ul id="sessionList" className="h-full relative lg:overflow-auto">
      {sortedSessions.map((i, index) => {
        if (i.name === 'Blank') return null
        return (
          <Element key={index} name={i._id}>
            <li id={i._id} className="mb-3 text-lg">
              <ScheduleCard
                event={event}
                session={i}
                showTime
                speakers
              />
            </li>
          </Element>
        )
      })}
    </ul>
  )
}
