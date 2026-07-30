// page · redirect root para /dashboard · next/navigation
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
