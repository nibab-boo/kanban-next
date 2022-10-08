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