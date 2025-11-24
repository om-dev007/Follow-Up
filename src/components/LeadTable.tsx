import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Lead = {
  id: number
  name: string
  email: string
  phone?: string
  source: 'Google' | 'Referral' | 'Other'
  interest?: string
  created_at: string
}

type SortKey = keyof Lead
type SortOrder = 'asc' | 'desc'

const LeadTable = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order(sortKey, { ascending: sortOrder === 'asc' })

        if (error) {
          throw error
        }
        setLeads(data || [])
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching leads:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const SortableHeader = ({
    label,
    sortableKey,
  }: {
    label: string
    sortableKey: SortKey
  }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(sortableKey)}
    >
      {label}
      {sortKey === sortableKey && (
        <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
      )}
    </th>
  )

  if (loading) {
    return <div className="text-center p-4">Loading leads...</div>
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error: {error}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-xl font-semibold">No Leads Found</h3>
        <p className="text-muted-foreground mt-2">
          No leads have been submitted yet.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader label="Name" sortableKey="name" />
            <SortableHeader label="Email" sortableKey="email" />
            <SortableHeader label="Phone" sortableKey="phone" />
            <SortableHeader label="Source" sortableKey="source" />
            <SortableHeader label="Interest" sortableKey="interest" />
            <SortableHeader label="Date" sortableKey="created_at" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {lead.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.phone || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {lead.interest || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeadTable
