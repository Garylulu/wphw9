const makeName = ({from,to})=>{
  return [from,to].sort().join('_');
}
const Subscription = {
  message: {
    subscribe: ( parent, { name1, name2 }, { pubsub }) => {
      const chatBoxName = makeName({from:name1, to:name2});
      console.log(`!chatBox ${chatBoxName}! subscribe `);
      return pubsub.subscribe(`chatBox ${chatBoxName}`);
    },
  },
};

export {Subscription as default};

// const Subscription = {
//   comment: {
//     subscribe(parent, { postId }, { db, pubsub }, info) {
//       const post = db.posts.find(
//         (post) => post.id === postId && post.published,
//       );

//       if (!post) {
//         throw new Error('Post not found');
//       }

//       return pubsub.subscribe(`comment ${postId}`);
//     },
//   },
//   post: {
//     subscribe(parent, args, { pubsub }, info) {
//       return pubsub.subscribe('post');
//     },
//   },
// };

// export { Subscription as default };
