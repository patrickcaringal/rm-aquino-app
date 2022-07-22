// useEffect(() => {
//   setBackdropLoader(true);

//   const unsub = onSnapshot(
//     doc(db, "accounts", user.id),
//     (doc) => {
//       const userDoc = doc.data();
//       if (!userDoc) return;

//       const { familyMembers = [] } = userDoc;
//       setMembers(familyMembers);
//       setBackdropLoader(false);
//     },
//     (error) => {
//       openResponseDialog({
//         content: error,
//         type: "WARNING",
//       });
//     }
//   );

//   return () => unsub();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [user.id]);
