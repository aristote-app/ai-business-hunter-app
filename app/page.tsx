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
    
    supabase.from('creches_prospects').select('*').order('name').then(({ data }) => {
      setCreches(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{padding:'20px'}}>Chargement...</div>

  return (
    <div style={{padding:'20px',fontFamily:'Arial'}}>
      <h1>🏠 CRECHES AURA - {creches.length} PROSPECTS</h1>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead style={{background:'#f0f0f0'}}>
          <tr>
            <th style={{border:'1px solid #ddd',padding:'10px'}}>Nom</th>
            <th style={{border:'1px solid #ddd',padding:'10px'}}>📞</th>
            <th style={{border:'1px solid #ddd',padding:'10px'}}>Adresse</th>
            <th style={{border:'1px solid #ddd',padding:'10px'}}>Ville</th>
          </tr>
        </thead>
        <tbody>
          {creches.map((c) => (
            <tr key={c.id} style={{borderBottom:'1px solid #ddd'}}>
              <td style={{border:'1px solid #ddd',padding:'10px'}}>{c.name}</td>
              <td style={{border:'1px solid #ddd',padding:'10px'}}>{c.phone}</td>
              <td style={{border:'1px solid #ddd',padding:'10px'}}>{c.address}</td>
              <td style={{border:'1px solid #ddd',padding:'10px'}}>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}