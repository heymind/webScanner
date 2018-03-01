import * as React from 'react'
import { render } from 'react-dom'
import Button from 'material-ui/Button'
import DocumentsPage from './pages/documents'
import DevTools from 'mobx-react-devtools'
import { useStrict} from 'mobx'
// useStrict(true)
function App() {
  return (
    <div>
    <Button variant="raised" color="primary">
      Hello World
    </Button>
    <DocumentsPage />
    <DevTools />
    </div>
  );
}

render(<App />, document.querySelector('#app'))