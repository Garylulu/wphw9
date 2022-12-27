import {v4 as uuidv4} from 'uuid';

const makeName = ({name,to})=>{
  return [name,to].sort().join('_');
}
const checkOutChatBox = async({name,to,ChatBoxModel})=>{
  const chatBoxName = makeName({name, to});
  let chatBox = await ChatBoxModel.findOne({name:chatBoxName});
  if(!chatBox){
      chatBox = await new ChatBoxModel({name:chatBoxName,messages:[]}).save();
  }
  return chatBox;
}
const Mutation = {
  createChatBox: ( parent , {name1,name2} ,{ChatBoxModel})=>{
    console.log(`create box ${name1} ${name2}`);
    return checkOutChatBox({name:name1,to:name2,ChatBoxModel}); 
  },
  createMessage: async( parent , {name, to, body} ,{ChatBoxModel, pubsub})=>{
    const chatBox = await checkOutChatBox({name, to, ChatBoxModel});
    
    const newMsg = { sender: name, body:body };
    chatBox.messages.push(newMsg);
    await chatBox.save();
    const chatBoxName = makeName({name, to});
    console.log(`!chatBox ${chatBoxName}! create message `);
    pubsub.publish(`chatBox ${chatBoxName}`
    , { message: chatBox, });
    return newMsg;
  },
  clearMessage: async(parent,{name,to},{ChatBoxModel,pubsub})=>{
    const chatBoxName = makeName({name,to});
    console.log(`clear message ${chatBoxName}`);
    let chatBox = await checkOutChatBox({name,to,ChatBoxModel});
    chatBox.messages = [];
    await chatBox.save();
    console.log(JSON.stringify(chatBox));
    pubsub.publish(`chatBox ${chatBoxName}`,{message:chatBox});
    return {sender:"a",body:"a"};
  }
}

export default Mutation;