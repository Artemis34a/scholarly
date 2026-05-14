const PERSONNES_API_URL = 'http://localhost:3000/personnes'

export async function fetchPersonnes() {
  const response = await fetch(PERSONNES_API_URL)

  if (!response.ok) {
    throw new Error(`Erreur lors du chargement des personnes: ${response.status}`)
  }

  return response.json()
}
