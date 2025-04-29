import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CONFIG } from '../config';
interface Props {
  item: {
    id: number;
    name: string;
    price: string;
    available: boolean;
    image?: string;
  };
  onDelete: (id: number) => void;
}

export default function ProductItem({ item, onDelete }: Props) {
  return (
    <View style={styles.productItem}>
      {item.image && (
        <Image
          source={{ uri: `${CONFIG.BASE_URL}/storage/${item.image}` }}
          style={styles.productImage}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text>${item.price}</Text>
        <Text>{item.available ? "Disponible" : "No disponible"}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
});
