import React, { useEffect, useState } from "react";
import axios from "../../config/axiosInstance";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-toastify";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("/restaurants");
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch restaurants");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>

      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <Card key={r._id}>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <Badge variant={r.isOpen ? "success" : "destructive"}>
                    {r.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  📍 {r.location}
                </p>
                <p className="text-sm text-gray-600">🍽️ {r.cuisine}</p>
                <p className="text-sm text-gray-600">📞 {r.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
