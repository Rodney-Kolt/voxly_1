import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  writeBatch,
  runTransaction,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// ==================== TYPES ====================

export interface Poll {
  id: string
  userId: string
  question: string
  options: string[]
  imageUrl?: string
  closesAt?: Timestamp
  createdAt: Timestamp
  totalVotes?: number
  isBoosted?: boolean
  boostedUntil?: Timestamp
  boostedBy?: string
}

export interface Vote {
  id: string
  pollId: string
  userId: string
  optionIndex: number
  createdAt: Timestamp
}

export interface Comment {
  id: string
  pollId: string
  userId: string
  body: string
  createdAt: Timestamp
  userDisplayName?: string
  userAvatarUrl?: string
}

export interface CommentReaction {
  id: string
  commentId: string
  userId: string
  type: 'like' | 'dislike'
  createdAt: Timestamp
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  avatarUrl?: string
  createdAt: Timestamp
}

export interface Payment {
  id: string
  userId: string
  pollId: string
  provider: string
  amount: number
  currency: string
  status: 'completed' | 'failed' | 'pending'
  pesapalOrderTrackingId: string
  pesapalMerchantReference: string
  createdAt: Timestamp
  boostedUntil?: Timestamp
}

// ==================== USER OPERATIONS ====================

export async function createOrUpdateUser(user: any) {
  try {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      await updateDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.photoURL,
        createdAt: Timestamp.now(),
      }).catch(async () => {
        // If doc doesn't exist, create it
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.photoURL,
          createdAt: Timestamp.now(),
        })
      })
    } else {
      // Update existing user (in case profile changed)
      await updateDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.photoURL,
      })
    }
  } catch (error) {
    console.error('Error creating/updating user:', error)
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      return null
    }

    const data = userSnapshot.data()
    return {
      uid: userId,
      email: data.email,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt,
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// ==================== POLL OPERATIONS ====================

export async function createPoll(
  question: string,
  options: string[],
  imageUrl?: string,
  closesAt?: Date
): Promise<string> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not authenticated')

    const pollRef = await addDoc(collection(db, 'polls'), {
      userId: currentUser.uid,
      question,
      options,
      imageUrl: imageUrl || null,
      closesAt: closesAt ? Timestamp.fromDate(closesAt) : null,
      createdAt: Timestamp.now(),
      totalVotes: 0,
    })

    return pollRef.id
  } catch (error) {
    console.error('Error creating poll:', error)
    throw error
  }
}

export async function getPoll(pollId: string): Promise<Poll | null> {
  try {
    const pollRef = doc(db, 'polls', pollId)
    const pollSnapshot = await getDoc(pollRef)

    if (!pollSnapshot.exists()) {
      return null
    }

    const data = pollSnapshot.data()
    return {
      id: pollId,
      userId: data.userId,
      question: data.question,
      options: data.options,
      imageUrl: data.imageUrl,
      closesAt: data.closesAt,
      createdAt: data.createdAt,
      totalVotes: data.totalVotes || 0,
    }
  } catch (error) {
    console.error('Error fetching poll:', error)
    return null
  }
}

