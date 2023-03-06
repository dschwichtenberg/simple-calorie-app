export const isOnSameDate = (date1, date2) => {
  if (!date1 || !date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isOnSameMonth = (date1, date2) => {
  if (!date1 || !date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const getCalorieToday = (products) => {
  const dayProducts = products.filter((product) =>
    isOnSameMonth(new Date(), new Date(product.date))
  );

  return dayProducts.reduce((total, current) => total + current.calorie, 0);
};

export const getTotalCalorie = (products) => {
  return products.reduce((total, current) => total + current.calorie, 0);
};

export const getPriceThisMonth = (products) => {
  const monthProducts = products.filter((product) =>
    isOnSameMonth(new Date(), new Date(product.date))
  );

  return monthProducts.reduce((total, current) => total + current.price, 0);
};

export const groupProductsByDate = (products) => {
  let grouped = [];

  let sorted = [...products];
  sorted = sorted.sort((a, b) =>
    new Date(a.date) < new Date(b.date) ? 1 : -1
  );

  let date = null;
  let dayProducts = [];
  sorted.map((product) => {
    if (!isOnSameDate(date, new Date(product.date))) {
      if (date !== null) {
        grouped.push({
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          entries: dayProducts,
        });
      }

      date = new Date(product.date);
      dayProducts = [product];
    } else {
      dayProducts.push(product);
    }
    return true;
  });

  if (date !== null) {
    grouped.push({
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      entries: dayProducts,
    });
  }
  return grouped;
};

export const filterProductsByProductName = (products, searchQuery) => {
  if (searchQuery.length > 0) {
    const filtered = products.filter(
      (prod) => prod.productName.toLowerCase() === searchQuery
    );

    return filtered;
  }
  return products;
};

export const filterProductsByUserName = (products, searchQuery) => {
  if (searchQuery.length > 0) {
    const filtered = products.filter(
      (prod) => prod.user.userName === searchQuery
    );

    return filtered;
  }
  return products;
};

export const filterProductsByDates = (products, dateRange) => {
  if (dateRange[0] || dateRange[1]) {
    const filtered = products.filter((prod) => {
      let result = true;
      if (dateRange[0]) {
        result = result && new Date(dateRange[0]) <= new Date(prod.date);
      }
      if (dateRange[1]) {
        let date = new Date(dateRange[1]);
        date = date.setDate(date.getDate() + 1);
        result = result && new Date(prod.date) <= date;
      }
      return result;
    });

    return filtered;
  }

  return products;
};
