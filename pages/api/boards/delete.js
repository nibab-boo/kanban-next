import { doc, writeBatch } from "firebase/firestore";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../core/firebase";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Authorization check
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized User" });

  // POST method check
  if (req.method != "POST")
    return res.status(404).json({ error: "Invalid Request" });

  // Deleting in Batch
  const batch = writeBatch(db);
  const references = JSON.parse(req.body);
  references?.forEach((ref) => {
    const docRef = doc(db, ...ref.split('/'));
    batch.delete(docRef);
  })
  batch
    .commit()
    .then(() => {return res.status(200).json({status: "success"})})
    .catch((error) => {return res.status(404).json({error: error.status ?? "Error in Delete"})})
}