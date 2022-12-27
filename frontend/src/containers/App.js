import SignIn from './SignIn';
import ChatRoom from './ChatRoom';
import styled from 'styled-components';
import { useChat } from './hooks/useChat';
import { useEffect } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 500px;
  margin: auto;
`;

const App = () => {
  const { signedIn } = useChat();

  // useEffect(() => {
  //   displayStatus(status);
  //   console.log("Changed");
  // }, [status]);

  return (
    <Wrapper> 
      {signedIn ? <ChatRoom /> : <SignIn />} 
    </Wrapper>
  )
}

export default App;