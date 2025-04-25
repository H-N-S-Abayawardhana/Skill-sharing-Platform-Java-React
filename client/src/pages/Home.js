import React from 'react'

function Home() {
  return (
    <div>
      <h1>wellcome</h1>
      <button  onClick={()=>(window.location.href='/learning-plan/add')}>Add learning plan</button>
    </div>
  )
}

export default Home