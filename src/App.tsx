import { useState } from 'react'
import LeadForm from '@/components/LeadForm'
import LeadTable from '@/components/LeadTable'

const App = () => {
  const [activeView, setActiveView] = useState<'form' | 'table'>('form')

  const handleSubmit = async (data: {
    name: string
    email: string
    phone?: string
    source: string
    interest?: string
    note?: string
  }) => {
    // Handle form submission here
    console.log('Form submitted:', data)
    // On successful submission, you might want to switch to the table view
    // setActiveView('table'); 
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Lead Management System</h1>
          <p className="text-muted-foreground mt-2">
            Submit new leads and view existing ones
          </p>
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