export async function getAllPolls(limitCount: number = 50): Promise<Poll[]> {
  try {
    const q = query(
      collection(db, 'polls'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const polls: Poll[] = []

    for (const doc of snapshot.docs) {
      const data = doc.data()
      const voteCount = await getVoteCount(doc.id)
      polls.push({
        id: doc.id,
        userId: data.userId,
        question: data.question,
        options: data.options,
        imageUrl: data.imageUrl,
        closesAt: data.closesAt,
        createdAt: data.createdAt,
        totalVotes: voteCount,
      })
    }

    return polls
  } catch (error) {
    console.error('Error fetching polls:', error)
    return []
  }
}

export async function getUserPolls(userId: string): Promise<Poll[]> {
  try {
    const q = query(
      collection(db, 'polls'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const polls: Poll[] = []

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      const voteCount = await getVoteCount(docSnap.id)
      polls.push({
        id: docSnap.id,
        userId: data.userId,
        question: data.question,
        options: data.options,
        imageUrl: data.imageUrl,
        closesAt: data.closesAt,
        createdAt: data.createdAt,
        totalVotes: voteCount,
      })
    }

    return polls
  } catch (error) {
    console.error('Error fetching user polls:', error)
    return []
  }
}

export function subscribeToPoll(
  pollId: string,
  callback: (poll: Poll | null) => void
) {
  try {
    const pollRef = doc(db, 'polls', pollId)

    const unsubscribe = onSnapshot(pollRef, async (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      const data = snapshot.data()
      const voteCount = await getVoteCount(pollId)
      callback({
        id: pollId,
        userId: data.userId,
        question: data.question,
        options: data.options,
        imageUrl: data.imageUrl,
        closesAt: data.closesAt,
        createdAt: data.createdAt,
        totalVotes: voteCount,
      })
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to poll:', error)
    return () => {}
  }
}

// ==================== VOTING OPERATIONS ====================

export async function getVoteCount(pollId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'votes'),
      where('pollId', '==', pollId)
    )
    const snapshot = await getDocs(q)
    return snapshot.size
  } catch (error) {
    console.error('Error getting vote count:', error)
    return 0
  }
}

export async function getUserVoteForPoll(
  pollId: string,
  userId: string
): Promise<Vote | null> {
  try {
    const q = query(
      collection(db, 'votes'),
      where('pollId', '==', pollId),
      where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      pollId: data.pollId,
      userId: data.userId,
      optionIndex: data.optionIndex,
      createdAt: data.createdAt,
    }
  } catch (error) {
    console.error('Error fetching user vote:', error)
    return null
  }
}

export async function getVotesByOption(pollId: string): Promise<number[]> {
  try {
    const q = query(
      collection(db, 'votes'),
      where('pollId', '==', pollId)
    )

    const snapshot = await getDocs(q)
    const poll = await getPoll(pollId)

    if (!poll) return []

    const voteCounts = new Array(poll.options.length).fill(0)

    snapshot.forEach((doc) => {
      const data = doc.data()
      voteCounts[data.optionIndex]++
    })

    return voteCounts
  } catch (error) {
    console.error('Error getting votes by option:', error)
    return []
  }
}

export function subscribeToVotes(
  pollId: string,
  callback: (votes: number[]) => void
) {
  try {
    const q = query(
      collection(db, 'votes'),
      where('pollId', '==', pollId)
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const poll = await getPoll(pollId)
      if (!poll) return

      const voteCounts = new Array(poll.options.length).fill(0)

      snapshot.forEach((doc) => {
        const data = doc.data()
        voteCounts[data.optionIndex]++
      })

      callback(voteCounts)
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to votes:', error)
    return () => {}
  }
}

export async function castVote(
  pollId: string,
  optionIndex: number
): Promise<boolean> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not authenticated')

    // Check if user already voted
    const existingVote = await getUserVoteForPoll(pollId, currentUser.uid)
    if (existingVote) {
      throw new Error('You have already voted on this poll')
    }

    // Create vote
    await addDoc(collection(db, 'votes'), {
      pollId,
      userId: currentUser.uid,
      optionIndex,
      createdAt: Timestamp.now(),
    })

    return true
  } catch (error) {
    console.error('Error casting vote:', error)
    throw error
  }
}

// ==================== COMMENT OPERATIONS ====================

export async function postComment(pollId: string, body: string): Promise<string> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not authenticated')

    const userProfile = await getUserProfile(currentUser.uid)

    const commentRef = await addDoc(collection(db, 'comments'), {
      pollId,
      userId: currentUser.uid,
      body,
      createdAt: Timestamp.now(),
      userDisplayName: userProfile?.displayName || 'Anonymous',
      userAvatarUrl: userProfile?.avatarUrl || null,
    })

    return commentRef.id
  } catch (error) {
    console.error('Error posting comment:', error)
    throw error
  }
}

