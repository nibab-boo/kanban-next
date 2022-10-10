import { deleteDoc, doc, DocumentData, DocumentReference, Firestore, setDoc } from "firebase/firestore";
import { db } from "../core/firebase";

// Delete References
export const deleteReferences = (references: string) => {
  return new Promise((resolve, reject) => {
    fetch('/api/delete',
      {
        method: "POST",
        body: JSON.stringify(references),
      })
      .then(res => res.json())
      .then((data)=>resolve(data))
      .catch((err)=>reject(err))
  });
}


// Update Document
export const updateDocument = (docPath: string, newData: any) => {
  return new Promise((resolve, reject) => {
    const docRef: DocumentReference<DocumentData> = doc(db as any, ...docPath.split('/'))
    setDoc(docRef, newData, { merge: true })
      .then((docRef) => resolve(docRef))
      .catch(err => reject(err));
  });
}

// Delete Document
export const deleteDocument = (docPath: string) => {
  return new Promise((resolve, reject) => {
    const docRef: DocumentReference<DocumentData> = doc(db as any, ...docPath.split('/'))
    deleteDoc(docRef)
      .then((docRef) => resolve({status: "Delete Successful"}))
      .catch(err => reject(err));
  });
}
