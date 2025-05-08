import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, Modal, Alert, Switch } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';  // Asegúrate de tener esta librería instalada para usar el icono de la flecha.

const API_URL = 'http://192.168.1.77:8000/api/products';

const client = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category_id: '',
    available: true,
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setForm({ ...form, image: {
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: 'image/jpeg',
      }});
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('price', form.price);
    data.append('category_id', form.category_id || 0);
    data.append('available', form.available ? 1 : 0);  // Enviar el estado de disponibilidad

    if (form.image && form.image.uri) {
      data.append('image', {
        uri: form.image.uri,
        name: form.image.fileName || 'image.jpg',
        type: form.image.type || 'image/jpeg',
      });
    }

    try {
      if (form.id) {
        await axios.post(`${API_URL}/${form.id}?_method=PUT`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalVisible(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este producto?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      description: '',
      price: '',
      category_id: '',
      available: true,
      image: null,
    });
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
      category_id: item.category_id,
      available: item.available === 1,
      image: null, 
    });
    setModalVisible(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: `http://192.168.1.77:8000${item.image}` }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>Precio: ${item.price}</Text>
      <Text style={styles.availability}>Disponible: {item.available ? 'Sí' : 'No'}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openEdit(item)}>
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.productList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Text style={styles.addButtonText}>Agregar Producto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          
          <Text style={styles.header}>{form.id ? 'Editar' : 'Nuevo'} Producto</Text>
          <TextInput placeholder="Nombre" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} style={styles.input} />
          <TextInput placeholder="Descripción" value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} style={styles.input} />
          <TextInput placeholder="Precio" value={form.price} keyboardType="decimal-pad" onChangeText={(text) => setForm({ ...form, price: text })} style={styles.input} />
          <TextInput placeholder="Categoría ID" value={String(form.category_id)} keyboardType="numeric" onChangeText={(text) => setForm({ ...form, category_id: text })} style={styles.input} />

          {/* Solo mostrar el Switch en el formulario de edición */}
          <View style={styles.switchContainer}>
            <Text>Disponible:</Text>
            <Switch
              value={form.available}
              onValueChange={(value) => setForm({ ...form, available: value })}
            />
          </View>

          <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
            <Text style={styles.selectImageText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
          {form.image && <Image source={{ uri: form.image.uri }} style={styles.preview} />}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{form.id ? 'Actualizar' : 'Crear'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default client;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  card: { backgroundColor: '#fff', padding: 15, marginVertical: 10, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 18, color: '#333' },
  description: { fontSize: 14, color: '#666' },
  price: { fontSize: 16, color: '#28a745', fontWeight: 'bold' },
  availability: { fontSize: 14, color: '#333' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#f8c8d5', borderRadius: 5 },
  deleteButton: { backgroundColor: '#ffb6c1' },
  actionText: { color: '#fff', fontWeight: 'bold' },
  addButton: { backgroundColor: '#ffb6c1', paddingVertical: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  productList: { marginTop: 15 },
  modalContent: { flex: 1, backgroundColor: '#fff', padding: 20 },
  goBackButton: { marginTop: 20, marginBottom: 15, padding: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 8, borderRadius: 8, fontSize: 16 },
  preview: { width: '100%', height: 150, borderRadius: 10, marginTop: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  selectImageButton: { paddingVertical: 12, backgroundColor: '#ffb6c1', borderRadius: 5, marginVertical: 15, alignItems: 'center' },
  selectImageText: { color: '#fff', fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#f8c8d5', paddingVertical: 12, borderRadius: 5, flex: 1, marginRight: 10, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#ffb6c1', paddingVertical: 12, borderRadius: 5, flex: 1, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
});
