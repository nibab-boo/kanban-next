import { useSession, signIn, signOut } from "next-auth/react"
import { db } from '../../core/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'


export default function Button() {
  const { data: session } = useSession()
  const dbInstance = collection(db, "cities");
  console.log("DBINSTANCE", dbInstance);

  const firebaseCreate = async () => {
    try {
      console.log("I was here");
      const response = await addDoc(dbInstance, {
        name: "Tokyo",
        country: "Japan"
      });
      console.log("RESPONSE: --- :", response);
    } catch (error) {
      console.error("ERROR", error);
    }
  }


  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={() => firebaseCreate()}>Add To Firebase</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}