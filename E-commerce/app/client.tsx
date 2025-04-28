import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import ProductItem from "./ProductItem";
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category_id: number;
  image?: string;
  available: boolean;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({});
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get("http://192.168.1.77:8000/api/products");
    setProducts(response.data);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", form.name || "");
    formData.append("description", form.description || "");
    formData.append("price", form.price || "");
    formData.append("category_id", String(form.category_id || 1));
    formData.append("available", form.available ? "1" : "0");

    if (selectedImage) {
      formData.append("image", {
        uri: selectedImage.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
    }

    await axios.post("http://192.168.1.77:8000/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setForm({});
    setSelectedImage(null);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://192.168.1.77:8000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛒 Administración de Productos</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Nombre del producto"
          value={form.name || ""}
          onChangeText={(text) => setForm({ ...form, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Descripción"
          value={form.description || ""}
          onChangeText={(text) => setForm({ ...form, description: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Precio"
          value={form.price || ""}
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, price: text })}
          style={styles.input}
        />
        <View style={styles.switchContainer}>
          <Text>Disponible:</Text>
          <Switch
            value={form.available || false}
            onValueChange={(value) => setForm({ ...form, available: value })}
          />
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Ionicons name="image-outline" size={24} color="#4a4a4a" />
          <Text style={{ marginLeft: 8 }}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
        )}

        <Button title="Guardar Producto" onPress={handleSave} color="#4CAF50" />
      </View>

      <Text style={styles.subtitle}>📦 Productos Actuales</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem item={item} onDelete={handleDelete} />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  form: { marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePicker: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  previewImage: { width: 100, height: 100, marginVertical: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
});