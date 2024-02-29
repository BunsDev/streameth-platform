'use client'

import { useState, useCallback, useRef, Suspense } from 'react'
import UploadVideoForm from './UploadVideoForm'
import { useDropzone } from 'react-dropzone'
import { FileUp } from 'lucide-react'
import Alert from '@/components/misc/interact/Alert'
import { createSessionAction } from '@/lib/actions/sessions'
import { type IExtendedEvent } from '@/lib/types'
import { Progress } from '@/components/ui/progress'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { getUrlAction } from '@/lib/actions/livepeer'
import type { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import uploadVideo from '../lib/uploadVideo'

const Dropzone = ({
  event,
  organization,
  stages,
}: {
  event: IExtendedEvent
  organization: string
  stages: IStageModel[]
}) => {
  const abortControllerRef = useRef(new AbortController())

  const [progress, setProgress] = useState<number>(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [session, setSession] = useState<ISession | null>(null)

  const handleUpload = async (file: File) => {
    const asset = await getUrlAction(file.name)
    const session = await createSessionAction({
      session: {
        name: 'No Name',
        description: 'No Description',
        eventId: event._id,
        organizationId: event.organizationId,
        speakers: [],
        stageId: stages[0]._id!,
        assetId: asset?.assetId,
        start: 0,
        end: 0,
      },
    })
    setSelectedFile(file)
    setSession(session)

    console.log('Uploading video...')
    uploadVideo(
      file,
      asset?.url!,
      abortControllerRef,
      (percentage) => {
        setProgress(percentage)
      }
    )
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['*.mp4'],
    },
    maxFiles: 1,
    onDrop,
  })

  const handleCancel = () => {
    setProgress(0)
    setSession(null)
    setSelectedFile(null)
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full h-full">
      {!selectedFile ? (
        <div>
          <p className="flex justify-center mb-3 text-xl">
            You are about to upload to the event:&nbsp;
            <span className="font-bold">{event.name}</span>
          </p>
          <div
            {...getRootProps()}
            className="flex flex-col justify-center items-center text-sm bg-gray-100 rounded-md border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-200 h-[550px] w-[700px]">
            <FileUp className={'my-4'} size={65} />
            <input
              {...getInputProps()}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  handleUpload(file)
                }
              }}
            />
            <p>
              Drag and drop videos to upload... Or just click here!
            </p>
          </div>
        </div>
      ) : (
        <Suspense fallback={<div>Loading session data...</div>}>
          <div className="flex flex-col justify-center items-center">
            <UploadVideoForm session={session!} progress={progress} />
            {progress < 100 ? (
              <>
                <span className="mt-2 font-medium">{progress}%</span>
                <Progress value={progress} className="mt-1 mb-4" />
                <Alert
                  triggerText="Cancel upload..."
                  dialogTitle="Are you sure to cancel the upload?"
                  dialogDescription=""
                  continueClick={() => handleCancel()}
                />
              </>
            ) : (
              <>
                <span className="mx-4">Finished upload...</span>
                <Link
                  href={`/studio/${organization}/library/${session!._id?.toString()}/edit`}>
                  <Button>Go to the video...</Button>
                </Link>
              </>
            )}
          </div>
        </Suspense>
      )}
    </div>
  )
}

export default Dropzone
