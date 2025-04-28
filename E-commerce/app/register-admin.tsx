import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

import { GlobalStyles, Colors } from "../constants/Theme"; // cambia la ruta según tu estructura

export default function RegisterAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(3); // Default to Client
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Validar criterios de contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número."
      );
      return;
    }

    try {
      await axios.post("http://192.168.1.77:8000/api/register", {
        name,
        email,
        phone,
        password,
        role_id: role,
      });

      Alert.alert("¡Registro exitoso!", "Nuevo usuario registrado.");
      router.replace("/login"); // Redirigir a la vista de administrador
    } catch (error: any) {
      console.log("Error en el registro:", error);
      Alert.alert(
        "Error",
        "No se pudo registrar. Verifica los datos o intenta más tarde."
      );
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Registro de Nuevo Usuario</Text>

      {/* Input Nombre */}
      <Text style={GlobalStyles.label}>Nombre</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={GlobalStyles.input}
      />

      {/* Input Correo */}
      <Text style={GlobalStyles.label}>Correo</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={GlobalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Input Teléfono */}
      <Text style={GlobalStyles.label}>Teléfono</Text>
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={GlobalStyles.input}
        keyboardType="phone-pad"
      />

      {/* Contraseñas */}
      <Text style={GlobalStyles.label}>Contraseña</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={GlobalStyles.input}
        />
        <Text style={GlobalStyles.label}>Confirmar Contraseña</Text>
        <TextInput
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={GlobalStyles.input}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 15 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#gray"
          />
        </TouchableOpacity>
      </View>

      {/* Rol */}
      <Text style={GlobalStyles.label}>Rol</Text>
      <Picker
        selectedValue={role}
        onValueChange={setRole}
        style={GlobalStyles.picker}
      >
        <Picker.Item label="Cliente" value={3} />
        <Picker.Item label="Cajero" value={2} />
        <Picker.Item label="Administrador" value={1} />
      </Picker>

      {/* Botón */}
      <TouchableOpacity style={GlobalStyles.button} onPress={handleRegister}>
        <Text style={GlobalStyles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
