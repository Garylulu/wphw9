import { createContext, useContext, useEffect, useState,useLayoutEffect } from "react";
import { message } from 'antd';
import { useQuery, useMutation } from "@apollo/client";
import { CHATBOX_QUERY, CREATE_CHATBOX_MUTATION, MESSAGE_SUBSCRIPTION , 
	CREATE_MESSAGE_MUTATION , CLEAR_MESSAGE_MUTATION } from "../../graphql";

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
	status: {},
	me: "",
	signedIn: false,
	messages: [],
	friend: "",
	sendMessages: () => {},
	displayStatus: () => {},
});

const ChatProvider = (props) => {
	const [me, setMe] = useState(savedMe || "");
	const [friend, setFriend] = useState('');
	const [signedIn, setSignedIn] = useState(false);
	const [messages, setMessages] = useState([]);
	const [status, setStatus] = useState({});
	let unsubscribe = undefined;
	const { data, loading, error, subscribeToMore } = useQuery(CHATBOX_QUERY, {
		variables: {
			name1: me,
			name2: friend,
		},
	});

	const [StartChat] = useMutation(CREATE_CHATBOX_MUTATION);
	const [SendMessage] = useMutation(CREATE_MESSAGE_MUTATION);
	const [ClearMessages] = useMutation(CLEAR_MESSAGE_MUTATION); 
	// useEffect(()=>{setInterval(() => {
	// 	startChat({name:me,to:friend});
	// }, 1000);})
	useEffect(() => {
		if(signedIn){
			localStorage.setItem(LOCALSTORAGE_KEY, me);
		}
	}, [me, signedIn]);

	useEffect(() => {
		try {
			console.log(`subscribe ${me} ${friend}`);
			//if(unsubscribe){unsubscribe();}
			if(me===''||friend==='')return ()=>{};
			unsubscribe = subscribeToMore({
				document: MESSAGE_SUBSCRIPTION,
				variables: { name1: me, name2: friend },
				updateQuery: (prev, { subscriptionData }) => {
					console.log("hi");
					console.log(subscriptionData);
					if (!subscriptionData.data) return prev;
					const newMessage = subscriptionData.data.message;
					//console.log(`this is ${JSON.stringify(subscriptionData.data.message.messages)}`);
					console.log(newMessage);
					setMessages((state)=>newMessage.messages);
					return {
						chatbox:{
							name:newMessage.name,
							messages:newMessage.messages,
							sender:"a",
							body:"a",
						}
					}
				},
			});
			//console.log(unsubscribe);
			return ()=>unsubscribe();
		} catch (e) {console.log('im dead.');console.log(e)}
	   },
	[subscribeToMore,friend]);

	// useEffect(()=>console.log(JSON.stringify(error, null, 2)),[error])

	const displayStatus = (s) => {
		if(s.msg){
			const { type, msg } = s;
			const content = {
				content: msg,
				duration: 0.5
			}
			switch(type){
				case 'success': {
					message.success(content);
					break;
				}
				case 'info': {
					message.info(content);
					break;
				}
				case 'error':
				default: {
					message.error(content);
					break;
				}
			}
		}
	}

	const startChat = async({name, to}) => {
		if(to===''||name===''||!name||!to)return <></>

	 	const chatboxObject = await StartChat({variables:{name1:name,name2:to}});
		const chat = chatboxObject.data.createChatBox.messages;
		//console.log(chat)
		setMessages((state)=>chat);
		return <></>
	}

	const sendData = async (data) => {
		//await client.send(JSON.stringify(data));
	};

	const clearMessages = async (payload)=>{
		const response = ClearMessages(payload);
		console.log(JSON.stringify(response));
		return 1;
	}

	const sendMessages = async(payload) => {
		const newMessageObject = await SendMessage(payload);
		const newMessage = newMessageObject.data.createMessage;
		console.log(newMessage);
		//setMessages([...messages,newMessage]);
	};

	return (
		<ChatContext.Provider
			value={{ status, me, signedIn, messages, setMe, setSignedIn, startChat, setFriend, sendMessages, clearMessages, displayStatus}}
			{...props}
		/>
	);
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };