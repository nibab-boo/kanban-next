import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../core/firebase";

// Delete References
export const deleteReferences = (references) => {
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
export const updateDocument = (docPath, newData) => {
  return new Promise((resolve, reject) => {
    const docRef = doc(db, ...docPath.split('/'))
    setDoc(docRef, newData, { merge: true })
      .then((docRef) => resolve(docRef))
      .catch(err => reject(err));
  });
}

// Delete Document
export const deleteDocument = (docPath) => {
  return new Promise((resolve, reject) => {
    const docRef = doc(db, ...docPath.split('/'))
    deleteDoc(docRef)
      .then((docRef) => resolve({status: "Delete Successful"}))
      .catch(err => reject(err));
  });
}
