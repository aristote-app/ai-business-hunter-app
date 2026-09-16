'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function CrechesDashboard() {
  const [creches, setCreches] = useState([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadCreches()
  }, [])

  const loadCreches = async () => {
    const { data } = await supabase
      .from('creches_prospects')
      .select('*')
      .eq('region', 'AURA')
      .order('name')
    setCreches(data || [])
    setLoading(false)
  }

  const markCalled = async (id: number, status: string) => {
    await supabase
      .from('creches_prospects')
      .update({ status })
      .eq('id', id)
    
    await supabase
      .from('appels_log')
      .insert([{
        creche_id: id,
        action: status,
        timestamp: new Date().toISOString()
      }])
    
    loadCreches()
  }

  if (loading) return <div className="p-8">Chargement...</div>

  const stats = {
    total: creches.length,
    prospects: creches.filter(c => c.status === 'prospect').length,
    oui: creches.filter(c => c.status === 'oui').length,
    non: creches.filter(c => c.status === 'non').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">🏠 Crèches AURA - 53 prospects</h1>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-yellow-700">{stats.prospects}</div>
            <div className="text-sm text-gray-600">À appeler</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-700">{stats.oui}</div>
            <div className="text-sm text-gray-600">✅ Oui</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-red-700">{stats.non}</div>
            <div className="text-sm text-gray-600">❌ Non</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Nom</th>
                <th className="px-6 py-3 text-left font-semibold">📞 Téléphone</th>
                <th className="px-6 py-3 text-left font-semibold">Adresse</th>
                <th className="px-6 py-3 text-left font-semibold">Ville</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creches.map((creche) => (
                <tr key={creche.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{creche.name}</td>
                  <td className="px-6 py-4 font-mono text-sm">{creche.phone}</td>
                  <td className="px-6 py-4 text-sm">{creche.address}</td>
                  <td className="px-6 py-4 text-sm">{creche.city}</td>
                  <td className="px-6 py-4">
                    <span className={px-3 py-1 rounded text-xs font-bold }>
                      {creche.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => markCalled(creche.id, 'oui')}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                      ✅ Oui
                    </button>
                    <button
                      onClick={() => markCalled(creche.id, 'non')}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      ❌ Non
                    </button>
                    <button
                      onClick={() => markCalled(creche.id, 'callback')}
                      className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                    >
                      📞 Rappel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
