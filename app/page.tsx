'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Dashboard() {
  const [creches, setCreches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    
    supabase
      .from('creches_prospects')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCreches(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '20px' }}>⏳ Chargement des crèches...</div>

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🏠 CRÈCHES AURA - {creches.length} PROSPECTS</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: '#3b82f6', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{creches.length}</div>
          <div>Total</div>
        </div>
        <div style={{ background: '#eab308', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{creches.filter(c => c.status === 'prospect').length}</div>
          <div>À appeler</div>
        </div>
        <div style={{ background: '#22c55e', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{creches.filter(c => c.status === 'oui').length}</div>
          <div>✅ Oui</div>
        </div>
        <div style={{ background: '#ef4444', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{creches.filter(c => c.status === 'non').length}</div>
          <div>❌ Non</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f3f4f6' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Nom</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>📞 Téléphone</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Adresse</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Ville</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {creches.map((creche) => (
              <tr key={creche.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontWeight: 'bold' }}>{creche.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}>{creche.phone}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontSize: '13px' }}>{creche.address}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{creche.city}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  <span style={{
                    background: creche.status === 'prospect' ? '#f3f4f6' : creche.status === 'oui' ? '#86efac' : '#fca5a5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {creche.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
