import { fetchPizzaStores } from "../../lib/pizza-stores";

const getPizzaStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchPizzaStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
};

export default getPizzaStoresByLocation;
