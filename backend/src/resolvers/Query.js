const makeName = ({name,to})=>{
  return [name,to].sort().join('_');
}
const Query = {
  chatbox: async (parent , {name1,name2} , {ChatBoxModel})=>{
    const name = makeName({name:name1,to:name2});
    console.log(`query ${name}`)
    let box = await ChatBoxModel.findOne({name:name});
    if(!box){
      box = await new ChatBoxModel({name:name,messages:[]}).save();
    }
    console.log(JSON.stringify(box));
    return box;
  },
};

export default Query;

// const Query = {
//   users(parent, args, { db }, info) {
//     if (!args.query) {
//       return db.users;
//     }

//     return db.users.filter((user) => {
//       return user.name.toLowerCase().includes(args.query.toLowerCase());
//     });
//   },
//   posts(parent, args, { db }, info) {
//     if (!args.query) {
//       return db.posts;
//     }

//     return db.posts.filter((post) => {
//       const isTitleMatch = post.title
//         .toLowerCase()
//         .includes(args.query.toLowerCase());
//       const isBodyMatch = post.body
//         .toLowerCase()
//         .includes(args.query.toLowerCase());
//       return isTitleMatch || isBodyMatch;
//     });
//   },
//   comments(parent, args, { db }, info) {
//     return db.comments;
//   },
//   me() {
//     return {
//       id: '123098',
//       name: 'Mike',
//       email: 'mike@example.com',
//     };
//   },
//   post() {
//     return {
//       id: '092',
//       title: 'GraphQL 101',
//       body: '',
//       published: false,
//     };
//   },
// };

// export { Query as default };
