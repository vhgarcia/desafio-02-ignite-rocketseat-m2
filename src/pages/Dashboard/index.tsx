import { useEffect, useState } from "react";

import { Food } from "../../components/Food/index";
import { Header } from "../../components/Header/index";
import { ModalAddFood } from "../../components/ModalAddFood/index";
import ModalEditFood from "../../components/ModalEditFood/index";

import api from "../../services/api";

import { FoodsContainer } from "./styles";

interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<FoodInterface[]>([]);
  const [editingFood, setEditingFood] = useState<FoodInterface>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get("/foods");
      setFoods(response.data);
    }
    loadFoods();
  }, []);

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  async function handleAddFood(food: FoodInterface) {
    console.log(food);
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (error) {}
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  const handleEditFood = (food: FoodInterface) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleUpdateFood = async (food: FoodInterface) => {
    if (!editingFood) return;
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
};