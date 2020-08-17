import React, { memo } from 'react'
import { hot } from 'react-hot-loader/root'

import './App.less'

interface CounterProps {
  initialCount?: number
}

const Counter = memo(function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = React.useState(initialCount)

  const add = () => {
    setCount(count + 1)
  }

  return (
    <div className="counter">
      <input type="text" value={count} readOnly />
      <button type="button" onClick={add}>
        +
      </button>
    </div>
  )
})

function App() {
  return (
    <div className="app">
      <h2 className="title">create-react-ts-webpack-npm-package</h2>
      <Counter />
    </div>
  )
}

export default hot(App)