export async function getComments(pollId: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('pollId', '==', pollId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const comments: Comment[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      comments.push({
        id: doc.id,
        pollId: data.pollId,
        userId: data.userId,
        body: data.body,
        createdAt: data.createdAt,
        userDisplayName: data.userDisplayName,
        userAvatarUrl: data.userAvatarUrl,
      })
    })

    return comments
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export function subscribeToComments(
  pollId: string,
  callback: (comments: Comment[]) => void
) {
  try {
    const q = query(
      collection(db, 'comments'),
      where('pollId', '==', pollId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments: Comment[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        comments.push({
          id: doc.id,
          pollId: data.pollId,
          userId: data.userId,
          body: data.body,
          createdAt: data.createdAt,
          userDisplayName: data.userDisplayName,
          userAvatarUrl: data.userAvatarUrl,
        })
      })

      callback(comments)
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to comments:', error)
    return () => {}
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not authenticated')

    const commentRef = doc(db, 'comments', commentId)
    const commentSnapshot = await getDoc(commentRef)

    if (!commentSnapshot.exists()) {
      throw new Error('Comment not found')
    }

    const commentData = commentSnapshot.data()
    if (commentData.userId !== currentUser.uid) {
      throw new Error('You can only delete your own comments')
    }

    await deleteDoc(commentRef)
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

// ==================== COMMENT REACTION OPERATIONS ====================

export async function getUserReactionForComment(
  commentId: string,
  userId: string
): Promise<CommentReaction | null> {
  try {
    const q = query(
      collection(db, 'commentReactions'),
      where('commentId', '==', commentId),
      where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      commentId: data.commentId,
      userId: data.userId,
      type: data.type,
      createdAt: data.createdAt,
    }
  } catch (error) {
    console.error('Error fetching user reaction:', error)
    return null
  }
}

export async function getReactionCounts(
  commentId: string
): Promise<{ likes: number; dislikes: number }> {
  try {
    const q = query(
      collection(db, 'commentReactions'),
      where('commentId', '==', commentId)
    )

    const snapshot = await getDocs(q)
    let likes = 0
    let dislikes = 0

    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.type === 'like') {
        likes++
      } else if (data.type === 'dislike') {
        dislikes++
      }
    })

    return { likes, dislikes }
  } catch (error) {
    console.error('Error getting reaction counts:', error)
    return { likes: 0, dislikes: 0 }
  }
}

export function subscribeToReactions(
  commentId: string,
  callback: (counts: { likes: number; dislikes: number }) => void
) {
  try {
    const q = query(
      collection(db, 'commentReactions'),
      where('commentId', '==', commentId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let likes = 0
      let dislikes = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.type === 'like') {
          likes++
        } else if (data.type === 'dislike') {
          dislikes++
        }
      })

      callback({ likes, dislikes })
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to reactions:', error)
    return () => {}
  }
}

export async function toggleReaction(
  commentId: string,
  type: 'like' | 'dislike'
): Promise<void> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('User not authenticated')

    // Check existing reaction
    const existingReaction = await getUserReactionForComment(
      commentId,
      currentUser.uid
    )

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction (toggle off)
        await deleteDoc(doc(db, 'commentReactions', existingReaction.id))
      } else {
        // Update reaction (toggle to different type)
        await updateDoc(doc(db, 'commentReactions', existingReaction.id), {
          type,
        })
      }
    } else {
      // Add new reaction
      await addDoc(collection(db, 'commentReactions'), {
        commentId,
        userId: currentUser.uid,
        type,
        createdAt: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    throw error
  }
}

// ==================== UTILITY FUNCTIONS ====================

export function isPollClosed(closesAt?: Timestamp): boolean {
  if (!closesAt) return false
  return closesAt.toDate() < new Date()
}

export function formatDate(timestamp: Timestamp): string {
  return new Date(timestamp.toMillis()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTimeRemaining(closesAt?: Timestamp): string {
  if (!closesAt) return ''

  const now = new Date()
  const closeDate = closesAt.toDate()
  const diff = closeDate.getTime() - now.getTime()

  if (diff <= 0) return 'Poll closed'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d left`
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`
  }

  return `${minutes}m left`
}

// ==================== BOOSTED POLLS OPERATIONS ====================

export async function getAllBoostedPolls(limitCount: number = 50): Promise<Poll[]> {
  try {
    const now = new Date()
    const q = query(
      collection(db, 'polls'),
      where('isBoosted', '==', true),
      where('boostedUntil', '>', Timestamp.fromDate(now)),
      orderBy('boostedUntil', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const polls: Poll[] = []

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      const voteCount = await getVoteCount(docSnap.id)
      polls.push({
        id: docSnap.id,
        userId: data.userId,
        question: data.question,
        options: data.options,
        imageUrl: data.imageUrl,
        closesAt: data.closesAt,
        createdAt: data.createdAt,
        isBoosted: data.isBoosted,
        boostedUntil: data.boostedUntil,
        boostedBy: data.boostedBy,
        totalVotes: voteCount,
      })
    }

    return polls
  } catch (error) {
    console.error('Error fetching boosted polls:', error)
    return []
  }
}
