let firebase = require('./firebase')

exports.handler = async function(event) {
  let postsData = []
  let db = firebase.firestore()
  let querySnapshot = await db.collection('posts').orderBy('created').get()
  console.log(`number of posts: ${querySnapshot.size}`)
  let posts = querySnapshot.docs
  // console.log(posts)
  for (let i = 0; i < posts.length; i++) {
    let postId = posts[i].id
    let postData = posts[i].data()
    // console.log(postData)
    let postUsername = postData.username
    let postImageUrl = postData.imageUrl
    let likesSnapshot = await db.collection('likes').where('postId', '==', postId).get()
    let postNumberOfLikes = likesSnapshot.size

    postsData.push({
      id: postId,
      username: postUsername,
      imageUrl: postImageUrl,
      postNumberOfLikes: postNumberOfLikes
    })
  }

  // Retrieve posts from Firestore; for each post, construct
  // a new Object that contains the post's id, username, imageUrl,
  // and number of likes. Add the newly created Object to the
  // postsData Array.
  return {
    statusCode: 200,
    body: JSON.stringify(postsData)
  }
}