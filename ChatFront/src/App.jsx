
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import Home from './pages/Home';
import Chat from './pages/Chat';
import io from  'socket.io-client';

const socket= io.connect('http://localhost:5000')

function App() {
return(
  <BrowserRouter>


  <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='/chat' element={<Chat socket={socket}/>}></Route>
  </Routes>
  <Toaster/>
  </BrowserRouter>
)

}

export default App;
