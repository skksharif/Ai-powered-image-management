import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='sign' >
    <SignIn afterSignInUrl='/home' afterSignOutUrl='/sign-in' />
  </div>
}