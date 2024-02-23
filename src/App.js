import React, { useState } from 'react'

const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOption = [
    'Who won the latest Novel Peace Prize?',
    'Where does the Pizza come from?',
    'Who do you make a BLT sandwich?'
  ]

  const surprise = () => {
    const randomValue = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Please ask a question!")
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,

        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);

      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value

      }, {

        role: "model",
        parts: data
      }

      ])
      setValue("");

    } catch (error) {
      console.log(error);
      setError("Something went wrong! Please try again later.")
    }
  }

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  }

  return (
    <div className="app">
      <p>What do you want to know!
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me!</button>
      </p>

      <div className="input-container">
        <input
          value={value}
          placeholder='When is  the next Christmas...?'
          onChange={e => setValue(e.target.value)}
        />

        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}

      <div className="search-result">
        {chatHistory.map((chatItem, _index) => <div key={_index}>
          <p className="answer">{chatItem.role}:{chatItem.parts}</p>
        </div>)}
      </div>

    </div>
  )
}

export default App
