import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'
import { IExtendedSession } from '../types'
import { apiUrl } from '@/lib/utils/utils'

export const updateSession = async ({
  session,
  authToken,
}: {
  session: IExtendedSession
  authToken: string
}): Promise<ISessionModel> => {
  const modifiedSession = (({ _id, ...rest }) => rest)(session)
  try {
    const response = await fetch(
      `${apiUrl()}/sessions/${session._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(modifiedSession),
      }
    )
    if (!response.ok) {
      throw 'Error updating session'
    }
    return (await response.json()).data
  } catch (e) {
    console.log('error in updateSession', e)
    throw e
  }
}
