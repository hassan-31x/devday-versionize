import { SignOutButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import React from 'react'

const TestPage = async () => {
  const user = await currentUser()
  const user2 = auth() //useAuth for client component


  return (
    <div>TestPage

      <SignOutButton />
    </div>
  )
}

export default TestPage