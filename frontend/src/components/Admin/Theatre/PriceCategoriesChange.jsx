import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const PriceCategoriesChange = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [priceCategories, setPriceCategories] = useState([]);
    const [removeCategories, setRemoveCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ category_name: '', price: '' });

    useEffect(() => {
        const fetchPriceCategories = async () => {
            try {
                const response = await axiosPrivate.get(`seat_types/pricesByTheatre/${id}`);
                setPriceCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch price categories:", error);
            }
        };
        fetchPriceCategories();
    },[id]);


    const handleChange = (index, field, value) => {
        const updatedCategories = [...priceCategories];
        updatedCategories[index][field] = value;
        setPriceCategories(updatedCategories);
      };
    
      const handleAddCategory = () => {
        setPriceCategories([...priceCategories, { ...newCategory, theatre_id: id }]);
        setNewCategory({ category_name: '', price: '' });
      };
    
      const handleRemoveCategory = (index) => {
        
        handleDelete(index);

        const updatedCategories = priceCategories.filter((_, i) => i !== index);
        setPriceCategories(updatedCategories);

      };
      const handleDelete = async (index)=>{
        const priceCategory = priceCategories[index];
        try{
            const result = await axiosPrivate.delete(`/seat_types/prices`, {priceCategory});

        }catch(error){
          console.error('Failed to delete price category', error);
        }
      }
    
      const handleSave = async () => {
        try {
          await axiosPrivate.post(`/seat_types/prices/`, {priceCategories, id });
          alert('Price categories updated successfully');
          navigate(-1);
        } catch (error) {
          console.error('Failed to update price categories', error);
        }

        
      };
    
      return (
        <div>
          <h2>Price Categories</h2>
          {priceCategories.map((category, index) => (
            <div key={index} className="category-row">
              <input
                type="text"
                value={category.category_name}
                onChange={(e) => handleChange(index, 'category_name', e.target.value)}
                placeholder="Category Name"
              />
              <input
                type="number"
                value={category.price}
                onChange={(e) => handleChange(index, 'price', e.target.value)}
                placeholder="Price"
              />
              <button onClick={() => handleRemoveCategory(index)}>Remove</button>
            </div>
          ))}
          <div className="new-category">
            <input
              type="text"
              value={newCategory.category_name}
              onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
              placeholder="New Category Name"
            />
            <input
              type="number"
              value={newCategory.price}
              onChange={(e) => setNewCategory({ ...newCategory, price: e.target.value })}
              placeholder="New Price"
            />
            <button onClick={handleAddCategory}>Add Category</button>
          </div>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      );
    };

export default PriceCategoriesChange;