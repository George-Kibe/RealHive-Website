import { getProperties } from "./queries"
import axios from "axios";

const getAllProperties = async () => {
    try {
      const apiKey = process.env.APPSYC_KEY
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      };

      const response = await axios.post(
        'https://tlnidffiuzdpvaojzuocbhtth4.appsync-api.eu-west-1.amazonaws.com/graphql',
        {
          query: getProperties,
        },
        { headers }
      );

      console.log("Response Data from AWS APPSyc API: ", response.data)
      return response?.data?.data?.listProperties?.items || []
    } catch (error) {
      console.error('Error:', error.message);
      return ["Error Fetching Properties"]
    }
  };

export default getAllProperties;