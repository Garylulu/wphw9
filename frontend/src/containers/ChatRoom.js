import AppTitle from '../components/Title';
import ChatModal from '../components/ChatModal';
import Message from '../components/Message';
import { Button, Input, Tabs } from 'antd';
import styled from 'styled-components';
import { useChat } from './hooks/useChat';
import { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';

const ChatBoxesWrapper = styled(Tabs)`
width: 100%;
height: 300px;
background: #eeeeee52;
border-radius: 10px;
margin: 20px;
padding: 20px;
`;

const ChatBoxWrapper = styled.div`
	height: calc(240px - 36px);
	display: flex;
	flex-direction: column;
	overflow: auto;
`;

const TitleWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const FootRef = styled.div`
background: "red";
height: 20px;
`;

const ChatRoom = () => {
	const { me, messages, status, displayStatus, setFriend , startChat, sendMessages, clearMessages,} = useChat();
	const [chatBoxes, setChatBoxes] = useState([]);
	const [activeKey, setActiveKey] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [body, setBody] = useState('');
	const [msgSent, setMsgSent] = useState(false);
	const msgFooter = useRef(null);

	const scrollToBottom = () => {
		msgFooter.current?.scrollIntoView({ behavior: 'smooth', block: "start" });
	};
	
	useEffect(() => {
		setMsgSent(true);
	}, [status]);
	
	useEffect(() => {
		scrollToBottom();
		setMsgSent(false);
	}, [chatBoxes]);
	useEffect(()=>{
		scrollToBottom();
		setMsgSent(false);
		setFriend(activeKey);
		startChat({name:me,to:activeKey})
	},[activeKey])
	useEffect(() => {
		var newChatBoxes = chatBoxes;
		if(activeKey !== ''){
			const index = newChatBoxes.findIndex(({ key }) => key === activeKey);
			newChatBoxes[index].children = <ChatBoxWrapper>
			{messages.length === 0 ? (
				<p style={{ color: '#ccc' }}>No messages...</p>
			) : (
				messages.map(({ sender, body }, i) => (
					<Message isMe={sender === me ? true : false} message={body} key={i} />
			)))}
			<FootRef ref={msgFooter} />
		</ChatBoxWrapper>;
			for(let i = 0; i < newChatBoxes.length; i++){
				if(i !== index){
					newChatBoxes[i].children = <></>
				}
			}
		}
		setChatBoxes([...newChatBoxes]);
	}, [messages]);

	const createChatBox = async(myfriend) => {
		if(chatBoxes.some(({ key }) => key === myfriend)){
			throw new Error(myfriend + "'s chat box is already opened.");	
		}
		const chat = await startChat({name:me,to:myfriend});
		setChatBoxes([...chatBoxes, {
			label: myfriend,
			children: chat,
			key: myfriend,
		}])
		setMsgSent(true); // For scrollToBottom()
		return myfriend;
	};

	const removeChatBox = (targetKey, activeKey) => {
		const index = chatBoxes.findIndex(({ key }) => key === activeKey);
		const newChatBoxes = chatBoxes.filter(({ key }) => key !== targetKey);
		setChatBoxes(newChatBoxes);
		return (
			activeKey ?
				activeKey === targetKey ?
					chatBoxes.length !== 1 ?
						index === chatBoxes.length - 1 ? chatBoxes[index - 1].key : chatBoxes[index + 1].key
					: ''
				: activeKey
			: ''
		)
	};

	return (
		<div className="App">
			<TitleWrapper>
				<AppTitle name={me} />
				<Button onClick={ ()=>clearMessages({variables:{name:me, to:activeKey}}) } type="primary" danger >
						Clear
				</Button>
			</TitleWrapper>
			<ChatBoxesWrapper
				type="editable-card"
				tabBarStyle={{ height: '36px' }}
				activeKey={activeKey}
				onChange={(key) => {
					setActiveKey(key);
					//startChat({name:me, to:key});
				}}
				onEdit={(targetKey, action) => {
					if(action === "add"){
						setModalOpen(true);
					}
					else if(action === "remove"){
						const oldKey = activeKey;
						const newKey = removeChatBox(targetKey, activeKey);
						setActiveKey(newKey);
						if(newKey !== '' && newKey !== oldKey){
							startChat({name:me, to:newKey});
						}
					}
				}}
				items={chatBoxes}
			>
			</ChatBoxesWrapper>
			<ChatModal
				open={modalOpen}
				onCreate={ async({name}) => {
					console.log(name)
					const key = await createChatBox(name);
					setActiveKey(name);
					setModalOpen(false);
				}}
				onCancel={() => {setModalOpen(false);}}
			/>
			<Input.Search
				value={body}
				onChange={(e) => setBody(e.target.value)}
				onSearch={(msg) => {
					if(!msg){
						displayStatus({
							type: 'error',
							msg: 'Please enter a message body.'
						})
						return;
					}
					sendMessages({variables: { to: activeKey, name: me, body: msg } });
					setBody('');
				}}
				enterButton="Send"
				placeholder="Type a message here..."
			></Input.Search>
		</div>
	)
}

export default ChatRoom;