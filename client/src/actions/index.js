import axios from "axios";
const client = axios.create();

export const getApiBusinesses = (userrole, userid) => {
  let link = "/api/business/businesses";
  if (userrole === "advertiser") {
    link = "/api/business/businesses/" + userid;
  }
  // console.log("getting businesses from api using axios");
  return client.get(link);
};
