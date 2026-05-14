import { useEffect, useState } from 'react'
import { fetchPersonnes } from '../services/personnesService'

function Home() {
  const [personnes, setPersonnes] = useState([])

  useEffect(() => {
    fetchPersonnes()
      .then((data) => {
        console.log(data)
        setPersonnes(data)
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <div>
      <h1>Liste des personnes</h1>
      <pre>{JSON.stringify(personnes, null, 2)}</pre>
    </div>
  )
}

export default Home
