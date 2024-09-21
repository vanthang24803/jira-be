const randomTaskCode = () => {
  let randomNumber = "";

  for (let i = 0; i < 5; i++) {
    randomNumber += Math.floor(Math.random() * 10).toString();
  }

  return randomNumber;
};

export { randomTaskCode };
