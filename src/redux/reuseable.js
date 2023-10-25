
export const get = async key => {
  try {
    let value = localStorage.getItem(key);
    return value;
  } catch (error) {
    console.log("Error in getting data from local storage: ", error);
  }
};

export const save = async (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log("Error in saving data to local storage: ", error);
  }
};

export const remove = async key => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log("Error in removing data from local storage: ", error);
  }
};
