import { Page, studioPageParams } from '@/lib/types'
import { headers } from 'next/headers'
import React from 'react'
import { Button } from '@/components/ui/button'
import { fetchUserAction } from '@/lib/actions/users'
import {
  Video,
  Film,
  CalendarSearch,
  UploadCloud,
} from 'lucide-react'
import CreateOrganization from '../(home)/components/CreateOrganizationForm'
import SwitchOrganization from './components/SwitchOrganization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import { hasOrganization } from '@/lib/utils/utils'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Link from 'next/link'
export type variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: studioPageParams['params']
}) => {
  const isAuthorized = CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }
  const userData = await fetchUserAction({})

  const pages: Page[] = [
    {
      name: 'Videography',
      href: 'https://info.streameth.org/stream-eth-studio',
      bgColor: 'bg-muted',
      icon: <Video size={21} />,
    },
    {
      name: 'Videos',
      href: `/studio/${params.organization}/library`,
      bgColor: 'bg-muted',
      icon: <Film size={21} />,
    },
    {
      name: 'Events',
      href: `/studio/${params.organization}`,
      bgColor: 'bg-muted',
      icon: <CalendarSearch size={21} />,
    },
    {
      name: 'Upload',
      href: `/studio/${params.organization}/upload`,
      bgColor: 'bg-muted',
      icon: <UploadCloud size={21} />,
    },
  ]

  const headersList = headers()
  const pathname = headersList.get('next-url') || ''

  return (
    <div className="w-screen h-screen">
      <HomePageNavbar
        pages={pages}
        showSearchBar={false}
        currentOrganization={params.organization}
        organizations={userData?.organizations}
      />
      <div className="top-[64px] overflow-hidden flex flex-col h-[calc(100vh-64px)] border-t border-secondary">
        {!hasOrganization(
          userData?.organizations,
          params.organization
        ) ? (
          <div className="flex flex-col justify-center items-center h-screen">
            You do not belong to this organization, switch
            organization or create a new one
            <div className="flex gap-5 mt-5">
              <SwitchOrganization
                organizations={userData?.organizations}
              />
              <Link href="/studio/create">
                <Button>Create Organization</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">{children}</div>
        )}
      </div>
    </div>
  )
}

export default Layout
