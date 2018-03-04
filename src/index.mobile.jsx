import * as React from 'react'
import { render } from 'react-dom'
import Button from 'material-ui/Button'
import DocumentsPage from './pages/documents'
import DevTools from 'mobx-react-devtools'
import { useStrict} from 'mobx'
import {imageStore} from './modules/db'
// useStrict(true)
function App() {
  return (
    <div>
    <DocumentsPage />
    <DevTools />
    </div>
  );
}

render(<App />, document.querySelector('#app'))

// imageStore.put(new Blob([1,2,3,34,4,423,342,43,34,34,34])).then((key)=>imageStore.get(key)).then(console.log,console.error)