export const fetchData = async () => {
  try {
    const response = await fetch(
      "https://6321795182f8687273b291d3.mockapi.io/getUsers"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("API response:", data);
    return data;
    // Further processing with the API data can be done here
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
