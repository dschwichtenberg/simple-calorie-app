import axios from "axios";

const API_URL = "http://localhost:4000";

export const login = async (userId, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      userId,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/auth`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addProductEntry = async (product) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/add-entry`,
      {
        data: { ...product, token },
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addProduct = async (userId, product) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/add-product`,
      {
        data: { product, userId },
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateProduct = async (userId, product) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/update-product`,
      {
        data: { product, userId },
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const removeProduct = async (userId, entryId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/remove-product`,
      {
        data: { entryId, userId },
      },
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/all-products`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
