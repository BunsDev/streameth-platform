'use client'
import { signUp } from '@/lib/actions/events'
import { useEffect, useState } from 'react'
import { CredenzaTrigger, Credenza } from '@/components/ui/crezenda'
import {
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaHeader,
  CredenzaFooter,
  CredenzaBody,
} from '@/components/ui/crezenda'
//@ts-ignore
import { useFormStatus, useFormState } from 'react-dom'
import { IExtendedEvent } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import InfoHoverCard from '@/components/misc/interact/InfoHoverCard'

const initialState = {
  message: '',
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  if (pending) {
    return (
      <Button disabled>
        <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
        Please wait
      </Button>
    )
  }
  return <Button type="submit">Sign Up</Button>
}

const SignUpModal = ({
  event,
  setOpen,
}: {
  event: IExtendedEvent
  setOpen: any
}) => {
  const [state, formAction] = useFormState(signUp, initialState)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      setOpen(false)
    }
  }, [state?.success, setOpen, toast])
  return (
    <CredenzaContent>
      <CredenzaHeader>
        <CredenzaTitle>{event.name}</CredenzaTitle>
        <CredenzaDescription>
          <div className="flex justify-start">
            <span className="mr-2">
              Sign up to get a reminder for this event
            </span>
            <div className="my-auto">
              <InfoHoverCard
                title={''}
                description="Your email address will be used solely to send you a one-time reminder for this event. We respect your privacy and will not store, share, or use your email for any other purposes."
                size={16}
              />
            </div>
          </div>
        </CredenzaDescription>
      </CredenzaHeader>
      <CredenzaBody className="flex flex-col justify-center items-center">
        <form
          action={formAction}
          className="flex flex-row justify-center items-center w-full">
          <Input
            className="w-full"
            id="email"
            required
            name="email"
            type="email"
            placeholder="Email"
          />
          <Input
            id="eventId"
            name="eventId"
            type="hidden"
            value={event._id}
          />
        </form>
      </CredenzaBody>
      <CredenzaFooter>
        <SubmitButton />
        <p>{state?.message}</p>
      </CredenzaFooter>
    </CredenzaContent>
  )
}

const SignUp = ({ event }: { event: IExtendedEvent }) => {
  const [open, setOpen] = useState(false)
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <SignUpModal event={event} setOpen={setOpen} />
      <CredenzaTrigger>
        <div className="px-2 mx-4 animate-pulse text-white uppercase rounded-xl bg-gradient-to-b from-[#FF9976] to-[#6426EF] p-[2px]">
          Set a reminder
        </div>
      </CredenzaTrigger>
    </Credenza>
  )
}

export default SignUp
