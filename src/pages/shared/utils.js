export  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
export const getRandomNumber = ( min = 40, max = 95 ) => {return Math.floor(Math.random() * (max - min + 1)) + min;};
