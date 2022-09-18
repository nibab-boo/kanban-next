export const sortBySecond = (list) => {
  if (list.length === 0) return list;

  list.sort((a, b) => {
    const firstTime = a?.timestamp?.seconds;
    const secondTime = b?.timestamp?.seconds;

    if (firstTime > secondTime) return 1;
    if (firstTime < secondTime) return -1;
    return 0;
  });

  return list;

}