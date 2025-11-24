import { useState, useEffect } from 'react'
import LeadForm from '@/components/LeadForm'
import LeadTable from '@/components/LeadTable'
import LoginPage from '@/components/LoginPage'
import { supabase } from '@/lib/supabase'

import type { User } from '@supabase/supabase-js'

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeView, setActiveView] = useState<'form' | 'table'>('form')

  useEffect(() => {
    supabase.auth.getUser().then((result) => {
      setUser(result.data.user)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = () => {
    supabase.auth.getUser().then((result) => setUser(result.data.user))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSubmit = async (data: {
    name: string
    email: string
    phone?: string
    source: string
    interest?: string
    note?: string
  }) => {
    console.log('Form submitted:', data)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Lead Management System</h1>
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-semibold hover:bg-destructive/90 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm bg-muted p-1">
            <button
              onClick={() => setActiveView('form')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'form'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Submit Lead
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === 'table'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              View Leads
            </button>
          </div>
        </div>

        <div>
          {activeView === 'form' ? (
            <LeadForm onSubmit={handleSubmit} />
          ) : (
            <LeadTable />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
