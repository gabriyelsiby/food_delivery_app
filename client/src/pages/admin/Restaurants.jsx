import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";  // Import the Input component

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);  // State to store the restaurant data
  const [name, setName] = useState(""); // For capturing input from the user for restaurant name
  const [email, setEmail] = useState(""); // For capturing input from the user for email
  const [location, setLocation] = useState(""); // For capturing input from the user for location
  const [cuisine, setCuisine] = useState(""); // For capturing input from the user for cuisine
  const [phone, setPhone] = useState(""); // For capturing input from the user for phone number
  const [isOpen, setIsOpen] = useState(true); // For capturing input for whether the restaurant is open or not

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/`);
        setRestaurants(data.data || []);  // Safeguard if no data is returned
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        setRestaurants([]);  // Reset restaurants state on error
      }
    };

    fetchRestaurants();
  }, []);

  // Handle new restaurant registration
  const handleRegisterRestaurant = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/restaurants/register`, {
        name,
        email,
        location,
        cuisine,
        phone,
        isOpen,
      });
      alert("Restaurant registered successfully!");
      setName("");  // Reset inputs after successful registration
      setEmail("");
      setLocation("");
      setCuisine("");
      setPhone("");
      setIsOpen(true);
      // Re-fetch the restaurant list
      const { data } = await axios.get(`${API_BASE_URL}/restaurants`);
      setRestaurants(data.data);
    } catch (error) {
      console.error("Failed to register restaurant:", error);
      alert("Failed to register restaurant");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Restaurants</h1>

      {/* Register new restaurant */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold">Register New Restaurant</h2>
          <div className="space-y-4">
            <Input
              label="Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div>
              <label className="block text-sm">Is Open</label>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleRegisterRestaurant}>Register</Button>
          </div>
        </CardContent>
      </Card>

      {/* Display list of restaurants */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Is Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">
                    No restaurants available
                  </TableCell>
                </TableRow>
              ) : (
                restaurants.map((restaurant) => (
                  <TableRow key={restaurant._id}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.email}</TableCell>
                    <TableCell>{restaurant.location}</TableCell>
                    <TableCell>{restaurant.cuisine}</TableCell>
                    <TableCell>{restaurant.phone}</TableCell>
                    <TableCell>{restaurant.isOpen ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantsPage;
