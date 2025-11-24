import LeadForm from '@/components/LeadForm'
import LeadTable from '@/components/LeadTable'

const App = () => {
  const handleSubmit = async (data: {
    name: string
    email: string
    phone?: string
    source: 'Google' | 'Referral' | 'Other'
    interest?: string
    note?: string
  }) => {
    // Handle form submission here
    // For example, send to your API endpoint
    console.log('Form submitted:', data)
    
    // Example: You can send this to your backend API
    // try {
    //   const response = await fetch('/api/leads', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   })
    //   if (!response.ok) throw new Error('Failed to submit')
    //   alert('Thank you! We will get back to you soon.')
    // } catch (error) {
    //   alert('Something went wrong. Please try again.')
    // }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <LeadForm onSubmit={handleSubmit} />
        <div className="mt-8">
          <LeadTable />
        </div>
      </div>
    </div>
  )
}

export default App
